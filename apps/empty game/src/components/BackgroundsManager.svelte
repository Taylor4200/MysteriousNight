<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import { onMount } from 'svelte';

	type Layer = { key: string; factor: number; z: number };
	type Zone = 'BG1' | 'BG2' | 'BG3' | 'BG4';
	type Override = { offsetX?: number; offsetY?: number; scaleX?: number; scaleY?: number };

	const context = getContext();
	const props: {
		zone?: Zone;
		scale?: number;
		scaleX?: number;
		scaleY?: number;
		offsetX?: number;
		offsetY?: number;
		overrides?: Record<string, Override>;
		scrollX?: Record<string, number>;
	} = $props();

	const zone = $derived(props.zone ?? 'BG1');
	const scale = $derived(props.scale ?? 1);
	const scaleX = $derived(props.scaleX ?? 1);
	const scaleY = $derived(props.scaleY ?? 1);
	const offsetX = $derived(props.offsetX ?? 0);
	const offsetY = $derived(props.offsetY ?? 0);
	const overrides = $derived(props.overrides ?? {});
	const scrollX = $derived(props.scrollX ?? {});
	let cameraX = $state(0);

	const layersByZone: Record<Zone, Layer[]> = {
		BG1: [
			{ key: 'bg1_background', factor: 0.0, z: 0 },
			{ key: 'bg1_sky', factor: 0.1, z: 1 },
			{ key: 'bg1_styling2', factor: 0.2, z: 2 },
			{ key: 'bg1_styling1', factor: 0.3, z: 2 },
			{ key: 'bg1_floor', factor: 0.4, z: 3 },
		],
		BG2: [
			{ key: 'bg2_background', factor: 0.0, z: 0 },
			{ key: 'bg2_flags', factor: 0.2, z: 2 },
			{ key: 'bg2_floor', factor: 0.4, z: 3 },
		],
		BG3: [
			{ key: 'bg3_background', factor: 0.0, z: 0 },
			{ key: 'bg3_pillar', factor: 0.2, z: 2 },
			{ key: 'bg3_floor', factor: 0.4, z: 3 },
		],
		BG4: [
			{ key: 'bg4_background', factor: 0.0, z: 0 },
			{ key: 'bg4_styling1', factor: 0.2, z: 2 },
			{ key: 'bg4_flags', factor: 0.3, z: 3 },
			{ key: 'bg4_floor', factor: 0.4, z: 4 },
		],
	};

	const bgLayout = $derived(context.stateLayoutDerived.normalBackgroundLayout({ scale }));
	const baseW = $derived('width' in bgLayout ? bgLayout.width : undefined);
	const baseH = $derived('height' in bgLayout ? bgLayout.height : undefined);
	const bgX = $derived(bgLayout.x + offsetX);
	const bgY = $derived(bgLayout.y + offsetY);

	// Make offsets reactive so UI updates as they change
	let offsets = $state<Record<string, number>>({});
	let rafId: number | undefined;

	onMount(() => {
		let last = performance.now();
		const loop = () => {
			const now = performance.now();
			const dt = (now - last) / 1000;
			last = now;
			for (const key in scrollX) {
				const speed = scrollX[key] || 0;
				offsets[key] = (offsets[key] ?? 0) + speed * dt;
			}
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
		};
	});

	const wrap = (value: number, size: number) => ((value % size) + size) % size;
</script>

<Container>
	{#each layersByZone[zone] as l}
		{@const ov = overrides[l.key] || {}}
		{@const s = scrollX[l.key]}
		{@const shift = baseW && s ? wrap(offsets[l.key] ?? 0, baseW) : 0}
		{#if baseW && s}
			<!-- two wrapped sprites for seamless scroll -->
			<Sprite
				key={l.key}
				zIndex={l.z}
				anchor={0.5}
				x={bgX + (ov.offsetX ?? 0) + shift - cameraX * l.factor}
				y={bgY + (ov.offsetY ?? 0)}
				width={baseW}
				height={baseH}
				scale={{ x: (ov.scaleX ?? 1) * scaleX, y: (ov.scaleY ?? 1) * scaleY }}
			/>
			<Sprite
				key={l.key}
				zIndex={l.z}
				anchor={0.5}
				x={bgX + (ov.offsetX ?? 0) + shift - Math.sign(s) * baseW - cameraX * l.factor}
				y={bgY + (ov.offsetY ?? 0)}
				width={baseW}
				height={baseH}
				scale={{ x: (ov.scaleX ?? 1) * scaleX, y: (ov.scaleY ?? 1) * scaleY }}
			/>
		{:else}
			<Sprite
				key={l.key}
				zIndex={l.z}
				anchor={0.5}
				x={bgX + (ov.offsetX ?? 0) - cameraX * l.factor}
				y={bgY + (ov.offsetY ?? 0)}
				width={baseW}
				height={baseH}
				scale={{ x: (ov.scaleX ?? 1) * scaleX, y: (ov.scaleY ?? 1) * scaleY }}
			/>
		{/if}
	{/each}
</Container>
