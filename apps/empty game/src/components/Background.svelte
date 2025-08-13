<script lang="ts">
	import BackgroundsManager from './BackgroundsManager.svelte';

	// Global controls
	let scale = 1; // uniform
	let scaleX = 1; // horizontal multiplier
	let scaleY = 1; // vertical multiplier
	let offsetX = 0; // global X shift
	let offsetY = 0; // global Y shift

	// Per-layer overrides. Tweak any layer here.
	type Ov = { offsetX?: number; offsetY?: number; scaleX?: number; scaleY?: number };
	let overrides: Record<string, Ov> = {
		// BG1
		bg1_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
		bg1_sky: { offsetX: 0, offsetY: -250, scaleX: 0.4, scaleY: 0.6 },
		bg1_styling1: { offsetX: 0, offsetY: 115, scaleX: 0.3, scaleY: 0.5 },
		bg1_styling2: { offsetX: 0, offsetY: 20, scaleX: 0.3, scaleY: 0.5 },
		bg1_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
		// BG2
		bg2_background: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg2_flags: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg2_floor: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		// BG3
		bg3_background: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg3_pillar: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg3_floor: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		// BG4
		bg4_background: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg4_styling1: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg4_flags: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
		bg4_floor: { offsetX: 0, offsetY: 0, scaleX: 1, scaleY: 1 },
	};

	// Slow rightward cloud drift for BG1 sky (px/sec)
	let scrollX = { bg1_sky: 5 } as Record<string, number>;
</script>

<BackgroundsManager {scale} {scaleX} {scaleY} {offsetX} {offsetY} {overrides} {scrollX} />
