<script lang="ts">
	import { onMount } from 'svelte';
	import SymbolAnimated from './SymbolAnimated.svelte';
	import { getContext } from '../game/context';
	import type { ANIMATION_CONFIGS } from '../game/animationManager';

	const context = getContext();

	let activeAnimations: Array<{
		id: string;
		animationType: keyof typeof ANIMATION_CONFIGS;
		x: number;
		y: number;
	}> = $state([]);

	// Listen for game events that should trigger animations
	context.eventEmitter.subscribeOnMount({
		wildWin: (event) => {
			// Trigger wild hit animation when wild symbols are part of a win
			if (event.positions) {
				event.positions.forEach((position, index) => {
					activeAnimations.push({
						id: `wild-hit-${Date.now()}-${index}`,
						animationType: 'wild_hit',
						x: position.x,
						y: position.y,
					});
				});
			}
		},
	});

	function removeAnimation(animationId: string) {
		activeAnimations = activeAnimations.filter(anim => anim.id !== animationId);
	}
</script>

{#each activeAnimations as animation (animation.id)}
	<SymbolAnimated
		animationType={animation.animationType}
		x={animation.x}
		y={animation.y}
		oncomplete={() => removeAnimation(animation.id)}
	/>
{/each} 