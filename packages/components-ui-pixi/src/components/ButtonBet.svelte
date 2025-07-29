<script lang="ts">
	import { Container, Text, Rectangle } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { OnHotkey } from 'components-shared';
	import { stateBetDerived } from 'state-shared';

	import UiSprite from './UiSprite.svelte';
	import ButtonBetProvider from './ButtonBetProvider.svelte';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE } from '../constants';
	import { i18nDerived } from '../i18n/i18nDerived';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const disabled = $derived(!stateBetDerived.isBetCostAvailable());
	const sizes = { width: UI_BASE_SIZE * 1.5, height: UI_BASE_SIZE * 1.5 }; // Bigger round circle
</script>

<ButtonBetProvider>
	{#snippet children({ key, onpress })}
		<OnHotkey hotkey="Space" {disabled} {onpress} />
		<Button {...props} {sizes} {onpress} {disabled}>
			{#snippet children({ center, hovered })}
				<Container {...center}>
					<!-- Main circular background with enhanced shadow -->
					<Rectangle
						width={sizes.width}
						height={sizes.height}
						anchor={0.5}
						backgroundColor={0x00000000}
						borderColor={disabled ? 0x666666 : (hovered ? 0x00ff88 : 0x333333)}
						borderWidth={4}
						borderRadius={sizes.width / 2}
						alpha={disabled ? 0.6 : 1}
					/>

					<!-- Enhanced shadow effect -->
					<Rectangle
						width={sizes.width + 6}
						height={sizes.height + 6}
						anchor={0.5}
						backgroundColor={0x000000}
						alpha={0.4}
						borderRadius={(sizes.width + 6) / 2}
						y={6}
					/>

					<!-- Bright glow effect on hover -->
					{#if hovered && !disabled}
						<Rectangle
							width={sizes.width + 16}
							height={sizes.height + 16}
							anchor={0.5}
							backgroundColor={0x00ff88}
							alpha={0.25}
							borderRadius={(sizes.width + 16) / 2}
						/>
					{/if}

					<!-- Enhanced pulse animation for idle state -->
					{#if !disabled && ['spin_default', 'spin_disabled'].includes(key)}
						<Rectangle
							width={sizes.width + 12}
							height={sizes.height + 12}
							anchor={0.5}
							backgroundColor={0x00ff88}
							alpha={0.15}
							borderRadius={(sizes.width + 12) / 2}
						/>
					{/if}

					<Text
						anchor={0.5}
						text={['spin_default', 'spin_disabled'].includes(key)
							? 'SPIN'
							: i18nDerived.stop()}
						style={{
							align: 'center',
							wordWrap: true,
							wordWrapWidth: 200,
							fontFamily: 'proxima-nova',
							fontWeight: '700',
							fontSize: UI_BASE_FONT_SIZE * 1.3,
							fill: disabled ? 0x888888 : 0x00ff88,
							letterSpacing: 2,
						}}
					/>
				</Container>
			{/snippet}
		</Button>
	{/snippet}
</ButtonBetProvider>
