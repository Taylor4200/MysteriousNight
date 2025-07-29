<script lang="ts">
	import { Container } from 'pixi-svelte';
	import SymbolAnimated from './SymbolAnimated.svelte';
	import { onMount } from 'svelte';

	// Static position for the bat group
	const batX = 200;
	const batY = 100;

	// Scale for bats
	const batScale = 0.8;

	onMount(() => {
		console.log('[AmbientBats] Starting bat animations');
	});
</script>

<!-- Static ambient bats - movement handled by spritesheet animation -->
<Container x={batX} y={batY} scale={batScale}>
	<SymbolAnimated 
		animationType="ambient_bats"
		x={1350}
		y={100}
		anchor={0.5}
	/>
</Container> 