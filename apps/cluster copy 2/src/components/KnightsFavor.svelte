<script lang="ts">
  import { Container, Rectangle, BitmapText } from 'pixi-svelte';
  import { getContext } from '../game/context';

  const context = getContext();

  // Overlay state
  let showOverlay = $state(false);
  let targetMult = $state<number | null>(null);
  let currentDisplay = $state('x1');
  let animating = false;
  let badgeShown = $state(false);
  let badgeValue = $state<number>(1);
  // Small boom animation for the selected multiplier
  let boomScale = $state(1);
  let boomAlpha = $state(1);
  let boomAnimating = false;
  let boomScheduled = false;
  function animateBoom() {
    if (boomAnimating) return;
    boomAnimating = true;
    const t0 = performance.now();
    const DUR_UP = 180;
    const DUR_PULSE = 378; // 10% shorter than 420ms for snappier finish
    function step(s: number) {
      const now = performance.now();
      const dt = now - s;
      if (dt <= DUR_UP) {
        const p = dt / DUR_UP;
        const e = 1 - Math.pow(1 - p, 3);
        boomScale = 1 + 0.28 * e; // up to ~1.28x
        boomAlpha = 1;
      } else if (dt <= DUR_UP + DUR_PULSE) {
        const p = (dt - DUR_UP) / DUR_PULSE;
        // Two bounces (2*pi gives one full oscillation = two peaks/troughs)
        boomScale = 1 + 0.12 * Math.sin(p * Math.PI * 1);
        boomAlpha = 1;
      } else {
        boomScale = 1;
        boomAlpha = 1;
        boomAnimating = false;
        return;
      }
      requestAnimationFrame(() => step(s));
    }
    requestAnimationFrame(() => step(t0));
  }

  // Layout
  const screenW = $derived(context.stateLayoutDerived.mainLayout().width);
  const screenH = $derived(context.stateLayoutDerived.mainLayout().height);

  // Tweakable layout (edit these)
  let overlayWidth = $state(360);
  let overlayHeight = $state(200);
  let overlayCenterX: number | null = $state(null); // set a number to override default center
  let overlayCenterY: number | null = $state(null);
  let badgePosX: number | null = $state(null); // set to override default top-right
  let badgePosY: number | null = $state(null);

  // Reel values (tease pool)
  let valuesBase = [1, 2, 3, 5, 10, 20, 25, 50, 100];
  let valuesBonus = [5, 10, 20, 25, 50, 100];
  let reelValues = valuesBase.slice();

  // Simple easing
  function easeOutCubic(p: number) { return 1 - Math.pow(1 - p, 3); }
  function easeInCubic(p: number) { return p * p * p; }
  // Deterministic tease scheduling
  const TEASE_PORTION = 0.9; // 90% duration teases
  const TEASE_FLIPS_BASE = 20;  // evenly spaced flips in base
  const TEASE_FLIPS_BONUS = 20; // evenly spaced flips in bonus

  async function playReelTo(target: number) {
    animating = true;
    showOverlay = true;
    boomScheduled = false;
    // Play start sound
    context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_winlevel_small' } as any);
    const start = performance.now();
    const D = 2200; // ms duration
    const flipsTarget = (reelValues === valuesBonus ? TEASE_FLIPS_BONUS : TEASE_FLIPS_BASE);
    const teaseEnd = D * TEASE_PORTION;
    // Build non-linear schedule: fast at start, extra-slow near the end
    const flipTimes: number[] = [];
    const POWER = 4.0; // stronger than cubic for slower tail
    for (let i = 0; i < flipsTarget; i++) {
      const u = (i + 1) / flipsTarget; // 0..1
      const tFlip = Math.pow(u, POWER) * teaseEnd; // increasing gaps → slowing down
      flipTimes.push(tFlip);
    }
    // Stretch last gap by ~20% for added suspense (ensure monotonic order)
    if (flipTimes.length >= 2) {
      const prev = flipTimes[flipTimes.length - 2];
      const last = flipTimes[flipTimes.length - 1];
      const gap = teaseEnd - last;
      const newLast = Math.max(prev + 10, teaseEnd - gap * 1.4);
      flipTimes[flipTimes.length - 1] = Math.min(newLast, teaseEnd - 5);
    }
    let nextFlipIdx = 0;
    let lastPick = -1;
    while (true) {
      const now = performance.now();
      const t = now - start;
      const p = Math.min(1, t / D);
      // Perform scheduled flips with non-linear cadence
      while (nextFlipIdx < flipTimes.length && t >= flipTimes[nextFlipIdx]) {
        const pool = reelValues;
        let pickIdx = Math.floor(Math.random() * pool.length);
        if (pickIdx === lastPick && pool.length > 1) pickIdx = (pickIdx + 1) % pool.length;
        lastPick = pickIdx;
        const pick = pool[pickIdx];
        currentDisplay = `x${pick}`;
        context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_press_general' } as any);
        nextFlipIdx++;
      }
      // Lock to target in the final window
      if (t >= teaseEnd && currentDisplay !== `x${target}`) {
        currentDisplay = `x${target}`;
        if (!boomScheduled) {
          boomScheduled = true;
          setTimeout(() => animateBoom(), 500);
        }
      }
      if (p >= 1) break;
      await new Promise((r) => setTimeout(r, 16));
    }
    // Landed
    currentDisplay = `x${target}`;
    animating = false;
    // Keep overlay visible during the entire spin
    showOverlay = true;
    badgeShown = true;
    badgeValue = target;
    // Finish sound
    context.eventEmitter.broadcast({ type: 'soundOnce', name: 'sfx_youwon_panel' } as any);
    if (!boomScheduled) {
      boomScheduled = true;
      setTimeout(() => animateBoom(), 500);
    }
    // Notify controller the animation is complete
    context.eventEmitter.broadcast({ type: 'knightsFavorComplete' } as any);
  }

  // Listen for start/end messages
  context.eventEmitter.subscribeOnMount({
    knightsFavorStart: (e: { mult: number; mode?: 'base' | 'bonus' }) => {
      targetMult = e.mult;
      // Select tease pool based on mode. Bonus should never show <5x.
      reelValues = (e.mode === 'bonus') ? valuesBonus.slice() : valuesBase.slice();
      currentDisplay = 'x1';
      // Slight delay to ensure overlay paints before anim frames
      setTimeout(() => playReelTo(e.mult), 50);
    },
    // Ensure badge visibility matches runner mode
    runnerModeEnable: (e: { enabled: boolean }) => {
      if (e.enabled) {
        if (targetMult !== null) { badgeShown = true; badgeValue = targetMult; }
        showOverlay = true;
      } else {
        badgeShown = false;
        showOverlay = false;
      }
    },
    // Visual effect: Drag favor badge onto the run counter at exit end
    runnerExitEnd: () => {
      // small visual pulse here already occurs in RunWinCounter
      // could animate badge moving if needed (future)
    },
    playerStopRunning: () => { badgeShown = false; showOverlay = false; },
  } as any);
