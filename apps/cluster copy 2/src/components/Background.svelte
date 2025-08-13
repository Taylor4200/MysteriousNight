<script lang="ts">
	import BackgroundsManager from './BackgroundsManager.svelte';
import { getContext } from '../game/context';
import { onMount } from 'svelte';

	const context = getContext();

	// Global controls
	let scale = 1; // uniform
	let scaleX = 1; // horizontal multiplier
	let scaleY = 1; // vertical multiplier
	let offsetX = 0; // global X shift
	let offsetY = 0; // global Y shift

	// Per-layer overrides for BG1 only
	type Ov = { offsetX?: number; offsetY?: number; scaleX?: number; scaleY?: number };
	let overrides: Record<string, Ov> = {
		// BG1 only - for infinite parallax
		bg1_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
		bg1_sky: { offsetX: 0, offsetY: -250, scaleX: 0.4, scaleY: 0.6 },
		bg1_styling1: { offsetX: 0, offsetY: 115, scaleX: 0.3, scaleY: 0.5 },
		bg1_styling2: { offsetX: 0, offsetY: 20, scaleX: 0.3, scaleY: 0.5 },
		bg1_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
	};

    // Styling visibility is decided per-segment inside BackgroundsManager now.

	// Scrolling effects for BG1 layers (px/sec)
	// BG1 sky (clouds) moves for parallax effect
  // Parallax speeds (px/sec). Sky is constant; other layers move via camera delta
  let scrollX = { 
    bg1_sky: 12, // clouds drift always
    bg1_background: 0,
    bg1_styling2: 0,
    bg1_styling1: 0,
    bg1_floor: 0
  } as Record<string, number>;

  const BASE_SKY_SPEED = 12; // px/sec (constant drift)
  let cameraWorldX = $state(0);
  let prevCameraWorldX = 0;
	
  // Always use BG1 for infinite parallax
	let currentZone = 'BG1' as const;

	// Run state: background should only move while a spin/run is engaged
	let isRunning = $state(false);

	// Accumulated world position to drive infinite tiling
	let worldX = $state(0);

	// Listen for run start/stop events
    context.eventEmitter.subscribeOnMount({
        playerStartRunning: () => {
            isRunning = true;
            // NOTE: styling visibility is now decided per-segment inside BackgroundsManager, not globally here.
        },
        playerStopRunning: () => {
            isRunning = false;
            // Immediately freeze all non-sky layers when user stops
            scrollX.bg1_floor = 0;
            scrollX.bg1_styling1 = 0;
            scrollX.bg1_styling2 = 0;
            scrollX.bg1_background = 0;
            scrollX.bg1_sky = BASE_SKY_SPEED;
        },
    });
	
	// Listen to playerMoved for background scrolling
    context.eventEmitter.subscribeOnMount({
        playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
            // World progression: driven by player movement (dx)
            worldX += e.dx;
        },
        cameraMoved: (e: { worldX: number }) => {
            // Camera-centric parallax: use camera delta to slide layers
            cameraWorldX = e.worldX;
            const dCam = cameraWorldX - prevCameraWorldX;
            prevCameraWorldX = cameraWorldX;
            // Convert camera delta per frame directly to scroll, no time-based dependence
            const v = dCam; // use delta pixels per frame
            scrollX.bg1_floor = -v * 3.0;
            scrollX.bg1_styling1 = -v * 1.6;
            scrollX.bg1_styling2 = -v * 1.2;
            scrollX.bg1_background = -v * 0.5;
            scrollX.bg1_sky = BASE_SKY_SPEED; // constant drift only
        },
    });
</script>

<!-- Use the camera/player world position broadcast by Characters/RunScene to drive tiling -->
<svelte:window on:playerMoved={(e: CustomEvent) => { /* no-op to enable event typing */ }} />
<BackgroundsManager
    zone={currentZone}
    {scale}
    {scaleX}
    {scaleY}
    {offsetX}
    {offsetY}
    {overrides}
    {scrollX}
	worldX={worldX}
/>
