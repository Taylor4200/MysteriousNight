<script lang="ts">
	import { Text, Rectangle } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateModal, stateBet, stateBetDerived } from 'state-shared';

	import UiSprite from './UiSprite.svelte';
	import { UI_BASE_FONT_SIZE, UI_BASE_SIZE } from '../constants';
	import { getContext } from '../context';
	import { i18nDerived } from '../i18n/i18nDerived';

	const props: Partial<Omit<ButtonProps, 'children'>> = $props();
	const { stateXstateDerived, eventEmitter } = getContext();
	const sizes = { width: UI_BASE_SIZE * 1.4, height: UI_BASE_SIZE * 0.9 }; // More rectangular
	const disabled = $derived(!stateXstateDerived.isIdle());
	const active = $derived(stateBetDerived.activeBetMode()?.type === 'activate');

	const openModal = () => (stateModal.modal = { name: 'buyBonus' });
	const disableActiveBetMode = () => (stateBet.activeBetModeKey = 'BASE');
	const onpress = () => {
		eventEmitter.broadcast({ type: 'soundPressGeneral' });

		if (active) {
			disableActiveBetMode();
		} else {
			openModal();
		}
	};

	const getState = (value: {
		active: boolean;
		disabled: boolean;
		hovered: boolean;
		pressed: boolean;
	}) => {
		if (value.disabled) return 'disabled' as const;
		if (value.pressed) return 'pressed' as const;
		if (value.hovered) return 'hovered' as const;
		if (value.active) return 'active' as const;
		return 'default' as const;
	};
</script>

<Button {...props} {sizes} {disabled} {onpress}>
	{#snippet children({ center, hovered, pressed })}
		{@const state = getState({
			active,
			disabled,
			hovered,
			pressed,
		})}

		<!-- Border only - no background -->
		<Rectangle
			{...center}
			anchor={0.5}
			width={sizes.width}
			height={sizes.height}
			backgroundColor={0x00000000}
			borderColor={0x00000000}
			borderWidth={0}
			borderRadius={12}
			alpha={disabled ? 0.6 : 1}
		/>

		<!-- Bright glow effect on hover -->
		{#if hovered && !disabled}
			<Rectangle
				{...center}
				anchor={0.5}
				width={sizes.width + 12}
				height={sizes.height + 12}
				backgroundColor={0xffffff}
				alpha={0.3}
				borderRadius={16}
			/>
		{/if}

		<!-- Active state with bright border -->
		{#if active}
			<Rectangle
				{...center}
				anchor={0.5}
				width={sizes.width + 6}
				height={sizes.height + 6}
				backgroundColor={0xffffff}
				alpha={0.4}
				borderRadius={14}
		/>
		{/if}

		<Text
			{...center}
			anchor={0.5}
			text={state === 'active' ? i18nDerived.disable() : 'BUY BONUS'}
			style={{
				align: 'center',
				wordWrap: true,
				wordWrapWidth: 200,
				fontFamily: 'proxima-nova',
				fontWeight: '700',
				fontSize: UI_BASE_FONT_SIZE * 0.9,
				fill: disabled ? 0x888888 : (active ? 0x000000 : 0xffffff),
				letterSpacing: 1,
			}}
		/>
	{/snippet}
</Button>
