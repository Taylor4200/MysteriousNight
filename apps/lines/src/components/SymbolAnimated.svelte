<script lang="ts">
	import { SpriteSheet } from 'pixi-svelte';
	import { onMount } from 'svelte';
	import { ANIMATION_CONFIGS } from '../game/animationManager';
	import { getSymbolInfo } from '../game/utils';
	import { SYMBOL_SIZE } from '../game/constants';

	type Props = {
		x?: number;
		y?: number;
		animationType: keyof typeof ANIMATION_CONFIGS;
		symbolInfo?: ReturnType<typeof getSymbolInfo>; // Made optional for atmospheric animations
		anchor?: number;
		oncomplete?: () => void;
		loop?: boolean;
	};

	const props: Props = $props();
	
	let spriteSheetKey = $state<string>('');
	let animationSpeed = $state(0.2);
	let loop = $state(props.loop ?? true);

	onMount(async () => {
		
		// The animation manager loads spritesheets, we just need to reference them by key
		const config = ANIMATION_CONFIGS[props.animationType];
		if (config && config.type === 'spritesheet') {
			// Use a standardized key that matches what the animation manager loads
			spriteSheetKey = props.animationType;
			animationSpeed = config.animationSpeed;
			loop = config.loop;
			
		} else {
			console.error(`[SymbolAnimated] Invalid animation config for: ${props.animationType}`);
		}
	});

	// Handle animation completion
	function handleAnimationComplete() {
		if (props.oncomplete) {
			props.oncomplete();
		}
	}
</script>

{#if spriteSheetKey}
	<!-- @ts-ignore - oncomplete works in other components -->
	<SpriteSheet
		key={spriteSheetKey}
		x={props.x}
		y={props.y}
		anchor={props.anchor ?? 0.5}
		{...props.symbolInfo ? {
			width: SYMBOL_SIZE * props.symbolInfo.sizeRatios.width,
			height: SYMBOL_SIZE * props.symbolInfo.sizeRatios.height
		} : {}}
		{animationSpeed}
		{loop}
		play={true}
		oncomplete={handleAnimationComplete}
	/>
{:else}
	<!-- Debug: Show when animation not loaded -->
	<div style="color: red; position: absolute; font-size: 12px; background: yellow; padding: 2px;">
		Loading SpriteSheet {props.animationType}...
	</div>
{/if} 