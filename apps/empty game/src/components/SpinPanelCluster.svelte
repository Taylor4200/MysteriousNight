<script lang="ts">
	import { Container, anchorToPivot } from 'pixi-svelte';
	import { Button } from 'components-pixi';
	import { Rectangle, Text } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import ButtonInfoCluster from './ButtonInfoCluster.svelte';

	const context = getContext();

	type Props = { anchor?: { x: number; y: number } };
	const props: Props = $props();

	const spinButtonRadius = 80;
	const betButtonRadius = 40;
	const infoHeight = 30;
	const totalWidth = spinButtonRadius * 2 + betButtonRadius * 2 + 40; // same layout width
	const totalHeight = spinButtonRadius * 2 + infoHeight + 20;

	let isSpinning = $derived(!context.stateXstateDerived.isIdle());

	function handleSpin() {
		if (!isSpinning) {
			context.eventEmitter.broadcast({ type: 'soundPressBet' });
			context.eventEmitter.broadcast({ type: 'bet' });
		}
	}
</script>

<Container x={props.anchor?.x ?? 0} y={props.anchor?.y ?? 0} pivot={anchorToPivot({ anchor: props.anchor ?? { x: 0.5, y: 0.5 }, sizes: { width: totalWidth, height: totalHeight } })}>
	<!-- Spin Button -->
	<Container x={0} y={0}>
		<Button sizes={{ width: spinButtonRadius * 2, height: spinButtonRadius * 2 }} onpress={handleSpin} disabled={isSpinning} anchor={0.5}>
			{#snippet children({ center, hovered })}
				<Container {...center}>
					<Rectangle width={spinButtonRadius * 2} height={spinButtonRadius * 2} backgroundColor={0x00000000} borderColor={hovered ? 0x00ff88 : 0xffffff} borderWidth={3} borderRadius={spinButtonRadius} anchor={0.5} alpha={0.9} />
					<Text text="⟲" style={{ fontSize: 48, fill: 0xffffff, fontWeight: 'bold' }} anchor={0.5} />
				</Container>
			{/snippet}
		</Button>
	</Container>

	<!-- Info button (replaces autoplay/paytable area) -->
	<Container x={0} y={spinButtonRadius + infoHeight}>
		<ButtonInfoCluster sizes={{ width: 120, height: infoHeight }} />
	</Container>
</Container>
