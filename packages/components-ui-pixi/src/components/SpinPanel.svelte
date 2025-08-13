<script lang="ts">
	import { Container, Rectangle, Text, anchorToPivot } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { UI_BASE_SIZE, UI_BASE_FONT_SIZE } from '../constants';
	import { getContext } from '../context';
	import { stateUi, stateBet, stateBetDerived, stateConfig } from 'state-shared';
	import AutoSpinsModal from './AutoSpinsModal.svelte';
	import OnHotkey from '../../../components-shared/src/components/OnHotkey.svelte';

	const context = getContext();

	// Component props
	const props = $props<{
		anchor?: { x: number; y: number };
	}>();

	// Reactive state
	let turboMode = $state(false);
	let showAutoplayModal = $state(false);
	let betAmount = $derived(stateBet.betAmount);
	let isSpinning = $derived(!context.stateXstateDerived.isIdle());
	let autoplaySpinsLeft = $derived(stateBet.autoSpinsCounter);
	let isAutoplayActive = $derived(autoplaySpinsLeft > 0);
	let isBonusGame = $derived(stateUi.freeSpinCounterShow);

	// Functions
	function handleSpin() {
		if (!isSpinning) {
			// During bonus games, only handle turbo functionality, don't trigger spin
			if (isBonusGame) {
				context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
				// Temporarily enable turbo for the next spin
				const originalTurbo = stateBet.isTurbo;
				stateBet.isTurbo = true;
				// Reset turbo after a short delay to ensure it's applied for the next spin
				setTimeout(() => {
					stateBet.isTurbo = originalTurbo;
				}, 100);
			} else {
				// Normal spin functionality for non-bonus games
				context.eventEmitter.broadcast({ type: 'soundPressBet' });
				context.eventEmitter.broadcast({ type: 'bet' });
			}
		}
	}

	function handleTurboToggle() {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		turboMode = !turboMode;
		stateBetDerived.updateIsTurbo(turboMode, { persistent: true });
	}

	function handleAutoplayClick() {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		
		// Check if we're in free spins mode and auto play is active
		const isAutoPlayActive = stateBetDerived.hasAutoBetCounter();
		const isInFreeSpins = stateUi.freeSpinCounterShow;
		
		if (isInFreeSpins && isAutoPlayActive) {
			// Cancel free spins by stopping auto play
			stateBet.autoSpinsCounter = 0;
			// Also hide the free spin counter
			stateUi.freeSpinCounterShow = false;
		} else if (isAutoPlayActive) {
			// Cancel regular auto play
			stateBet.autoSpinsCounter = 0;
		} else if (showAutoplayModal) {
			// Close modal if already open
			showAutoplayModal = false;
		} else {
			// Open modal
			showAutoplayModal = true;
		}
	}

	function handleCloseAutoplayModal() {
		showAutoplayModal = false;
	}

	function handleBetIncrease() {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		const biggest = stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1];
		const nextBigger = [...stateConfig.betAmountOptions]
			.sort((a, b) => a - b)
			.find((option) => option > stateBet.betAmount);
		stateBetDerived.setBetAmount(nextBigger || biggest);
	}

	function handleBetDecrease() {
		context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
		const smallest = stateConfig.betAmountOptions[0];
		const nextSmaller = [...stateConfig.betAmountOptions]
			.sort((a, b) => b - a)
			.find((option) => option < stateBet.betAmount);
		stateBetDerived.setBetAmount(nextSmaller || smallest);
	}

	// Sizes
	const spinButtonRadius = 80;
	const betButtonRadius = 40;
	const autoplayHeight = 30;
	const totalWidth = spinButtonRadius * 2 + betButtonRadius * 2 + 40; // 40px spacing
	const totalHeight = spinButtonRadius * 2 + autoplayHeight + 20;
</script>

<Container
	x={props.anchor?.x ?? 0}
	y={props.anchor?.y ?? 0}
	pivot={anchorToPivot({ anchor: props.anchor ?? { x: 0.5, y: 0.5 }, sizes: { width: totalWidth, height: totalHeight } })}
