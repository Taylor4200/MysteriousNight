<script lang="ts">
	import { Container } from 'pixi-svelte';
	import SymbolWinAnimation from './SymbolWinAnimation.svelte';
	import { onMount } from 'svelte';

	// Demo positions for different symbols
	const symbolPositions = {
		wild: { x: 100, y: 100 },
		queen: { x: 250, y: 100 },
		king: { x: 400, y: 100 },
		A: { x: 100, y: 250 },
		J: { x: 250, y: 250 },
		K: { x: 400, y: 250 },
		Q: { x: 550, y: 250 }
	};

	let animationRefs = $state<{[key: string]: any}>({});
	let currentAnimating = $state<string>('');

	onMount(() => {
		console.log('[WinAnimationDemo] All win animations loaded and ready');
		
		// Auto-demo: cycle through animations every 3 seconds
		let currentIndex = 0;
		const symbols = Object.keys(symbolPositions);
		
		const demoInterval = setInterval(() => {
			if (currentIndex < symbols.length) {
				const symbol = symbols[currentIndex];
				console.log(`[WinAnimationDemo] Playing ${symbol} win animation`);
				
				// Show the animation
				const ref = animationRefs[symbol];
				if (ref && ref.playAnimation) {
					currentAnimating = symbol;
					ref.playAnimation();
				}
				
				currentIndex++;
			} else {
				// Reset demo
				currentIndex = 0;
			}
		}, 3000);

		// Cleanup
		return () => {
			clearInterval(demoInterval);
		};
	});

	function handleAnimationComplete(symbol: string) {
		console.log(`[WinAnimationDemo] ${symbol} animation completed`);
		currentAnimating = '';
	}
</script>

<!-- Win Animation Demo Container -->
<Container x={0} y={0}>
	<!-- Wild Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.wild}
		symbolType="wild"
		x={symbolPositions.wild.x}
		y={symbolPositions.wild.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('wild')}
	/>

	<!-- Queen Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.queen}
		symbolType="queen"
		x={symbolPositions.queen.x}
		y={symbolPositions.queen.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('queen')}
	/>

	<!-- King Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.king}
		symbolType="king"
		x={symbolPositions.king.x}
		y={symbolPositions.king.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('king')}
	/>

	<!-- A Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.A}
		symbolType="A"
		x={symbolPositions.A.x}
		y={symbolPositions.A.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('A')}
	/>

	<!-- J Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.J}
		symbolType="J"
		x={symbolPositions.J.x}
		y={symbolPositions.J.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('J')}
	/>

	<!-- K Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.K}
		symbolType="K"
		x={symbolPositions.K.x}
		y={symbolPositions.K.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('K')}
	/>

	<!-- Q Symbol Animation -->
	<SymbolWinAnimation
		bind:this={animationRefs.Q}
		symbolType="Q"
		x={symbolPositions.Q.x}
		y={symbolPositions.Q.y}
		scale={0.8}
		visible={false}
		onComplete={() => handleAnimationComplete('Q')}
	/>
</Container> 