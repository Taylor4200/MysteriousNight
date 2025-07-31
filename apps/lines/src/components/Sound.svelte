<script lang="ts" module>
	import { sound, type MusicName, type SoundEffectName, type SoundName } from '../game/sound';

	export type EmitterEventSound =
		| { type: 'soundMusic'; name: MusicName }
		| { type: 'soundOnce'; name: SoundEffectName; forcePlay?: boolean }
		| { type: 'soundLoop'; name: SoundEffectName }
		| { type: 'soundStop'; name: SoundName }
		| { type: 'soundFade'; name: SoundName; from: number; to: number; duration: number }
		| { type: 'soundScatterCounterIncrease' }
		| { type: 'soundScatterCounterClear' };
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { waitForTimeout } from 'utils-shared/wait';
	import { SECOND } from 'constants-shared/time';
	import { stateBet } from 'state-shared';

	import { getContext } from '../game/context';

	const context = getContext();

	context.eventEmitter.subscribeOnMount({
		// ui
		soundBetMode: async ({ betModeKey }) => {
			console.log(`🔊 [SOUND DEBUG] soundBetMode triggered with betModeKey: ${betModeKey}`);
			if (betModeKey === 'SUPERSPIN') {
				// check if SUPERSPIN, when changing the bet mode.
				console.log(`🔊 [SOUND DEBUG] Playing WinLevel-Nice (SUPERSPIN transition)`);
				sound.players.once.play({ name: 'WinLevel-Nice' });
				await waitForTimeout(SECOND);
				console.log(`🔊 [SOUND DEBUG] Playing Freespin_music (SUPERSPIN music)`);
				sound.players.music.play({ name: 'Freespin_music' });
			} else {
				console.log(`🔊 [SOUND DEBUG] Playing Basegame_music (normal bet mode)`);
				sound.players.music.play({ name: 'Basegame_music' });
			}
		},
		soundPressGeneral: () => {
			console.log(`🔊 [SOUND DEBUG] soundPressGeneral - Playing BtnGeneral`);
			sound.players.once.play({ name: 'BtnGeneral' });
		},
		soundPressBet: () => {
			console.log(`🔊 [SOUND DEBUG] soundPressBet - Playing Spin`);
			sound.players.once.play({ name: 'Spin' });
		},
		// scatterCounter
		soundScatterCounterIncrease: () => {
			console.log(`🔊 [SOUND DEBUG] soundScatterCounterIncrease - Incrementing scatter counter`);
			(context.stateGame.scatterCounter = context.stateGame.scatterCounter + 1);
		},
		soundScatterCounterClear: () => {
			console.log(`🔊 [SOUND DEBUG] soundScatterCounterClear - Clearing scatter counter`);
			(context.stateGame.scatterCounter = 0);
		},
		// game
		soundMusic: ({ name }) => {
			console.log(`🔊 [SOUND DEBUG] soundMusic - Playing music: ${name}`);
			sound.players.music.play({ name });
		},
		soundLoop: ({ name }) => {
			console.log(`🔊 [SOUND DEBUG] soundLoop - Starting loop: ${name}`);
			sound.players.loop.play({ name });
		},
		soundOnce: ({ name, forcePlay }) => {
			console.log(`🔊 [SOUND DEBUG] soundOnce - Playing once: ${name}${forcePlay ? ' (forcePlay: true)' : ''}`);
			sound.players.once.play({ name, forcePlay });
		},
		soundStop: ({ name }) => {
			console.log(`🔊 [SOUND DEBUG] soundStop - Stopping: ${name}`);
			sound.stop({ name });
		},
		soundFade: async ({ name, duration, from, to }) => {
			console.log(`🔊 [SOUND DEBUG] soundFade - Fading ${name} from ${from} to ${to} over ${duration}ms`);
			await sound.fade({ name, duration, from, to });
		},
	});

	onMount(() => {
		console.log(`🔊 [SOUND DEBUG] onMount - Initial music setup with activeBetModeKey: ${stateBet.activeBetModeKey}`);
		if (stateBet.activeBetModeKey === 'SUPERSPIN') {
			// check if SUPERSPIN, when resume bet and the bet is a super spin.
			console.log(`🔊 [SOUND DEBUG] onMount - Playing Freespin_music (SUPERSPIN on mount)`);
			sound.players.music.play({ name: 'Freespin_music' });
		} else {
			console.log(`🔊 [SOUND DEBUG] onMount - Playing Basegame_music (normal on mount)`);
			sound.players.music.play({ name: 'Basegame_music' });

			//How to control volume per soundfile(use fade)
			// sound.players.music.fade({ name: 'Basegame_music', from: 0, to: 1, duration: 2000 });

			//How to control rate per soundfile
			// sound.players.music.rate({ rate: 2, name: 'Basegame_music'}); // change play back rate(1: default, 0: slow, 1+ fasterm and higher pitch )
		}
	});
</script>
