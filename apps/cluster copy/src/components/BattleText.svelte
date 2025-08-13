<script lang="ts">
	import { getContext } from 'svelte';
	import { MainContainer } from 'components-layout';
	import { BitmapText } from 'pixi-svelte';

	const context = getContext('gameContext') as any;

	// Props for different text types
	const props = $props<{
		text?: string;
		type?: 'zone' | 'battle' | 'reward' | 'special';
		show?: boolean;
		duration?: number;
		scale?: number;
		x?: number;
		y?: number;
	}>();

	const text = props.text || '';
	const type = props.type || 'battle';
	let show = props.show || false;
	const duration = props.duration || 3000;
	const scale = props.scale || 1;
	const x = props.x || 0;
	const y = props.y || 0;

	// Text content based on type
	const getTextContent = () => {
		switch (type) {
			case 'zone':
				return text || 'ZONE 1';
			case 'battle':
				return text || 'VICTORY!';
			case 'reward':
				return text || 'BIG WIN';
			case 'special':
				return text || 'BONUS UNLOCKED';
			default:
				return text;
		}
	};

	// Get font size based on type
	const getFontSize = () => {
		switch (type) {
			case 'zone':
				return 48;
			case 'battle':
				return 64;
			case 'reward':
				return 72;
			case 'special':
				return 56;
			default:
				return 48;
		}
	};

	// Get color based on type
	const getColor = () => {
		switch (type) {
			case 'zone':
				return 0xFFD700; // Gold
			case 'battle':
				return 0xFF4500; // Orange-red
			case 'reward':
				return 0xFFD700; // Gold
			case 'special':
				return 0x00FF7F; // Spring green
			default:
				return 0xFFFFFF; // White
		}
	};

	// Auto-hide after duration
	$effect(() => {
		if (show) {
			const timer = setTimeout(() => {
				// Use dispatch to communicate back to parent
				// For now, just let the parent control the show state
			}, duration);
			return () => clearTimeout(timer);
		}
	});

	// Get font assets
	const fontTexture = $derived(context?.stateApp?.loadedAssets?.gladiators_font);
	const fontData = $derived(context?.stateApp?.loadedAssets?.gladiators_fnt);
	const fontLoaded = $derived(fontTexture && fontData);
	
	// Create font style object
	const fontStyle = $derived({
		fontName: 'Gladiators',
		fontSize: getFontSize()
	});
</script>

{#if show && fontLoaded}
	<MainContainer>
		<BitmapText
			text={getTextContent()}
			style={fontStyle}
			tint={getColor()}
			anchor={{ x: 0.5, y: 0.5 }}
			x={x || context.stateLayoutDerived.mainLayout().width * 0.5}
			y={y || context.stateLayoutDerived.mainLayout().height * 0.3}
			scale={scale}
		/>
	</MainContainer>
{/if}
