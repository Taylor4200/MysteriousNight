<script lang="ts">
	import { Container, Rectangle, Text } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateBet, stateBetDerived } from 'state-shared';

	import { UI_BASE_SIZE, UI_BASE_FONT_SIZE } from '../constants';
	import { getContext } from '../context';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const sizes = { width: UI_BASE_SIZE * 0.85, height: UI_BASE_SIZE * 0.85 }; // Medium circular
	const active = $derived(stateBet.isTurbo);
	const disabled = $derived(stateBet.isSpaceHold);

	const onpress = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateBetDerived.updateIsTurbo(!stateBet.isTurbo, { persistent: true });
	};

	context.eventEmitter.subscribeOnMount({
		stopButtonClick: () => stateBetDerived.updateIsTurbo(true, { persistent: false }),
		stopButtonEnable: () => stateBetDerived.updateIsTurbo(false, { persistent: false }),
	});
</script>

<Button {...props} {sizes} {onpress} {disabled}>
	{#snippet children({ center, hovered })}
		<Container {...center}>
			<!-- Circular background -->
			<Rectangle
				width={sizes.width}
				height={sizes.height}
				anchor={0.5}
				backgroundColor={0x00000000}
				borderColor={disabled ? 0x666666 : (hovered ? 0x00ff88 : 0x333333)}
				borderWidth={2}
				borderRadius={sizes.width / 2}
				alpha={disabled ? 0.6 : 1}
			/>

			<!-- Glow effect on hover -->
			{#if hovered && !disabled}
				<Rectangle
					width={sizes.width + 8}
					height={sizes.height + 8}
					anchor={0.5}
					backgroundColor={0x00ff88}
					alpha={0.2}
					borderRadius={(sizes.width + 8) / 2}
				/>
			{/if}

			<!-- Active state glow -->
			{#if active && !disabled}
				<Rectangle
					width={sizes.width + 4}
					height={sizes.height + 4}
					anchor={0.5}
					backgroundColor={0x00ff88}
					alpha={0.3}
					borderRadius={(sizes.width + 4) / 2}
				/>
			{/if}

			<!-- Lightning bolt icon -->
			<Text
				anchor={0.5}
				text="⚡"
				style={{
					fontSize: UI_BASE_FONT_SIZE * 1.5,
					fill: disabled ? 0x888888 : (active ? 0x000000 : 0x00ff88),
				}}
			/>
		</Container>
	{/snippet}
</Button>
