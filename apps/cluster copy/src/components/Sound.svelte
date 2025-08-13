<script lang="ts" module>
	export type EmitterEventSound =
		| { type: 'soundMusic'; name: string }
		| { type: 'soundOnce'; name: string; forcePlay?: boolean }
		| { type: 'soundLoop'; name: string }
		| { type: 'soundStop'; name: string }
		| { type: 'soundFade'; name: string; from: number; to: number; duration: number }
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
			await waitForTimeout(SECOND);
		},
		soundPressGeneral: () => {},
		soundPressBet: () => {},
		// scatterCounter
		soundScatterCounterIncrease: () => (context.stateGame.scatterCounter = context.stateGame.scatterCounter + 1), // prettier-ignore
		soundScatterCounterClear: () => (context.stateGame.scatterCounter = 0),
		// game
		soundMusic: () => {},
		soundLoop: () => {},
		soundOnce: () => {},
		soundStop: () => {},
		soundFade: async () => await waitForTimeout(SECOND),
	});

	onMount(() => {
		if (stateBet.activeBetModeKey === 'SUPERSPIN') {
			// no-op in assetless build
		} else {
			// no-op in assetless build
		}
	});
</script>
