<script lang="ts">
	import { Button } from 'components-pixi';
	import { Rectangle, Text } from 'pixi-svelte';
	import { getContext } from '../game/context';

	type Props = {
		sizes: { width: number; height: number };
	};

	const props: Props = $props();
	const context = getContext();
</script>

<Button sizes={props.sizes} onpress={() => context.eventEmitter.broadcast({ type: 'clusterInfoOpen' })} anchor={0.5}>
	{#snippet children({ center, hovered, pressed })}
		<Rectangle
			{...center}
			width={props.sizes.width}
			height={props.sizes.height}
			backgroundColor={hovered ? 0x00ff88 : 0x00000000}
			borderColor={hovered ? 0x00ff88 : 0xffffff}
			borderWidth={1}
			borderRadius={props.sizes.height / 2}
			anchor={0.5}
			alpha={0.9}
		/>
		<Text text="INFO" style={{ fontSize: 12, fill: hovered ? 0x000000 : 0xffffff, fontWeight: 'bold' }} anchor={0.5} />
	{/snippet}
</Button>
