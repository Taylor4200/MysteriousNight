<script lang="ts">
	import { stateUi, stateBet } from 'state-shared';
	import { BLACK } from 'constants-shared/colors';
	import { MainContainer } from 'components-layout';
	import { Container, Rectangle, anchorToPivot } from 'pixi-svelte';

	import { DESKTOP_BASE_SIZE, DESKTOP_BACKGROUND_WIDTH_LIST } from '../constants';
	import { getContext } from '../context';
	import type { LayoutUiProps } from '../types';
	import SpinPanel from './SpinPanel.svelte';

	const props: LayoutUiProps = $props();
	const context = getContext();
</script>

<Container x={20}>
	{@render props.gameName()}
</Container>

<Container x={context.stateLayoutDerived.canvasSizes().width - 20}>
	{@render props.logo()}
</Container>

<!-- Background shader that scales the entire screen -->
<Rectangle
	width={context.stateLayoutDerived.canvasSizes().width}
	height={context.stateLayoutDerived.canvasSizes().height}
	backgroundColor={0x000000}
	borderColor={0x333333}
	borderWidth={1}
	anchor={0.5}
	alpha={0}
	x={context.stateLayoutDerived.canvasSizes().width * 0.5}
	y={context.stateLayoutDerived.canvasSizes().height * 0.5}
/>

<MainContainer standard alignVertical="bottom">
	<!-- Professional slot UI bottom bar with precise positioning -->
	<Container
		x={context.stateLayoutDerived.mainLayoutStandard().width * 0.5}
		y={context.stateLayoutDerived.mainLayoutStandard().height - DESKTOP_BASE_SIZE - 10}
		pivot={anchorToPivot({
			anchor: { x: 0.5, y: 0 },
			sizes: {
				height: DESKTOP_BASE_SIZE,
				width: DESKTOP_BACKGROUND_WIDTH_LIST.reduce((sum, width) => sum + width, 0),
			},
		})}
	>
		<!-- Dark background bar with very slim outline -->
		<Rectangle
			width={DESKTOP_BACKGROUND_WIDTH_LIST.reduce((sum, width) => sum + width, 0)}
			height={DESKTOP_BASE_SIZE}
			backgroundColor={0x0a0a0a}
			borderColor={0x333333}
			borderWidth={1}
			anchor={0.1}
			alpha={0}
		/>

		<!-- Left section: Menu Button -->
		<Container y={DESKTOP_BASE_SIZE * 0.5} x={220} scale={0.8}>
			{@render props.buttonMenu({ anchor: 0.5 })}
		</Container>

		<!-- Balance Panel (left block) - properly positioned -->
		<Container y={DESKTOP_BASE_SIZE * 0.5 - 5} x={450} scale={0.5}>
			{@render props.amountBalance({ stacked: true })}
		</Container>

		<!-- Bet Panel (center-left) - properly positioned -->
		<Container y={DESKTOP_BASE_SIZE * 0.5 - 5} x={550} scale={0.5}>
			{@render props.amountBet({ stacked: true })}
		</Container>

		<!-- Buy Bonus Button (high-contrast rectangular) -->
		<Container y={DESKTOP_BASE_SIZE * 0.5 - 460} x={1460} scale={0.9}>
			{@render props.buttonBuyBonus({ anchor: 0.5 })}
		</Container>

		<!-- Unified Spin Panel (Center) -->
		<Container y={DESKTOP_BASE_SIZE * 0.5} x={1600} scale={1.0}>
			<SpinPanel anchor={{ x: 0.5, y: 0.4 }} />
		</Container>

		<!-- Win Panel (right side, only show if win > 0 or during bonus) -->
		{#if stateBet.winBookEventAmount > 0}
			<Container y={DESKTOP_BASE_SIZE * 0.5 - 50} x={890} scale={1}>
				{@render props.amountWin({ stacked: true })}
			</Container>
		{/if}
	</Container>
</MainContainer>

{#if stateUi.menuOpen}
	<Rectangle
		eventMode="static"
		cursor="pointer"
		alpha={0.5}
		anchor={0.5}
		backgroundColor={0x000000}
		width={context.stateLayoutDerived.canvasSizes().width}
		height={context.stateLayoutDerived.canvasSizes().height}
		x={context.stateLayoutDerived.canvasSizes().width * 0.5}
		y={context.stateLayoutDerived.canvasSizes().height * 0.5}
		onpointerup={() => (stateUi.menuOpen = false)}
	/>

	<MainContainer standard alignVertical="bottom">
		<Container
			x={298}
			y={context.stateLayoutDerived.mainLayoutStandard().height - DESKTOP_BASE_SIZE - 10}
		>
			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 3}>
				{@render props.buttonPayTable({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 2}>
				{@render props.buttonGameRules({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150 - 170 * 1}>
				{@render props.buttonSettings({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5 - 150}>
				{@render props.buttonSoundSwitch({ anchor: 0.5 })}
			</Container>

			<Container scale={0.8} y={DESKTOP_BASE_SIZE * 0.5}>
				{@render props.buttonMenuClose({ anchor: 0.5 })}
			</Container>
		</Container>
	</MainContainer>
{/if}
