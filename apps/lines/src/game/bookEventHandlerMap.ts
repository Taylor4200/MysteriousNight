import _ from 'lodash';

import { recordBookEvent, checkIsMultipleRevealEvents, type BookEventHandlerMap } from 'utils-book';
import { stateBet, stateUi } from 'state-shared';
import { sequence } from 'utils-shared/sequence';

import { eventEmitter } from './eventEmitter';
import { playBookEvent } from './utils';
import { winLevelMap, type WinLevel, type WinLevelData } from './winLevelMap';
import { stateGame, stateGameDerived } from './stateGame.svelte';
import type { BookEvent, BookEventOfType, BookEventContext } from './typesBookEvent';
import type { Position } from './types';
import config from './config';

const winLevelSoundsPlay = ({ winLevelData }: { winLevelData: WinLevelData }) => {
	console.log(`🔊 [WIN DEBUG] winLevelSoundsPlay - Playing sounds for win level: ${winLevelData.type} (alias: ${winLevelData.alias})`);
	
	if (winLevelData?.alias === 'max') eventEmitter.broadcastAsync({ type: 'uiHide' });
	if (winLevelData?.sound?.sfx) {
		console.log(`🔊 [WIN DEBUG] Playing SFX: ${winLevelData.sound.sfx}`);
		eventEmitter.broadcast({ type: 'soundOnce', name: winLevelData.sound.sfx });
	}
	if (winLevelData?.sound?.bgm) {
		console.log(`🔊 [WIN DEBUG] Playing BGM: ${winLevelData.sound.bgm}`);
		eventEmitter.broadcast({ type: 'soundMusic', name: winLevelData.sound.bgm });
	}
	if (winLevelData?.type === 'big') {
		console.log(`🔊 [WIN DEBUG] Playing CoinLoopBigWins (big win loop)`);
		eventEmitter.broadcast({ type: 'soundLoop', name: 'CoinLoopBigWins' });
	}
};

const winLevelSoundsStop = () => {
	console.log(`🔊 [WIN DEBUG] winLevelSoundsStop - Stopping win sounds and resuming background music`);
	eventEmitter.broadcast({ type: 'soundStop', name: 'CoinLoopBigWins' });
	if (stateBet.activeBetModeKey === 'SUPERSPIN' || stateGame.gameType === 'freegame') {
		// check if SUPERSPIN, when finishing a bet.
		console.log(`🔊 [WIN DEBUG] Resuming Freespin_music (SUPERSPIN/freegame mode)`);
		eventEmitter.broadcast({ type: 'soundMusic', name: 'Freespin_music' });
	} else {
		console.log(`🔊 [WIN DEBUG] Resuming Basegame_music (normal mode)`);
		eventEmitter.broadcast({ type: 'soundMusic', name: 'Basegame_music' });
	}
	eventEmitter.broadcastAsync({ type: 'uiShow' });
};

const animateSymbols = async ({ positions }: { positions: Position[] }) => {
	eventEmitter.broadcast({ type: 'boardShow' });
	await eventEmitter.broadcastAsync({
		type: 'boardWithAnimateSymbols',
		symbolPositions: positions,
	});
};

