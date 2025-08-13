<script lang="ts">
	import { Container, Rectangle } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateUi } from 'state-shared';

	import { UI_BASE_SIZE } from '../constants';
	import { getContext } from '../context';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const sizes = { width: UI_BASE_SIZE * 0.8, height: UI_BASE_SIZE * 0.8 }; // Smaller circular

	const onpress = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateUi.menuOpen = true;
	};
</script>

<Button {...props} {sizes} {onpress}>
	{#snippet children({ center, hovered })}
		<Container {...center}>
			<!-- Circular background -->
			<Rectangle
				width={sizes.width}
				height={sizes.height}
				anchor={0.5}
				backgroundColor={0x00000000}
				borderColor={0x00000000}
				borderWidth={0}
				borderRadius={sizes.width / 2}
			/>

			<!-- Glow effect on hover -->
			{#if hovered}
				<Rectangle
					width={sizes.width + 8}
					height={sizes.height + 8}
					anchor={0.5}
					backgroundColor={0x00ff88}
					alpha={0.2}
					borderRadius={(sizes.width + 8) / 2}
				/>
			{/if}

			<!-- 3-line hamburger icon -->
			<Container>
				<!-- Top line -->
				<Rectangle
					width={sizes.width * 0.4}
					height={3}
					anchor={0.5}
					backgroundColor={0xffffff}
					y={-sizes.height * 0.15}
				/>
				<!-- Middle line -->
				<Rectangle
					width={sizes.width * 0.4}
					height={3}
					anchor={0.5}
					backgroundColor={0xffffff}
				/>
				<!-- Bottom line -->
				<Rectangle
					width={sizes.width * 0.4}
					height={3}
					anchor={0.5}
					backgroundColor={0xffffff}
					y={sizes.height * 0.15}
				/>
			</Container>
		</Container>
	{/snippet}
</Button>
