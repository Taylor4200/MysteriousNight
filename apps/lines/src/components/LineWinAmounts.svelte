<script lang="ts" module>
	import LineWinAmount, { type RawWin, type Win } from './LineWinAmount.svelte';

	export type EmitterEventLineWinAmounts = {
		type: 'showLineWinAmounts';
		wins: RawWin[];
	} | {
		type: 'lineWinAmountsHide';
	};
</script>

<script lang="ts">
	import { waitForResolve } from 'utils-shared/wait';

	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';

	const context = getContext();

	let wins: Win[] = $state([]);

	context.eventEmitter.subscribeOnMount({
		showLineWinAmounts: (emitterEvent) => {
			wins = emitterEvent.wins.map((rawWin) => ({ ...rawWin, oncomplete: () => {} }));
			
			// Set up completion handlers for each win amount
			const completionPromises = wins.map(async (win) => {
				await waitForResolve((resolve) => (win.oncomplete = resolve));
			});
			
			// Clear wins after all animations complete
			Promise.all(completionPromises).then(() => {
				wins = [];
			});
		},
		lineWinAmountsHide: () => {
			console.log('[LineWinAmounts] Hiding line win amounts - clearing wins array');
			// Immediately clear any remaining win amounts
			wins = [];
		},
	});
</script>

<BoardContainer>
	{#each wins as win}
		<LineWinAmount {win} />
	{/each}
</BoardContainer> 