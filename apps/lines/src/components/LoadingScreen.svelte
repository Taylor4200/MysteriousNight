<script lang="ts">
	import { Container, Sprite, Text, Graphics } from 'pixi-svelte';
	import { FadeContainer } from 'components-pixi';
	import { MainContainer } from 'components-layout';

	import { getContext } from '../game/context';
	import TransitionAnimation from './TransitionAnimation.svelte';

	type Props = {
		onloaded: () => void;
	};

	const props: Props = $props();
	const context = getContext();

	let loadingType = $state<'start' | 'transition'>('start');
	let loadingAlpha = $state(1);

	// Perfect fit for 1200x675 Stake iframe - same as main game
	const IFRAME_WIDTH = 1200;
	const IFRAME_HEIGHT = 675;

	// Animate the loading spinner with flashing effect
	$effect(() => {
		if (loadingType === 'start' && !context.stateApp.loaded) {
			const interval = setInterval(() => {
				loadingAlpha = loadingAlpha > 0.3 ? 0.3 : 1;
			}, 500); // Flash every 500ms
			
			return () => clearInterval(interval);
		}
	});

	function handlePress() {
		if (context.stateApp.loaded) {
			loadingType = 'transition';
		}
	}
</script>

<!-- Loading screen with new PNG assets -->
<FadeContainer show={loadingType === 'start'}>
	<!-- Loading background - exact same positioning as main game -->
	<Sprite 
		key="loadingBackground"
		anchor={0.5}
		x={IFRAME_WIDTH * 0.5}
		y={IFRAME_HEIGHT * 0.5}
		width={IFRAME_WIDTH}
		height={IFRAME_HEIGHT}
	/>
	
	<!-- Full screen clickable area when loaded -->
	{#if context.stateApp.loaded}
		<Graphics
			interactive={true}
			onclick={handlePress}
			onpointerdown={handlePress}
			draw={(graphics) => {
				graphics.clear();
				graphics.rect(0, 0, IFRAME_WIDTH, IFRAME_HEIGHT);
				graphics.fill({ color: 0x000000, alpha: 0 }); // Transparent
			}}
		/>
	{/if}
	
	<Container
		x={IFRAME_WIDTH * 0.5}
		y={IFRAME_HEIGHT * 0.5}
	>
		<!-- Logo -->
		<Sprite 
			key="loadingLogo"
			anchor={0.5}
			x={0}
			y={-100}
			scale={0.32}
		/>
		
		<!-- Loading spinner with flashing effect -->
		{#if !context.stateApp.loaded}
			<Sprite 
				key="loadingSpinner"
				anchor={0.5}
				x={0}
				y={250}
				alpha={loadingAlpha}
				scale={0.6}
			/>
		{/if}

		<!-- Press anywhere to continue text when loaded -->
		{#if context.stateApp.loaded}
			<Text
				anchor={0.5}
				x={0}
				y={250}
				text="Press anywhere to continue"
				style={{
					fontFamily: 'Times New Roman',
					fontSize: 24,
					fill: 0xffffff,
					align: 'center'
				}}
			/>
		{/if}
	</Container>
</FadeContainer>

<!-- transition between the loading screen and the game -->
<FadeContainer show={loadingType === 'transition'}>
	<TransitionAnimation oncomplete={props.onloaded} />
</FadeContainer>
