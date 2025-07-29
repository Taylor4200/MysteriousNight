<script lang="ts">
	import { SpriteSheet } from 'pixi-svelte';
	import { onMount } from 'svelte';
	import { ANIMATION_CONFIGS } from '../game/animationManager';

	type Props = {
		x?: number;
		y?: number;
		symbolType: 'wild' | 'queen' | 'king' | 'A' | 'J' | 'K' | 'Q';
		anchor?: number;
		scale?: number;
		onComplete?: () => void;
		visible?: boolean;
	};

	const props: Props = $props();
	
	let spriteSheetKey = $state<string>('');
	let animationSpeed = $state(0.3);
	let isVisible = $state(props.visible ?? true);

	// Map symbol types to animation keys
	const getAnimationKey = (symbolType: string): keyof typeof ANIMATION_CONFIGS => {
		switch (symbolType) {
			case 'wild': return 'wild_hit';
			case 'queen': return 'queen_win';
			case 'king': return 'king_win';
			case 'A': return 'A_win';
			case 'J': return 'J_win';
			case 'K': return 'K_win';
			case 'Q': return 'Q_win';
			default: return 'wild_hit';
		}
	};

	onMount(() => {
		const animationKey = getAnimationKey(props.symbolType);
		console.log(`[SymbolWinAnimation] Loading win animation: ${animationKey} for symbol: ${props.symbolType}`);
		
		const config = ANIMATION_CONFIGS[animationKey];
		if (config && config.type === 'spritesheet') {
			spriteSheetKey = animationKey;
			animationSpeed = config.animationSpeed;
			
			console.log(`[SymbolWinAnimation] Win animation configured:`, {
				symbol: props.symbolType,
				key: spriteSheetKey,
				animationSpeed,
				loop: false
			});
		} else {
			console.error(`[SymbolWinAnimation] Invalid animation config for: ${props.symbolType}`);
		}
	});

	// Function to play the animation (can be called externally)
	export function playAnimation() {
		isVisible = true;
		console.log(`[SymbolWinAnimation] Playing win animation for: ${props.symbolType}`);
	}

	// Function to hide the animation
	export function hideAnimation() {
		isVisible = false;
	}

	// Handle animation complete
	function handleAnimationComplete() {
		console.log(`[SymbolWinAnimation] Animation complete for: ${props.symbolType}`);
		if (props.onComplete) {
			props.onComplete();
		}
		// Auto-hide after completion for non-looping animations
		setTimeout(() => {
			isVisible = false;
		}, 100);
	}
</script>

{#if spriteSheetKey && isVisible}
	<SpriteSheet
		key={spriteSheetKey}
		x={props.x}
		y={props.y}
		anchor={props.anchor ?? 0.5}
		scale={props.scale ?? 1}
		{animationSpeed}
		loop={false}
		play={true}
		oncomplete={handleAnimationComplete}
	/>
{/if} 