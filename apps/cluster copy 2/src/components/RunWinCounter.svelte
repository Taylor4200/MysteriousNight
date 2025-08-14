<script lang="ts">
  import { BitmapText, Container } from 'pixi-svelte';
  import { getContext } from '../game/context';

  const context = getContext();

  // Visual-only win counter that accelerates with distance and speed
  let displayedWin = $state(0);
  let playerX = $state(context.stateLayoutDerived.mainLayout().width * 0.5);
  let playerY = $state(context.stateLayoutDerived.mainLayout().height * 0.67);
  let isRunning = $state(false);
  let totalDistance = $state(0); // in world units
  let lastDx = 0;
  // Visual tint state: neutral during run, green on win, red on loss
  let tintState = $state<'neutral' | 'win' | 'loss'>('neutral');
  // Allow an external controller to drive the multiplier directly (without layout changes)
  let counterOverride = $state(false);
  let frozenX: number | null = $state(null);
  let frozenY: number | null = $state(null);
  // Only show during an engaged spin / runner override
  let showCounter = $state(false);
  // Meat disabled: keep only target cap
  let targetCapMult = $state<number | null>(null);
  // Base progress from runner (0..1) and base multiplier from controller (without meat)
  let tBase = $state(0);
  let baseMult = $state(0);

  // Simple win finish animation state (scale + pulse)
  let finishScale = $state(1);
  let finishAlpha = $state(1);
  let isFinishing = $state(false);
  // Knight's Favor value (applied at exit)
  let knightsFavorMult = $state(1);

  function animateFinish() {
    if (isFinishing) return;
    isFinishing = true;
    const tStart = performance.now();
    const durUp = 250;
    const durPulse = 600;
    function tick(t0: number) {
      const now = performance.now();
      const dt = now - t0;
      if (!isFinishing) { finishScale = 1; finishAlpha = 1; return; }
      if (dt <= durUp) {
        const p = dt / durUp; // 0..1
        const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
        finishScale = 1 + 0.4 * e; // up to 1.4x
        finishAlpha = 1;
      } else {
        const p = Math.min(1, (dt - durUp) / durPulse);
        // 2 pulses using sine
        finishScale = 1 + 0.15 * Math.sin(p * Math.PI * 4);
        finishAlpha = 1;
        if (p >= 1) { isFinishing = false; finishScale = 1; finishAlpha = 1; return; }
      }
      requestAnimationFrame(() => tick(t0));
    }
    requestAnimationFrame(() => tick(tStart));
  }

  // Hook into movement/run events
  context.eventEmitter.subscribeOnMount({
    playerStartRunning: () => {
      isRunning = true;
      lastDx = 0;
      // reset loss tint when a new run starts
      tintState = 'neutral';
      showCounter = true;
      targetCapMult = null;
      tBase = 0;
      baseMult = 0;
      displayedWin = 0;
      if (frozenX === null || frozenY === null) {
        frozenX = playerX;
        frozenY = playerY;
      }
    },
    // Reset counter anchor and value at favor start to avoid residuals
    knightsFavorStart: (e?: { mult?: number }) => {
      isRunning = false;
      lastDx = 0;
      tintState = 'neutral';
      showCounter = false;
      targetCapMult = null;
      tBase = 0;
      baseMult = 0;
      displayedWin = 0;
      frozenX = playerX;
      frozenY = playerY;
      if (e && typeof e.mult === 'number') {
        knightsFavorMult = Math.max(1, e.mult);
      } else {
        knightsFavorMult = 1;
      }
    },
    playerStopRunning: () => {
      isRunning = false;
      lastDx = 0;
      // keep visible until user taps screen or starts next spin
    },
    playerStumbled: () => {
      tintState = 'loss';
    },
    // Explicit tint events for runner controller
    runnerTint: (e: { color: 'win' | 'loss' | 'normal' }) => {
      if (e.color === 'win') {
        tintState = 'win';
        // Final clamp to the exact target at finish
        if (targetCapMult !== null) displayedWin = targetCapMult;
        animateFinish();
      } else if (e.color === 'loss') {
        tintState = 'loss';
      } else {
        tintState = 'neutral';
      }
    },
    // Set target multiplier cap (meat disabled)
    runnerTargetMult: (e: { mult: number }) => {
      targetCapMult = e.mult;
      // Immediately clamp current display to target using base progress only
      const baseDisplayed = targetCapMult * tBase;
      displayedWin = Math.min(targetCapMult, baseDisplayed);
    },
    // Track canonical progress. When target is known, derive display from progress (no meat)
    runnerProgress: (e: { t: number }) => {
      tBase = Math.max(0, Math.min(1, e.t));
      if (targetCapMult !== null) {
        const baseDisplayed = targetCapMult * tBase;
        displayedWin = Math.min(targetCapMult, baseDisplayed);
      }
    },
    runnerCounterSet: (e: { mult: number }) => {
      baseMult = Math.max(0, e.mult);
      // If target is known, prefer target * progress (clamped)
      if (targetCapMult !== null) {
        const baseDisplayed = targetCapMult * tBase;
        displayedWin = Math.min(targetCapMult, baseDisplayed);
      } else {
        // No target yet: show only base multiplier from controller (meat should NOT change final)
        displayedWin = baseMult;
      }
      counterOverride = true;
      showCounter = true;
      if (frozenX === null || frozenY === null) {
        frozenX = playerX;
        frozenY = playerY;
      }
    },
    // Meat disabled: no-op
    meatCollectedVisual: () => {
      // intentionally left blank
    },
    runnerCounterClear: () => {
      counterOverride = false;
      // keep last value and frozen position; will hide on user action or next spin
    },
    runnerFreezePos: (e: { x: number; y: number }) => {
      frozenX = e.x;
      frozenY = e.y;
      counterOverride = true;
      showCounter = true;
    },
    runnerUnfreezePos: () => {
      frozenX = null;
      frozenY = null;
    },
    // When hero has run off-screen on a win, show the multiplied full total
    runnerExitEnd: () => {
      if (targetCapMult !== null) {
        const multiplied = targetCapMult * Math.max(1, knightsFavorMult);
        displayedWin = multiplied;
        // Brief win celebration
        animateFinish();
      }
    },
    // Hide counter on user click (press to continue)
    pressToContinue: () => {
      showCounter = false;
      frozenX = null;
      frozenY = null;
    },
    playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
      // Update world-driven counter inputs
      totalDistance += Math.abs(e.dx);
      lastDx = e.dx;
      // Do not change on-screen anchor while runner is controlling the counter
      if (!counterOverride) {
        playerX = e.playerX;
        playerY = e.playerY;
      }
    },
  });

  // Integrate win visually based on speed and distance
  $effect(() => {
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; // seconds
      last = now;

      if (!isRunning || counterOverride) return;

      const speed = Math.abs(lastDx); // world units per tick (approx)
      // Rate grows with speed and distance. Tuned constants for feel.
      const distanceFactor = Math.min(1.0, totalDistance / 3000); // caps as you run
      const ratePerSec = 0.2 + 0.08 * speed + 0.6 * distanceFactor;
      displayedWin += ratePerSec * dt;
    }, 50);
    return () => clearInterval(id);
  });

  const textValue = $derived(`x${displayedWin.toFixed(2)}`);
  const headOffsetY = -170; // place above character head
	const headOffsetX = -85; // small left bias

  // Fonts are preloaded by the app loader (type: 'font'), so the bitmap font is available here
  const fontLoaded = true;

  // Avoid TS complaining about BitmapText style typing (uses BitmapFont style)
  const bitmapStyle: any = $derived({
    fontFamily: 'Gladiators',
    fontSize: tintState === 'win' && targetCapMult !== null && tBase >= 1 ? 64 : 44,
    fill: tintState === 'loss' ? 0xFF4D4D : tintState === 'win' ? 0x19FF88 : 0xFFD54D,
    align: 'center',
  });
</script>

{#if fontLoaded && showCounter}
  <Container x={(frozenX ?? playerX) + headOffsetX} y={(frozenY ?? playerY) + headOffsetY} scale={finishScale} alpha={finishAlpha}>
    <BitmapText text={textValue} style={bitmapStyle} anchor={{ x: 0.5, y: 0.5 }} />
  </Container>
{/if}


