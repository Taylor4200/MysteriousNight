<script lang="ts">
	import { Container, Rectangle, Text, anchorToPivot } from 'pixi-svelte';
	import { Button, type ButtonProps } from 'components-pixi';
	import { stateUi, stateBet, stateBetDerived } from 'state-shared';
	import { getContext } from '../context';
	import { UI_BASE_SIZE, UI_BASE_FONT_SIZE } from '../constants';
	import type { AutoSpinsText } from 'state-shared';

	const context = getContext();

	// Component props
	const props = $props<{
		onClose: () => void;
	}>();

	// Options - ultra modern grid layout
	const spinOptions: AutoSpinsText[] = ['10', '25', '50', '75', '100', '250', '500', '1000', '∞'];

	// Functions
	function handleSpinSelection(spins: AutoSpinsText) {
		// Set the autoplay option
		stateUi.autoSpinsText = spins;

		// Start autoplay
		stateBet.autoSpinsCounter = spins === '∞' 
			? Infinity 
			: parseInt(spins);

		// Close modal and start spinning
		props.onClose();
		context.eventEmitter.broadcast({ type: 'bet' });
	}

	function handleCancel() {
		props.onClose();
	}

	// Modal dimensions - optimized for modern layout
	const modalWidth = 360;
	const modalHeight = 280;
	
	// Responsive positioning based on layout type
	const modalPosition = $derived(() => {
		const layoutType = context.stateLayoutDerived.layoutType();
		const canvasSizes = context.stateLayoutDerived.canvasSizes();
		
		if (layoutType === 'portrait') {
			// Portrait mobile positioning - center horizontally, higher vertically
			return {
				x: canvasSizes.width * 0.145,
				y: canvasSizes.height * -0.33,
				pivot: anchorToPivot({ anchor: { x: 0.5, y: 0.5 }, sizes: { width: modalWidth, height: modalHeight } })
			};
		} else {
			// Desktop/landscape positioning - keep original
			return {
				x: canvasSizes.width * 0.5,
				y: canvasSizes.height * 0.5,
				pivot: anchorToPivot({ anchor: { x: 2.04, y: 2.3 }, sizes: { width: modalWidth, height: modalHeight } })
			};
		}
	});
</script>

<!-- Modal container -->
<Container
	x={modalPosition().x}
	y={modalPosition().y}
	pivot={modalPosition().pivot}
>
	<!-- Modal background - ultra modern with subtle glow -->
	<Rectangle
		width={modalWidth}
		height={modalHeight}
		backgroundColor={0x0a0a0a}
		borderColor={0x00ff88}
		borderWidth={1}
		borderRadius={15}
		anchor={0.5}
		alpha={0.95}
	/>

	<!-- Subtle glow effect -->
	<Rectangle
		width={modalWidth + 20}
		height={modalHeight + 20}
		backgroundColor={0x00ff88}
		alpha={0.1}
		borderRadius={20}
		anchor={0.5}
	/>

	<!-- Title - ultra modern typography -->
	<Text
		text="AUTOPLAY"
		style={{
			fontSize: 24,
			fill: 0xffffff,
			fontWeight: 'bold',
			letterSpacing: 3
		}}
		anchor={0.5}
		y={-modalHeight / 2 + 25}
	/>

	<!-- Subtitle -->
	<Text
		text="SELECT NUMBER OF SPINS"
		style={{
			fontSize: 12,
			fill: 0x888888,
			fontWeight: 'normal',
			letterSpacing: 1
		}}
		anchor={0.5}
		y={-modalHeight / 2 + 50}
	/>

	<!-- Spin options grid - ultra modern 3x3 layout -->
	<Container y={-modalHeight / 2 + 100}>
		{#each spinOptions as option, index}
			<Container x={(index % 3 - 1) * 110} y={Math.floor(index / 3) * 50}>
				<Button
					sizes={{ width: 90, height: 40 }}
					onpress={() => {
						context.eventEmitter.broadcast({ type: 'soundPressGeneral' });
						handleSpinSelection(option);
					}}
					anchor={0.5}
				>
					{#snippet children({ center, hovered, pressed })}
						<Container {...center}>
							<!-- Modern button background with glow -->
							<Rectangle
								width={90}
								height={40}
								backgroundColor={hovered ? 0x00ff88 : 0x00000000}
								borderColor={hovered ? 0x00ff88 : 0x333333}
								borderWidth={1}
								borderRadius={8}
								anchor={0.5}
								alpha={hovered ? 0.9 : 0.8}
							/>

							<!-- Hover glow effect -->
							{#if hovered}
								<Rectangle
									width={90 + 10}
									height={40 + 10}
									backgroundColor={0x00ff88}
									alpha={0.2}
									borderRadius={12}
									anchor={0.5}
								/>
							{/if}

							<!-- Spin count text -->
							<Text
								text={option}
								style={{
									fontSize: 14,
									fill: hovered ? 0x000000 : 0xffffff,
									fontWeight: 'bold',
									letterSpacing: 1
								}}
								anchor={0.5}
							/>
						</Container>
					{/snippet}
				</Button>
			</Container>
		{/each}
	</Container>

	<!-- Close hint -->
	<Text
		text="CLICK AUTOPLAY TO CLOSE"
		style={{
			fontSize: 10,
			fill: 0x666666,
			fontWeight: 'normal',
			letterSpacing: 1
		}}
		anchor={0.5}
		y={modalHeight / 2 - 20}
	/>
</Container> 