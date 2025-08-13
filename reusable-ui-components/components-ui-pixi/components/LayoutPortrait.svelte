<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';

	import { stateUi } from 'state-shared';
	import { stateBet } from 'state-shared';
	import { BLACK } from 'constants-shared/colors';
	import { FadeContainer } from 'components-pixi';
	import { MainContainer } from 'components-layout';
	import { Container, Rectangle } from 'pixi-svelte';
	import { waitForResolve } from 'utils-shared/wait';

	import LabelFreeSpinCounter from './LabelFreeSpinCounter.svelte';
	import ButtonDrawer from './ButtonDrawer.svelte';
	import SpinPanel from './SpinPanel.svelte';
	import type { LayoutUiProps } from '../types';
	import { getContext } from '../context';

	const props: LayoutUiProps = $props();
	const context = getContext();

	const DRAWER_Y = {
		unfold: 0,
		fold: 550,
	};
	const drawerTween = new Tween(stateUi.drawerFold ? DRAWER_Y.fold : DRAWER_Y.unfold, {
		easing: cubicInOut,
	});

	const DRAWER_BUTTON_Y = {
		unfold: 0,
		fold: 50,
	};
	const drawerButtonTween = new Tween(
		stateUi.drawerFold ? DRAWER_BUTTON_Y.fold : DRAWER_BUTTON_Y.unfold,
		{
			easing: cubicInOut,
		},
	);

	let drawerButtonFadeComplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		drawerButtonShow: async () => {
			if (!stateUi.drawerButtonShow) {
				stateUi.drawerButtonShow = true;
				await waitForResolve((resolve) => (drawerButtonFadeComplete = resolve));
			}
		},
		drawerButtonHide: async () => {
			if (stateUi.drawerButtonShow) {
				stateUi.drawerButtonShow = false;
				await waitForResolve((resolve) => (drawerButtonFadeComplete = resolve));
			}
		},
		drawerUnfold: async () => {
			if (stateUi.drawerFold) {
				drawerButtonTween.set(DRAWER_BUTTON_Y.unfold);
				await drawerTween.set(DRAWER_Y.unfold);
			}
		},
		drawerFold: async () => {
			if (!stateUi.drawerFold) {
				drawerButtonTween.set(DRAWER_BUTTON_Y.fold);
				await drawerTween.set(DRAWER_Y.fold);
			}
		},
	});
</script>

<Container x={5} scale={0.6}>
	{@render props.gameName()}
</Container>

<Container x={context.stateLayoutDerived.canvasSizes().width - 15}>
	{@render props.logo()}
</Container>

<MainContainer standard alignVertical="bottom">
	<!-- drawer container -->
	<Container y={drawerTween.current}>
		<!-- MENU BUTTON (Hamburger) - Left side -->
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.3 - 200}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 150}
		>
			{@render props.buttonMenu({ anchor: 0.5 })}
		</Container>

		<!-- BUY BONUS BUTTON - Right side -->
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.01 + 160}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 500}
		>
			{@render props.buttonBuyBonus({ anchor: 0.5 })}
		</Container>

		<!-- SPIN PANEL (All-in-one: spin, bet up/down, turbo, autoplay) - Center bottom -->
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.677}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 250}
			scale={1.3}
		>
			<SpinPanel anchor={{ x: 0.5, y: 0.5 }} />
		</Container>

		<!-- BALANCE DISPLAY - Center -->
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.507}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 150}
		>
			{@render props.amountBalance({ stacked: true })}
		</Container>
	</Container>

	<!-- WIN DISPLAY - Moves with drawer -->
	<Container y={Math.min(drawerTween.current, 200)}>
		{#if stateBet.winBookEventAmount > 0}
			<Container
				x={context.stateLayoutDerived.mainLayoutStandard().width * 0.507}
				y={context.stateLayoutDerived.mainLayoutStandard().height - 600}
			>
				{@render props.amountWin({ stacked: true })}
			</Container>
		{/if}
	</Container>
</MainContainer>

<MainContainer standard alignVertical="bottom">
	<!-- FREE SPIN COUNTER (only shows during free spins) -->
	{#if stateUi.freeSpinCounterShow}
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.5}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 130}
		>
			<LabelFreeSpinCounter stacked />
		</Container>
	{:else}
		<!-- BET AMOUNT DISPLAY (shows current bet per spin) -->
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.7}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 150}
		>
			{@render props.amountBet({ stacked: true })}
		</Container>
	{/if}

	<!-- DRAWER BUTTON (slide up/down control) -->
	<FadeContainer
		persistent
		show={stateUi.drawerButtonShow}
		oncomplete={drawerButtonFadeComplete}
		y={drawerButtonTween.current}
	>
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.5 + 200}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 105}
		>
			<ButtonDrawer disabled={!stateUi.drawerButtonShow} anchor={0.5} />
		</Container>
	</FadeContainer>
</MainContainer>

{#if stateUi.menuOpen}
	<Rectangle
		eventMode="static"
		cursor="pointer"
		alpha={0.5}
		anchor={0.5}
		backgroundColor={BLACK}
		width={context.stateLayoutDerived.canvasSizes().width}
		height={context.stateLayoutDerived.canvasSizes().height}
		x={context.stateLayoutDerived.canvasSizes().width * 0.5}
		y={context.stateLayoutDerived.canvasSizes().height * 0.5}
		onpointerup={() => (stateUi.menuOpen = false)}
	/>

	<MainContainer standard alignVertical="bottom">
		<Container
			x={context.stateLayoutDerived.mainLayoutStandard().width * 0.5 - 440}
			y={context.stateLayoutDerived.mainLayoutStandard().height - 400}
		>
			<Container y={-190 - 210 * 3}>
				{@render props.buttonPayTable({ anchor: 0.5 })}
			</Container>

			<Container y={-190 - 210 * 2}>
				{@render props.buttonGameRules({ anchor: 0.5 })}
			</Container>

			<Container y={-190 - 210 * 1}>
				{@render props.buttonSettings({ anchor: 0.5 })}
			</Container>

			<Container y={-190}>
				{@render props.buttonSoundSwitch({ anchor: 0.5 })}
			</Container>

			<Container>
				{@render props.buttonMenuClose({ anchor: 0.5 })}
			</Container>
		</Container>
	</MainContainer>
{/if}
