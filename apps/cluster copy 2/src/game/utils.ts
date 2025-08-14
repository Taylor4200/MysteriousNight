import _ from 'lodash';
import { stateBet } from 'state-shared';
import { createPlayBookUtils } from 'utils-book';
import { createGetEmptyPaddedBoard } from 'utils-slots';

import { SYMBOL_SIZE, REEL_PADDING, SYMBOL_INFO_MAP, BOARD_DIMENSIONS } from './constants';
import { stateLayoutDerived } from './stateLayout';
import { eventEmitter } from './eventEmitter';
import { bookEventAmountToNormalisedAmount } from 'utils-shared/amount';
import { BOOK_AMOUNT_MULTIPLIER } from 'constants-shared/bet';
import type { Bet, BookEventOfType } from './typesBookEvent';
import { bookEventHandlerMap } from './bookEventHandlerMap';
import type { RawSymbol, SymbolState } from './types';

// general utils
export const { getEmptyBoard } = createGetEmptyPaddedBoard({ reelsDimensions: BOARD_DIMENSIONS });
export const { playBookEvent, playBookEvents } = createPlayBookUtils({ bookEventHandlerMap });
export const playBet = async (bet: Bet) => {
    stateBet.winBookEventAmount = 0;
    const state = (bet as any).state ?? (bet as any).events ?? [];
    await playBookEvents(state);
    eventEmitter.broadcast({ type: 'stopButtonEnable' });
};

// Play the current runner UX from a generic book. Keeps visuals intact and ignores slot board logic.
export const playRunnerFromBook = async (bet: Bet) => {
  const state: Array<BookEventOfType<any>> = ((bet as any).state ?? (bet as any).events ?? []) as Array<BookEventOfType<any>>;

  // Determine total win from book; prefer setTotalWin; fallback to finalWin/setWin of last entry
  const lastSetTotal = [...state].reverse().find((e) => e.type === 'setTotalWin') as BookEventOfType<'setTotalWin'> | undefined;
  const lastFinal = [...state].reverse().find((e) => e.type === 'finalWin') as BookEventOfType<'finalWin'> | undefined;
  const lastSetWin = [...state].reverse().find((e) => e.type === 'setWin') as BookEventOfType<'setWin'> | undefined;
  const bookAmount = lastSetTotal?.amount ?? lastFinal?.amount ?? lastSetWin?.amount ?? 0;
  const isLoss = bookAmount <= 0;

  // Knight's Favor (optional) — read from book or roll per game mode
  const favorEvent = state.find((e) => (e as any).type === 'setKnightFavor') as BookEventOfType<'setKnightFavor'> | undefined;
  const isBonusMode = state.some((e) => (e as any).type === 'freeSpinTrigger' || (e as any).type === 'freeSpinRetrigger' || (e as any).type === 'updateFreeSpin');
  const rollFavorBase = () => {
    // Base: allowed values with strong bias to low
    const values = [1, 2, 3, 5, 10, 20, 25, 50, 100];
    const weights = [55, 22, 10, 6, 3, 2, 1, 0.8, 0.2]; // sums to 100-ish
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < values.length; i++) { r -= weights[i]; if (r <= 0) return values[i]; }
    return 1;
  };
  const rollFavorBonus = () => {
    // Bonus: min 5x, increased chance of higher multipliers
    const values = [5, 10, 20, 25, 50, 100];
    const weights = [35, 25, 18, 12, 7, 3];
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < values.length; i++) { r -= weights[i]; if (r <= 0) return values[i]; }
    return 5;
  };
  const knightsFavor = Math.max(1, favorEvent?.mult ?? (isBonusMode ? rollFavorBonus() : rollFavorBase()));

  // Meat disabled: do not schedule or spawn meats
  const scheduleMeats = async () => {};

  // Tease stages for losses
  const teaseStagesMult = isLoss ? [1, 2, 5, 25, 50, 100] : undefined;

  // Pre-reset scene and center the player before Knight's Favor starts
  eventEmitter.broadcast({ type: 'resetBackground' } as any);
  eventEmitter.broadcast({ type: 'cameraMoved', worldX: 0 } as any);
  eventEmitter.broadcast({ type: 'playerStopRunning' } as any);
  // Play Knight's Favor animation first (always, default x1 if not provided)
  {
    eventEmitter.broadcast({ type: 'knightsFavorStart', mult: knightsFavor, mode: isBonusMode ? 'bonus' : 'base' } as any);
    // Wait for reel animation duration deterministically
    await new Promise((r) => setTimeout(r, 2900));
  }

  await playRunnerFake({ totalWin: bookAmount, stumble: isLoss, teaseStagesMult, knightsFavor });
};