>
	<!-- Main Spin Button (Center) -->
	<Container x={0} y={0}>
		<Button
			sizes={{ width: spinButtonRadius * 2, height: spinButtonRadius * 2 }}
			onpress={handleSpin}
			disabled={isSpinning}
			anchor={0.5}
		>
			{#snippet children({ center, hovered, pressed })}
				<Container {...center}>
					<!-- Spin Button Background -->
					<Rectangle
						width={spinButtonRadius * 2}
						height={spinButtonRadius * 2}
						backgroundColor={0x00000000}
						borderColor={isSpinning ? 0x444444 : (hovered ? 0x00ff88 : 0xffffff)}
						borderWidth={3}
						borderRadius={spinButtonRadius}
						anchor={0.5}
						alpha={0.9}
					/>

					<!-- Spin Icon -->
					<Text
						text="⟲"
						style={{
							fontSize: 48,
							fill: isSpinning ? 0x888888 : 0xffffff,
							fontWeight: 'bold'
						}}
						anchor={0.5}
					/>
				</Container>
			{/snippet}
		</Button>
		
		<!-- Spacebar hotkey for spin -->
		<OnHotkey hotkey="Space" disabled={isSpinning} onpress={handleSpin} />
	</Container>

	<!-- Autoplay Label (Below Spin Button) - Hidden during bonus games only -->
	{#if !isBonusGame}
		<Container x={0} y={spinButtonRadius + autoplayHeight}>
			<Button
				sizes={{ width: 120, height: autoplayHeight }}
				onpress={handleAutoplayClick}
				anchor={0.5}
			>
				{#snippet children({ center, hovered, pressed })}
					<Container {...center}>
						<!-- Autoplay Background - highlighted when modal open or autoplay active -->
						<Rectangle
							width={120}
							height={autoplayHeight}
							backgroundColor={showAutoplayModal || isAutoplayActive ? 0x00ff88 : 0x00000000}
							borderColor={hovered || showAutoplayModal || isAutoplayActive ? 0x00ff88 : 0xffffff}
							borderWidth={1}
							borderRadius={autoplayHeight / 2}
							anchor={0.5}
							alpha={0.9}
						/>

						<!-- Autoplay Text or Counter -->
						<Text
							text={isAutoplayActive ? (autoplaySpinsLeft === Infinity ? '∞' : autoplaySpinsLeft.toString()) : 'AUTOPLAY'}
							style={{
								fontSize: isAutoplayActive ? 16 : 12,
								fill: showAutoplayModal || isAutoplayActive ? 0x000000 : 0xffffff,
								fontWeight: 'bold',
								letterSpacing: isAutoplayActive ? 0 : 1
							}}
							anchor={0.5}
						/>
					</Container>
				{/snippet}
			</Button>
		</Container>
	{/if}

	<!-- Autoplay Spins Counter (Above Spin Button) - REMOVED -->
	<!-- Counter is now integrated into the autoplay button above -->

	<!-- Minus Button (Left) - Hidden during bonus games only -->
	{#if !isBonusGame}
		<Container x={-spinButtonRadius - betButtonRadius - 20} y={0}>
			<Button
				sizes={{ width: betButtonRadius * 2, height: betButtonRadius * 2 }}
				onpress={handleBetDecrease}
				disabled={!context.stateXstateDerived.isIdle() || stateBet.betAmount === stateConfig.betAmountOptions[0]}
				anchor={0.5}
			>
				{#snippet children({ center, hovered, pressed })}
					<Container {...center}>
						<!-- Minus Button Background -->
						<Rectangle
							width={betButtonRadius * 2}
							height={betButtonRadius * 2}
							backgroundColor={0x00000000}
							borderColor={hovered ? 0x00ff88 : 0xffffff}
							borderWidth={2}
							borderRadius={betButtonRadius}
							anchor={0.5}
							alpha={0.9}
						/>

						<!-- Minus Icon -->
						<Text
							text="-"
							style={{
								fontSize: 24,
								fill: 0xffffff,
								fontWeight: 'bold'
							}}
							anchor={0.5}
						/>
					</Container>
				{/snippet}
			</Button>
		</Container>
	{/if}

	<!-- Plus Button (Right) - Hidden during bonus games only -->
	{#if !isBonusGame}
		<Container x={spinButtonRadius + betButtonRadius + 20} y={0}>
			<Button
				sizes={{ width: betButtonRadius * 2, height: betButtonRadius * 2 }}
				onpress={handleBetIncrease}
				disabled={!context.stateXstateDerived.isIdle() || stateBet.betAmount === stateConfig.betAmountOptions[stateConfig.betAmountOptions.length - 1]}
				anchor={0.5}
			>
				{#snippet children({ center, hovered, pressed })}
					<Container {...center}>
						<!-- Plus Button Background -->
						<Rectangle
							width={betButtonRadius * 2}
							height={betButtonRadius * 2}
							backgroundColor={0x00000000}
							borderColor={hovered ? 0x00ff88 : 0xffffff}
						borderWidth={2}
						borderRadius={betButtonRadius}
						anchor={0.5}
						alpha={0.9}
					/>

					<!-- Plus Icon -->
					<Text
						text="+"
						style={{
							fontSize: 24,
							fill: 0xffffff,
							fontWeight: 'bold'
						}}
						anchor={0.5}
					/>
				</Container>
			{/snippet}
		</Button>
	</Container>
	{/if}

	<!-- Turbo Toggle Button (Top-right of spin button) -->
	<Container x={spinButtonRadius - 15} y={-spinButtonRadius + 15}>
		<Button
			sizes={{ width: 30, height: 30 }}
			onpress={handleTurboToggle}
			anchor={0.5}
		>
			{#snippet children({ center, hovered, pressed })}
				<Container {...center}>
					<!-- Turbo Button Background -->
					<Rectangle
						width={30}
						height={30}
						backgroundColor={turboMode ? 0x00ff88 : 0x00000000}
						borderColor={hovered ? 0x00ff88 : 0xffffff}
						borderWidth={1}
						borderRadius={15}
						anchor={0.5}
						alpha={0.9}
					/>

					<!-- Turbo Icon -->
					<Text
						text="⚡"
						style={{
							fontSize: 16,
							fill: turboMode ? 0x000000 : 0xffffff
						}}
						anchor={0.5}
					/>
				</Container>
			{/snippet}
		</Button>
	</Container>
</Container>

<!-- AutoSpins Modal -->
{#if showAutoplayModal}
	<AutoSpinsModal onClose={handleCloseAutoplayModal} />
{/if} 