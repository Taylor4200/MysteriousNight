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
		bg1_floor: { offsetX: 1300, offsetY: 265, scaleX: 1, scaleY: 0.3 },
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

  const BASE_SKY_SPEED = 18; // px/sec (slightly faster to reduce stepping perception)
  let cameraWorldX = $state(0);
  let prevCameraWorldX = 0;
	
  // Always use BG1 for infinite parallax
	let currentZone = 'BG1' as const;

	// Run state: background should only move while a spin/run is engaged
	let isRunning = $state(false);

	// Accumulated world position to drive infinite tiling
	let worldX = $state(0);
  // Counter-driven visual speed multiplier
  let runSpeedMult = $state(1);
  // Counter progress to tie scroll directly to win counter growth
  let tProgress = $state(0);
  // Accumulate tiny progress deltas between frames to convert directly into px scroll
  let tDeltaAccum = $state(0);
  // Optional direct runner speed to better sync floor and counter
  let runnerPxPerSec = $state<number | null>(null);
  // Exit phase flag for special high-speed camera-based scroll
  let isExiting = $state(false);

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
        runnerExitStart: () => { isExiting = true; },
        runnerExitEnd: () => { isExiting = false; },
    });
	
	// Listen to playerMoved for background scrolling
    context.eventEmitter.subscribeOnMount({
        // Hard reset of world and scroll offsets at favor start
        knightsFavorStart: () => {
            worldX = 0;
            cameraWorldX = 0;
            prevCameraWorldX = 0;
            (window as any).__bg_lastT = 0;
            (window as any).__bg_lastEff = 0;
            (window as any).__bg_lastUpdateMs = undefined;
            tDeltaAccum = 0;
            scrollX.bg1_floor = 0;
            scrollX.bg1_styling1 = 0;
            scrollX.bg1_styling2 = 0;
            scrollX.bg1_background = 0;
            scrollX.bg1_sky = BASE_SKY_SPEED;
        },
        // Reset to the initial frame/position when a new action/spin kicks off
        resetBackground: () => {
            worldX = 0;
            cameraWorldX = 0;
            prevCameraWorldX = 0;
        },
        playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
            // World progression: driven by player movement (dx)
            worldX += e.dx;
        },
        // Progress → parallax multiplier (match counter; boost early feel)
        runnerProgress: (e: { t: number }) => {
            tProgress = Math.max(0, Math.min(1, e.t));
            // Exponential normalised mapping to boost mid/late segment without changing counter
            const BASE_MULT = 3.0;  // higher baseline scroll so start feels fast
            const GAIN_T   = 24.0;  // stronger gain over time
            const K        = 3.2;   // steeper curve for mid/late acceleration
            const norm = Math.expm1(K * tProgress) / Math.expm1(K); // 0..1
            runSpeedMult = Math.max(BASE_MULT, BASE_MULT + norm * GAIN_T);

            // Also accumulate exact progress delta so we can apply a per-tick px boost
            // This keeps scroll increases perfectly proportional to counter growth
            // (use cameraMoved to consume this in one frame)
            const prev = (window as any).__bg_lastT ?? 0;
            const dT = Math.max(0, tProgress - prev);
            (window as any).__bg_lastT = tProgress;
            tDeltaAccum += dT;
        },
        runnerSpeed: (e: { pxPerSec: number }) => {
            runnerPxPerSec = e.pxPerSec;
        },
        // Meat removed: ignore legacy effective progress events
        runnerProgressEffective: () => {},
        cameraMoved: (e: { worldX: number }) => {
            cameraWorldX = e.worldX;
            let v = 0;
            if (isExiting) {
                // During exit, drive scroll by camera delta for smooth ultra-fast zoom
                const dCam = cameraWorldX - prevCameraWorldX;
                prevCameraWorldX = cameraWorldX;
                const EXIT_GAIN = 20.0; // amplify camera delta strongly
                v = dCam * EXIT_GAIN;
                // consume any leftover progress
                tDeltaAccum = 0;
            } else {
                // Deterministic scroll from counter progress only; stronger start and ramp
                const BASE_SCROLL_PER_T = 50040; // fast baseline
                const RAMP_GAIN = 2.4;           // much stronger ramping up to +240%
                const RAMP_CURVE = 3.0;          // steeper mid/late curve
                const rampFactor = 1 + RAMP_GAIN * Math.pow(tProgress, RAMP_CURVE);
                v = tDeltaAccum * BASE_SCROLL_PER_T * rampFactor;
                tDeltaAccum = 0;
            }
            scrollX.bg1_floor = -v * 12.0; // much faster floor scroll
            scrollX.bg1_styling1 = -v * 1.6;
            scrollX.bg1_styling2 = -v * 1.2;
            scrollX.bg1_background = -v * 0.5;
            scrollX.bg1_sky = BASE_SKY_SPEED; // constant drift only
        },
    });
</script>

<!-- Use the camera/player world position broadcast by Characters/RunScene to drive tiling -->
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