// Runner-mode fake book trigger: visually run, optionally stumble, and send win
// This wires to Storybook's Action button for MODE_BASE
export const playRunnerFake = async ({
  totalWin,
  stumble,
  teaseStagesMult,
  knightsFavor,
}: {
  totalWin: number; // book-event units (BOOK_AMOUNT_MULTIPLIER based)
  stumble: boolean;
  teaseStagesMult?: number[]; // optional tease checkpoints in multiplier units (x)
  knightsFavor?: number;
}) => {
  // Reset spin panel win at the start of a new run
  stateBet.winBookEventAmount = 0;
  // Start the run visuals (engages spin)
  // Hide global UI spin panel and controls during runner mode
  eventEmitter.broadcast({ type: 'uiHide' } as any);
  eventEmitter.broadcast({ type: 'playerStartRunning' } as any);
  eventEmitter.broadcast({ type: 'runnerModeEnable', enabled: true } as any);
  eventEmitter.broadcast({ type: 'runnerWinTarget', amount: totalWin } as any);
  // Also reset parallax to first frame at the start of each action
  eventEmitter.broadcast({ type: 'resetBackground' } as any);
  // Freeze the counter to the hero's starting head position so it doesn't shake on camera follow
  const startX = stateLayoutDerived.mainLayout().width * 0.45;
  const startY = stateLayoutDerived.mainLayout().height * 0.67;
  eventEmitter.broadcast({ type: 'runnerFreezePos', x: startX, y: startY } as any);
  // Simulate acceleration and movement for ~2.2s using the same screen Y/X as debug A/D flow
  let worldX = 0;
  let speed = 120; // px/sec
  const maxSpeed = 480;
  const accel = 280; // px/sec^2
  const start = performance.now();
  let last = start;
  // Slightly offset left so the label above the head stays fully on-screen
  const screenCenterX = stateLayoutDerived.mainLayout().width * 0.45;
  const playerScreenY = stateLayoutDerived.mainLayout().height * 0.67;
  const bet = (stateBet as any).betAmount || 1;
  // Compute run multiplier against the wagered bet at play time to avoid UI bet changes (visuals only)
  const runMultiplier = (totalWin / BOOK_AMOUNT_MULTIPLIER);

  // Exponential ramp: rate r(t) = r0 * exp(g*t), value m(t) = (r0/g)*(exp(g*t)-1)
  const r0 = 0.08; // start rate (x per sec) — start a bit faster
  const g = 0.42;  // stronger growth per sec for faster ramp
  const solveDurationForMultiplier = (M: number) => {
    if (M <= 0) return 0;
    return Math.log(1 + (g * M) / r0) / g;
  };
  // Choose the effective target based on result.
  // For wins we target the exact book multiplier. For losses we target a random "tease" multiplier.
  const chooseTeaseTarget = (list?: number[]) => {
    const defaults = [1, 1.5, 2, 3, 5, 8, 10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500];
    const pool = (list && list.length > 0) ? list.slice() : defaults;
    // Bias toward lower values but still allow big teases occasionally
    const r = Math.pow(Math.random(), 1.6);
    const idx = Math.min(pool.length - 1, Math.floor(r * pool.length));
    return Math.max(0.5, pool[idx]);
  };
  const targetMultiplier = stumble ? chooseTeaseTarget(teaseStagesMult) : runMultiplier;
  const duration = solveDurationForMultiplier(targetMultiplier);
  // Inform UI of the target multiplier so visual boosts (meat) can clamp
  eventEmitter.broadcast({ type: 'runnerTargetMult', mult: targetMultiplier } as any);
  while (true) {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    const elapsed = (now - start) / 1000;

    // Counter progress via exponential ramp
    const counterValue = (r0 / g) * (Math.exp(g * elapsed) - 1);
    let tNorm = Math.max(0, Math.min(1, counterValue / (targetMultiplier || 1))); // normalized fraction of target

    // Movement speed follows counter rate r(t)
    const counterRate = r0 * Math.exp(g * elapsed); // x per second
    const BASE_SPEED = 360; // faster baseline to match floor
    const desiredSpeed = Math.min(maxSpeed, BASE_SPEED + counterRate * 180);
    // Smoothly approach desiredSpeed; increase responsiveness over time
    const response = Math.min(1, (1 + elapsed * 0.9) * dt * 5);
    speed = speed + (desiredSpeed - speed) * response;
    const dx = speed * dt;
    worldX += dx;
    // Broadcast movement for background, particles, counters, etc.
    eventEmitter.broadcast({ type: 'playerMoved', dx, playerX: screenCenterX, playerY: playerScreenY } as any);
    eventEmitter.broadcast({ type: 'cameraMoved', worldX } as any);
    // Compute multiplier deterministically from time
    const mult = Math.min(targetMultiplier, counterValue);
    tNorm = (targetMultiplier > 0) ? mult / targetMultiplier : 0;
    eventEmitter.broadcast({ type: 'runnerProgress', t: tNorm } as any);
    eventEmitter.broadcast({ type: 'runnerCounterRate', rate: counterRate } as any);
    eventEmitter.broadcast({ type: 'runnerSpeed', pxPerSec: desiredSpeed } as any);
    // Drive the on-head counter to show the exact multiplier (win/bet)
    eventEmitter.broadcast({ type: 'runnerCounterSet', mult } as any);
    await new Promise((r) => setTimeout(r, 16));
    // End conditions
    if (elapsed >= duration) break;
  }
  if (stumble) {
    // End run with stumble; no win collected
    // Snap to tease target visually and tint red, then stumble
    const finalMult = Math.max(0, targetMultiplier);
    eventEmitter.broadcast({ type: 'runnerProgress', t: finalMult > 0 ? 1 : 0 } as any);
    eventEmitter.broadcast({ type: 'runnerCounterSet', mult: finalMult } as any);
    eventEmitter.broadcast({ type: 'runnerTint', color: 'loss' } as any);
    eventEmitter.broadcast({ type: 'playerStumbled' } as any);
    eventEmitter.broadcast({ type: 'playerStopRunning' } as any);
    eventEmitter.broadcast({ type: 'runnerModeEnable', enabled: false } as any);
    // Restore UI when run ends on a loss
    eventEmitter.broadcast({ type: 'uiShow' } as any);
    return;
  }
  // Successful run: continue running off-screen before resolving
  // Keep progress at 1 and push the hero to the right edge visually
  eventEmitter.broadcast({ type: 'runnerProgress', t: 1 } as any);
  eventEmitter.broadcast({ type: 'runnerCounterSet', mult: runMultiplier } as any);

  // Notify scene to accept external position control for the exit phase
  eventEmitter.broadcast({ type: 'runnerExitStart' } as any);

  let playerScreenX = screenCenterX;
  const screenW = stateLayoutDerived.mainLayout().width;
  const runOffscreenMargin = 120; // px beyond right edge
  while (playerScreenX < screenW + runOffscreenMargin) {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    // Maintain high speed while exiting
    const exitRate = r0 * Math.exp(g * duration); // lock to end-rate
    const exitDesiredSpeed = 1600; // super fast constant exit speed for smooth zoom
    speed = speed + (exitDesiredSpeed - speed) * Math.min(1, dt * 10);
    const dx = speed * dt;
    worldX += dx;
    playerScreenX += exitDesiredSpeed * dt; // move hero on-screen to the right
    eventEmitter.broadcast({ type: 'playerMoved', dx, playerX: playerScreenX, playerY: playerScreenY } as any);
    eventEmitter.broadcast({ type: 'cameraMoved', worldX } as any);
    await new Promise((r) => setTimeout(r, 16));
  }

  // Celebrate: apply Knights Favor visually to the counter and then stop
  eventEmitter.broadcast({ type: 'runnerTint', color: 'win' } as any);
  // Apply multiplied total to counter to reflect final multiplier
  const finalMultForCounter = runMultiplier * (knightsFavor ?? 1);
  eventEmitter.broadcast({ type: 'runnerCounterSet', mult: finalMultForCounter } as any);
  eventEmitter.broadcast({ type: 'runnerCelebrate' } as any);
  // keep counter visible until next action
  eventEmitter.broadcast({ type: 'runnerModeEnable', enabled: false } as any);
  eventEmitter.broadcast({ type: 'runnerExitEnd' } as any);
  eventEmitter.broadcast({ type: 'playerStopRunning' } as any);
  // Restore UI when run ends on a win
  eventEmitter.broadcast({ type: 'uiShow' } as any);
  // Update spin panel win label immediately (book units) with Knight's Favor applied to payout
  const finalAmount = Math.round(totalWin * (knightsFavor ?? 1));
  stateBet.winBookEventAmount = finalAmount;
  // Optional: fire-and-forget book UI if you want the win panel; do not await to avoid blocking story action
  // void playBookEvents([
  //   { index: 0, type: 'setTotalWin', amount: totalWin } as any,
  //   { index: 1, type: 'setWin', amount: totalWin, winLevel: 1 } as any,
  //   { index: 2, type: 'finalWin', amount: totalWin } as any,
  // ]);
};