</script>

<!-- Overlay: simple reel-like centered card -->
{#if showOverlay}
  <Container x={(overlayCenterX ?? (screenW * 0.39))} y={(overlayCenterY ?? (screenH * 0.35))}>
    <Rectangle width={overlayWidth - 175} height={overlayHeight - 105} anchor={0.5} backgroundColor={0x111111} borderColor={0xffffff} borderWidth={3} borderRadius={16} alpha={0.95} />
    <BitmapText text="KNIGHTS FAVOR" anchor={0.5} x={0} y={-Math.round(overlayHeight * 0.1)} style={{ fontFamily: 'Gladiators', fontSize: 24, fill: 0xFFFFAA }} />
    <BitmapText text={currentDisplay} anchor={0.5} x={0} y={Math.round(overlayHeight * 0.1)} scale={{ x: boomScale, y: boomScale }} alpha={boomAlpha} style={{ fontFamily: 'Gladiators', fontSize: 52, fill: 0xFFFFFF }} />
  </Container>
{/if}

<!-- Persistent badge during run -->
{#if badgeShown}
  <Container x={(badgePosX ?? (screenW - 140))} y={(badgePosY ?? 60)}>
    <Rectangle width={180} height={42} anchor={0.5} backgroundColor={0x222233} borderColor={0x88CCFF} borderWidth={2} borderRadius={12} alpha={0.9} />
    <BitmapText text="Knights Favor:" anchor={{ x: 1, y: 0.5 }} x={-10} y={0} style={{ fontFamily: 'Gladiators', fontSize: 20, fill: 0xAADDFF }} />
    <BitmapText text={`x${badgeValue}`} anchor={{ x: 0, y: 0.5 }} x={0} y={0} style={{ fontFamily: 'Gladiators', fontSize: 24, fill: 0xFFFFFF }} />
  </Container>
{/if}


