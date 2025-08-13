<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import { onMount } from 'svelte';

	type Layer = { key: string; factor: number; z: number };
	type Zone = 'BG1' | 'BG2' | 'BG3' | 'BG4';

	const context = getContext();

	interface Props {
		zone: Zone;
		scale?: number;
		scaleX?: number;
		scaleY?: number;
		offsetX?: number;
		offsetY?: number;
		overrides?: Record<string, Partial<Layer>>;
		scrollX?: Record<string, number>;
		continuousZonePosition?: number; // 0..3
	}

	const {
		zone,
		scale = 1,
		scaleX = 1,
		scaleY = 1,
		offsetX = 0,
		offsetY = 0,
		overrides = {},
		scrollX = {},
		continuousZonePosition = 0,
	} = $props();

	const zones: Zone[] = ['BG1', 'BG2', 'BG3', 'BG4'];

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
			{ key: 'bg4_background', factor: 0.0, z: 0 },
			{ key: 'bg4_styling1', factor: 0.2, z: 2 },
			{ key: 'bg4_flags', factor: 0.3, z: 3 },
			{ key: 'bg4_floor', factor: 0.4, z: 4 },
		],
		BG4: [
			{ key: 'bg3_background', factor: 0.0, z: 0 },
			{ key: 'bg3_pillar', factor: 0.2, z: 2 },
			{ key: 'bg3_floor', factor: 0.4, z: 3 },
		],
	};

	const bgLayout = $derived(context.stateLayoutDerived.normalBackgroundLayout({ scale }));
	const baseW = $derived('width' in bgLayout ? bgLayout.width : undefined);
	const baseH = $derived('height' in bgLayout ? bgLayout.height : undefined);
	const bgX = $derived(bgLayout.x + offsetX);
	const bgY = $derived(bgLayout.y + offsetY);

	// Per-layer auto-scroll (e.g., clouds)
	let offsets = $state<Record<string, number>>({});
	let rafId: number | undefined;

	onMount(() => {
		let last = performance.now();
		const loop = () => {
			const now = performance.now();
			const dt = (now - last) / 1000;
			last = now;
			for (const k in scrollX) {
				const speed = scrollX[k] || 0;
				offsets[k] = (offsets[k] ?? 0) + speed * dt;
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
	{#if baseW}
			{#each layersByZone[zone] as l}
		{@const ov = overrides[l.key] || {}}
		{@const s = scrollX[l.key]}
		
		{#if s}
			{@const shift = wrap(offsets[l.key] ?? 0, baseW)}
			<!-- Single sprite with scroll offset -->
			<Sprite
				key={l.key}
				zIndex={l.z}
				anchor={0.5}
				x={bgX + (ov.offsetX ?? 0) + shift}
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
				x={bgX + (ov.offsetX ?? 0)}
				y={bgY + (ov.offsetY ?? 0)}
				width={baseW}
				height={baseH}
				scale={{ x: (ov.scaleX ?? 1) * scaleX, y: (ov.scaleY ?? 1) * scaleY }}
			/>
		{/if}
	{/each}
	{/if}
</Container>
