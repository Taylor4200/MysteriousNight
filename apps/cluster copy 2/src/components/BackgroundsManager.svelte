<script lang="ts">
	import { Container, Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';
	import { onMount } from 'svelte';

	type Layer = { key: string; factor: number; z: number };
	type Zone = 'BG1';

	const context = getContext();

	// TEMP: disable styling layers entirely per request
	const DISABLE_STYLING = true;

    interface Props {
		zone: Zone;
		scale?: number;
		scaleX?: number;
		scaleY?: number;
		offsetX?: number;
		offsetY?: number;
		overrides?: Record<string, Partial<Layer>>;
		scrollX?: Record<string, number>;
        worldX?: number; // camera/player world position to drive tiling
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
        worldX = 0,
	} = $props();

	// Only BG1 layers for infinite parallax
	const layersByZone: Record<Zone, Layer[]> = {
		BG1: [
			{ key: 'bg1_background', factor: 0.0, z: 0 },
			{ key: 'bg1_sky', factor: 0.1, z: 1 },
			{ key: 'bg1_styling2', factor: 0.2, z: 2 },
			{ key: 'bg1_styling1', factor: 0.3, z: 2 },
			{ key: 'bg1_floor', factor: 0.4, z: 3 },
		],
	};

	const bgLayout = $derived(context.stateLayoutDerived.normalBackgroundLayout({ scale }));
	const baseW = $derived('width' in bgLayout ? bgLayout.width : undefined);
	const baseH = $derived('height' in bgLayout ? bgLayout.height : undefined);
	const bgX = $derived(bgLayout.x + offsetX);
	const bgY = $derived(bgLayout.y + offsetY);

    // Per-layer auto-scroll for parallax effect
    let offsets = $state<Record<string, number>>({});
    // Per-segment styling cache (decision segments can be smaller than draw width)
    let segmentHasStyling = new Map<number, boolean>();
    function ensureStylingDecision(idx: number) {
        if (idx === 0) return true;
        if (!segmentHasStyling.has(idx)) {
            segmentHasStyling.set(idx, Math.random() < 0.10);
        }
        return segmentHasStyling.get(idx)!;
    }
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

    $effect(() => {
        if (baseW) {
            segmentHasStyling = new Map<number, boolean>();
            // Seed initial decision segments covering the initial viewport tiles
            for (let k = -3; k <= 3; k++) segmentHasStyling.set(k, true);
        }
    });
</script>

<Container>
	{#if baseW}
		{#each layersByZone[zone as Zone] as l}
        {@const ov = overrides[l.key] || {}}
        {@const s = scrollX[l.key]}
        {@const autoShift = offsets[l.key] ?? 0}
        {@const worldShiftEffective = l.key === 'bg1_sky' ? 0 : (-worldX * l.factor)}
        {@const tileW = (baseW ?? 0) * (ov.scaleX ?? 1) * scaleX}
        {@const tileH = (baseH ?? 0) * (ov.scaleY ?? 1) * scaleY}
        {@const shiftForDraw = wrap(worldShiftEffective + autoShift, tileW)}
        {@const overlap = 2} <!-- px overlap to hide seams between tiles -->
        <!-- DECISION INDEX MUST BE CAMERA/PLAYER BASED, NOT LAYER-FACTOR BASED -->
        {@const cameraIndexBase = Math.floor(worldX / tileW)}
        <!-- Determine how many tiles are needed to cover the viewport width for scaled layers -->
        {@const tilesEachSide = Math.max(1, Math.ceil(baseW / tileW))}
        {#each Array.from({ length: tilesEachSide * 2 + 1 }, (_, idx) => idx - tilesEachSide) as i (i)}
            {@const segmentIndex = cameraIndexBase + i}
            {@const isStylingLayer = (l.key === 'bg1_styling1' || l.key === 'bg1_styling2')}
            {@const isSkyLayer = l.key === 'bg1_sky'}
            {@const forcedStyled = isStylingLayer && (i === 0 || i === 1)}
            {@const showStyling = forcedStyled ? true : ensureStylingDecision(segmentIndex)}
            {@const tileVisible = isStylingLayer ? (!DISABLE_STYLING && showStyling) : true}
            {#if tileVisible}
                <Sprite
                    key={l.key}
                    zIndex={l.z}
                    anchor={0.5}
                    x={isSkyLayer ? (bgX + (ov.offsetX ?? 0) + shiftForDraw + i * tileW) : Math.round(bgX + (ov.offsetX ?? 0) + shiftForDraw + i * tileW)}
                    y={isSkyLayer ? (bgY + (ov.offsetY ?? 0)) : Math.round(bgY + (ov.offsetY ?? 0))}
                    width={tileW + overlap}
                    height={tileH}
                    scale={{ x: (ov.scaleX ?? 1) * scaleX, y: (ov.scaleY ?? 1) * scaleY }}
                />
            {/if}
        {/each}
		{/each}
	{/if}
</Container>
