<script lang="ts">
	import { Container, Rectangle, Text } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateBet, stateBetDerived, stateConfig } from 'state-shared';

	import { getContext } from '../context';
	import { UI_BASE_SIZE, UI_BASE_FONT_SIZE } from '../constants';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const sizes = { width: UI_BASE_SIZE * 0.6, height: UI_BASE_SIZE * 0.6 }; // Smaller circular
	const biggest = $derived(stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]);
	const disabled = $derived(!context.stateXstateDerived.isIdle() || stateBet.betAmount === biggest);
	let runnerActive = $state(false);
	// Subscribe to runner-mode lifecycle (storybook Action path); cast to any to accept external events
	(context.eventEmitter as any).subscribeOnMount({
		playerStartRunning: () => { runnerActive = true; },
		playerStopRunning: () => { runnerActive = false; },
		runnerModeEnable: (e: { enabled: boolean }) => { runnerActive = e.enabled; },
	});
	const hidden = $derived(!context.stateXstateDerived.isIdle() || runnerActive);

	const onpress = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });

		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);

		stateBetDerived.setBetAmount(nextBigger || biggest);
	};
</script>

{#if !hidden}
<Button {...props} {sizes} {onpress} {disabled}>
	{#snippet children({ center, hovered })}
		<Container {...center}>
			<!-- Circular background with slim outline -->
			<Rectangle
				width={sizes.width}
				height={sizes.height}
				anchor={0.5}
				backgroundColor={0x00000000}
				borderColor={0x00000000}
				borderWidth={0}
				borderRadius={sizes.width / 2}
				alpha={disabled ? 0.6 : 1}
			/>

			<!-- Glow effect on hover -->
			{#if hovered && !disabled}
				<Rectangle
					width={sizes.width + 6}
					height={sizes.height + 6}
					anchor={0.5}
					backgroundColor={0x00ff88}
					alpha={0.2}
					borderRadius={(sizes.width + 6) / 2}
				/>
			{/if}

			<!-- Plus symbol -->
			<Text
				anchor={0.5}
				text="+"
				style={{
					fontSize: UI_BASE_FONT_SIZE * 1.5,
					fill: disabled ? 0x888888 : 0x00ff88,
					fontWeight: '700',
				}}
			/>
		</Container>
	{/snippet}
</Button>
{/if}
