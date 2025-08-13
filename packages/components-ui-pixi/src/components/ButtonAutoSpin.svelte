<script lang="ts">
	import { Container, Text, Rectangle } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateBet, stateBetDerived, stateModal, stateUi } from 'state-shared';

	import { getContext } from '../context';
	import { UI_BASE_SIZE, UI_BASE_FONT_SIZE } from '../constants';
	import { i18nDerived } from '../i18n/i18nDerived';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const context = getContext();
	const sizes = { width: UI_BASE_SIZE * 0.9, height: UI_BASE_SIZE * 0.9 }; // Smaller circular
	const active = $derived(stateBetDerived.hasAutoBetCounter());
	const disabled = $derived.by(() => {
		if (stateBet.isSpaceHold) return true;
		if (!context.stateXstateDerived.isIdle() && !stateBetDerived.hasAutoBetCounter()) return true;
		if (!stateBetDerived.isBetCostAvailable()) return true;
		return false;
	});

	const stopAutoSpin = () => (stateBet.autoSpinsCounter = 0);
	const openModal = () => (stateModal.modal = { name: 'autoSpin' });
	const onpress = () => {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		
		// Check if we're in free spins mode and auto play is active
		const isAutoPlayActive = stateBetDerived.hasAutoBetCounter();
		const isInFreeSpins = stateUi.freeSpinCounterShow;
		
		if (isInFreeSpins && isAutoPlayActive) {
			// Cancel free spins by stopping auto play
			stopAutoSpin();
			// Also hide the free spin counter
			stateUi.freeSpinCounterShow = false;
		} else if (stateBetDerived.hasAutoBetCounter()) {
			stopAutoSpin();
		} else {
			openModal();
		}
	};

	// Determine what text to show on the button
	const buttonText = $derived(() => {
		if (stateBet.autoSpinsCounter > 0) {
			return stateBet.autoSpinsCounter === Infinity ? '∞' : stateBet.autoSpinsCounter.toString();
		}
		return '🔄';
	});

	// Determine font size based on counter value
	const fontSize = $derived.by(() => {
		if (stateBet.autoSpinsCounter > 0) {
			if (stateBet.autoSpinsCounter === Infinity) return UI_BASE_FONT_SIZE * 1.5;
			if (stateBet.autoSpinsCounter > 99) return UI_BASE_FONT_SIZE * 0.8;
			if (stateBet.autoSpinsCounter > 9) return UI_BASE_FONT_SIZE * 1.0;
			return UI_BASE_FONT_SIZE * 1.2;
		}
		return UI_BASE_FONT_SIZE * 1.2;
	});

	// Determine if text should be bold
	const isBold = $derived(stateBet.autoSpinsCounter > 0);
</script>

<Button {...props} {sizes} {disabled} {onpress}>
	{#snippet children({ center, hovered, pressed })}
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

			<!-- Button text (counter or icon) -->
			<Text
				anchor={0.5}
				text={buttonText}
				style={{
					fontSize,
					fill: disabled ? 0x888888 : (active ? 0x000000 : 0x00ff88),
					fontWeight: isBold ? 'bold' : 'normal',
				}}
			/>
		</Container>
	{/snippet}
</Button>