// resume bet
const BOOK_EVENT_TYPES_TO_RESERVE_FOR_SNAPSHOT = [
	'updateGlobalMult',
	'freeSpinTrigger',
	'updateFreeSpin',
	'setTotalWin',
];

export const convertTorResumableBet = (lastBetData: Bet) => {
    const resumingIndex = Number((lastBetData as any).event);
    const state: Array<BookEventOfType<any>> = ((lastBetData as any).state ?? (lastBetData as any).events ?? []) as Array<BookEventOfType<any>>;
    const bookEventsBeforeResume = state.filter((_: BookEventOfType<any>, eventIndex: number) => eventIndex < resumingIndex);
    const bookEventsAfterResume = state.filter((_: BookEventOfType<any>, eventIndex: number) => eventIndex >= resumingIndex);

    const bookEventToCreateSnapshot: BookEventOfType<'createBonusSnapshot'> = {
		index: 0,
		type: 'createBonusSnapshot',
        bookEvents: bookEventsBeforeResume.filter((bookEvent: BookEventOfType<any>) =>
			BOOK_EVENT_TYPES_TO_RESERVE_FOR_SNAPSHOT.includes(bookEvent.type),
		),
	};

	const stateToResume = [bookEventToCreateSnapshot, ...bookEventsAfterResume];

	return { ...lastBetData, state: stateToResume };
};

// other utils
export const getSymbolX = (reelIndex: number) => SYMBOL_SIZE * (reelIndex + REEL_PADDING);
export const getSymbolY = (symbolIndexOfBoard: number) => (symbolIndexOfBoard + 0.5) * SYMBOL_SIZE;

export const getSymbolKey = ({ rawSymbol }: { rawSymbol: RawSymbol }) => {
	if (rawSymbol.multiplier !== undefined) {
		return `${rawSymbol.name}_${rawSymbol.multiplier}` as keyof typeof SYMBOL_INFO_MAP;
	}
	return rawSymbol.name as keyof typeof SYMBOL_INFO_MAP;
};

export const getSymbolInfo = ({
	rawSymbol,
	state,
}: {
	rawSymbol: RawSymbol;
	state: SymbolState;
}) => {
	const symbolKey = getSymbolKey({ rawSymbol });
	return SYMBOL_INFO_MAP[symbolKey][state];
};