export const bookEventHandlerMap: BookEventHandlerMap<BookEvent, BookEventContext> = {
	reveal: async (bookEvent: BookEventOfType<'reveal'>, { bookEvents }: BookEventContext) => {
		console.log('[Lines Game] reveal handler called');
		const isBonusGame = checkIsMultipleRevealEvents({ bookEvents });
		if (isBonusGame) {
			eventEmitter.broadcast({ type: 'stopButtonEnable' });
			recordBookEvent({ bookEvent });
		}

		stateGame.gameType = bookEvent.gameType;
		await stateGameDerived.enhancedBoard.spin({
			revealEvent: bookEvent,
			paddingBoard: config.paddingReels[bookEvent.gameType],
		});
		eventEmitter.broadcast({ type: 'soundScatterCounterClear' });
		console.log('[Lines Game] reveal handler completed');
	},
	winInfo: async (bookEvent: BookEventOfType<'winInfo'>) => {
		console.log('[Lines Game] winInfo handler called');
		// Update WIN bar immediately
		stateBet.winBookEventAmount = bookEvent.totalWin;
		
		// Show individual win amounts (non-blocking)
		await eventEmitter.broadcastAsync({
			type: 'showLineWinAmounts',
			wins: bookEvent.wins.map((win) => {
				// Calculate average position for display
				const avgReel = Math.round(win.positions.reduce((sum, pos) => sum + pos.reel, 0) / win.positions.length);
				const avgRow = Math.round(win.positions.reduce((sum, pos) => sum + pos.row, 0) / win.positions.length);
				
				return {
					win: win.meta.winWithoutMult,
					mult: win.meta.globalMult,
					result: win.meta.winWithoutMult * win.meta.globalMult,
					reel: avgReel,
					row: avgRow,
				};
			}),
		});

		// Play sound and animate symbols with timeout
		eventEmitter.broadcast({ type: 'soundOnce', name: 'WinLevel_Small' });
		
		// Create a timeout promise that resolves after 1 second (30 frames at 30fps)
		const timeoutPromise = new Promise(resolve => setTimeout(resolve, 1000));
		
		// Try to animate symbols, but don't wait forever
		const animationPromise = Promise.all(bookEvent.wins.map(async (win) => {
			await animateSymbols({ positions: win.positions });
		}));
		
		// Wait for either animations to complete OR timeout
		await Promise.race([animationPromise, timeoutPromise]);
		
		console.log('[Lines Game] winInfo handler completed');
	},
	setTotalWin: async (bookEvent: BookEventOfType<'setTotalWin'>) => {
		console.log('[Lines Game] setTotalWin handler called');
		stateBet.winBookEventAmount = bookEvent.amount;
		console.log('[Lines Game] setTotalWin handler completed');
	},
	freeSpinTrigger: async (bookEvent: BookEventOfType<'freeSpinTrigger'>) => {
		console.log(`🔊 [BONUS DEBUG] freeSpinTrigger - Starting bonus game with ${bookEvent.totalFs} free spins`);
		
		// animate scatters
		console.log(`🔊 [BONUS DEBUG] Playing ScatterWinV2 (scatter win sound)`);
		eventEmitter.broadcast({ type: 'soundOnce', name: 'ScatterWinV2' });
		await animateSymbols({ positions: bookEvent.positions });
		
		// show bonus game chests
		console.log(`🔊 [BONUS DEBUG] Playing FsRespin (free spin respin sound)`);
		eventEmitter.broadcast({ type: 'soundOnce', name: 'FsRespin' });
		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		await eventEmitter.broadcastAsync({ type: 'transition' });
		eventEmitter.broadcast({ type: 'bonusGameChestsShow' });
		
		console.log(`🔊 [BONUS DEBUG] Playing Freespin_music (bonus game music)`);
		eventEmitter.broadcast({ type: 'soundMusic', name: 'Freespin_music' });
		
		await eventEmitter.broadcastAsync({
			type: 'bonusGameChestsUpdate',
			totalFreeSpins: bookEvent.totalFs,
		});
		stateGame.gameType = 'freegame';
		eventEmitter.broadcast({ type: 'bonusGameChestsHide' });
		eventEmitter.broadcast({ type: 'boardFrameGlowShow' });
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		stateUi.freeSpinCounterShow = true;
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: undefined,
			total: bookEvent.totalFs,
		});
		stateUi.freeSpinCounterTotal = bookEvent.totalFs;
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerButtonShow' });
		eventEmitter.broadcast({ type: 'drawerFold' });
		
		console.log(`🔊 [BONUS DEBUG] freeSpinTrigger - Bonus game setup completed`);
	},
	updateFreeSpin: async (bookEvent: BookEventOfType<'updateFreeSpin'>) => {
		eventEmitter.broadcast({ type: 'freeSpinCounterShow' });
		stateUi.freeSpinCounterShow = true;
		eventEmitter.broadcast({
			type: 'freeSpinCounterUpdate',
			current: bookEvent.amount + 1,
			total: bookEvent.total,
		});
		stateUi.freeSpinCounterTotal = bookEvent.amount + 1;
		stateUi.freeSpinCounterTotal = bookEvent.total;
	},
	freeSpinEnd: async (bookEvent: BookEventOfType<'freeSpinEnd'>) => {
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];

		await eventEmitter.broadcastAsync({ type: 'uiHide' });
		stateGame.gameType = 'basegame';
		eventEmitter.broadcast({ type: 'boardFrameGlowHide' });
		eventEmitter.broadcast({ type: 'freeSpinOutroShow' });
		eventEmitter.broadcast({ type: 'soundOnce', name: 'Sfx-You-Won-Panel' });
		winLevelSoundsPlay({ winLevelData });
		await eventEmitter.broadcastAsync({
			type: 'freeSpinOutroCountUp',
			amount: bookEvent.amount,
			winLevelData,
		});
		winLevelSoundsStop();
		eventEmitter.broadcast({ type: 'freeSpinOutroHide' });
		eventEmitter.broadcast({ type: 'freeSpinCounterHide' });
		stateUi.freeSpinCounterShow = false;
		await eventEmitter.broadcastAsync({ type: 'transition' });
		await eventEmitter.broadcastAsync({ type: 'uiShow' });
		await eventEmitter.broadcastAsync({ type: 'drawerUnfold' });
		eventEmitter.broadcast({ type: 'drawerButtonHide' });
	},
	setWin: async (bookEvent: BookEventOfType<'setWin'>) => {
		const winLevelData = winLevelMap[bookEvent.winLevel as WinLevel];
		const isBigWin = winLevelData.type === 'big';

		if (isBigWin) {
			// Big wins (levels 6+): Show full celebration screen
			eventEmitter.broadcast({ type: 'winShow' });
			winLevelSoundsPlay({ winLevelData });
			await eventEmitter.broadcastAsync({
				type: 'winUpdate',
				amount: bookEvent.amount,
				winLevelData,
			});
			winLevelSoundsStop();
			eventEmitter.broadcast({ type: 'winHide' });
		} else {
			// Small/medium wins (levels 1-5): Just update WIN bar, no celebration
			// WIN bar is already updated above via stateBet.winBookEventAmount
		}
	},
	finalWin: async (bookEvent: BookEventOfType<'finalWin'>) => {
		console.log('[Lines Game] finalWin handler called - cleaning up UI elements');
		// Clean up any remaining UI elements from the spin
		eventEmitter.broadcast({ type: 'lineWinAmountsHide' });
	},
	// customised
	createBonusSnapshot: async (bookEvent: BookEventOfType<'createBonusSnapshot'>) => {
		const { bookEvents } = bookEvent;

		function findLastBookEvent<T>(type: T) {
			return _.findLast(bookEvents, (bookEvent) => bookEvent.type === type) as
				| BookEventOfType<T>
				| undefined;
		}

		const lastFreeSpinTriggerEvent = findLastBookEvent('freeSpinTrigger' as const);
		const lastUpdateFreeSpinEvent = findLastBookEvent('updateFreeSpin' as const);
		const lastSetTotalWinEvent = findLastBookEvent('setTotalWin' as const);
		const lastUpdateGlobalMultEvent = findLastBookEvent('updateGlobalMult' as const);

		if (lastFreeSpinTriggerEvent) await playBookEvent(lastFreeSpinTriggerEvent, { bookEvents });
		if (lastUpdateFreeSpinEvent) playBookEvent(lastUpdateFreeSpinEvent, { bookEvents });
		if (lastSetTotalWinEvent) playBookEvent(lastSetTotalWinEvent, { bookEvents });
		if (lastUpdateGlobalMultEvent) playBookEvent(lastUpdateGlobalMultEvent, { bookEvents });
	},
};
