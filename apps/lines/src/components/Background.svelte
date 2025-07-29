<script lang="ts">
	import { Rectangle, Sprite } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { SECOND } from 'constants-shared/time';

	import { getContext } from '../game/context';

	const context = getContext();
	const showBaseBackground = $derived(context.stateGame.gameType === 'basegame');
	const showFeatureBackground = $derived(context.stateGame.gameType === 'freegame');
	
	// Perfect fit for 1200x675 Stake iframe
	const IFRAME_WIDTH = 1200;
	const IFRAME_HEIGHT = 675;
</script>

<Rectangle {...context.stateLayoutDerived.canvasSizes()} backgroundColor={0x000000} zIndex={-3} />

<FadeContainer show={showBaseBackground} duration={SECOND} zIndex={-2}>
	<Sprite 
		key="background" 
		anchor={0.5}
		x={IFRAME_WIDTH * 0.5}
		y={IFRAME_HEIGHT * 0.5}
		width={IFRAME_WIDTH}
		height={IFRAME_HEIGHT}
	/>
</FadeContainer>

<FadeContainer show={showFeatureBackground} duration={SECOND} zIndex={-1}>
	<Sprite 
		key="background" 
		anchor={0.5}
		x={IFRAME_WIDTH * 0.5}
		y={IFRAME_HEIGHT * 0.5}
		width={IFRAME_WIDTH}
		height={IFRAME_HEIGHT}
	/>
</FadeContainer>
