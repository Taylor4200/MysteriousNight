<script lang="ts">
  import * as PIXI from 'pixi.js';
  import { onMount } from 'svelte';
  import { Camera } from '../components/Camera';
  import { ParallaxManager, type ParallaxTextures } from '../components/ParallaxManager';
  import assets from '../game/assets';
  import { getContext } from '../game/context';
  
  // Props / hooks
  export let enableFx: boolean = true;
  export let onCollect: (mult: number) => void = () => {};
  export let onStumble: () => void = () => {};

  // Internal
  let app: PIXI.Application | null = null;
  let viewEl: HTMLDivElement | null = null;
  let parallax: ParallaxManager | null = null;
  let camera: Camera | null = null;
  let playerXWorld = 0; // world position
  let playerSpeed = 120; // px/sec (base)
  let playerMaxSpeed = 420; // px/sec
  let playerAcceleration = 220; // px/sec^2
  let stumble = false;
  let firstSpinShowAllLayers = true;
  let inRound = false;
  let currentBet = 1_000_000; // $1 default
  let lastPlayWin = 0; // last outcome from /play (int, 6dp)
  let rgs: ReturnType<typeof createRgsClient> | null = null;

  const context = getContext();

  const getBG1Textures = async (): Promise<ParallaxTextures> => {
    const loader = PIXI.Assets; // v7 global loader
    const names = ['bg1_sky', 'bg1_background', 'bg1_styling1', 'bg1_styling2', 'bg1_floor'] as const;
    const textures: Partial<Record<(typeof names)[number], PIXI.Texture>> = {};
    // Ensure assets are registered
    for (const n of names) {
      const entry = (assets as any)[n];
      if (!entry) continue;
      await loader.load(entry.src).then(() => {});
      const tex = PIXI.Texture.from(entry.src);
      textures[n] = tex;
    }
    return textures;
  };

  const BG_OVERRIDES = {
    bg1_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
    bg1_sky: { offsetX: 0, offsetY: -250, scaleX: 0.4, scaleY: 0.6 },
    bg1_styling1: { offsetX: 0, offsetY: 115, scaleX: 0.3, scaleY: 0.5 },
    bg1_styling2: { offsetX: 0, offsetY: 20, scaleX: 0.3, scaleY: 0.5 },
    bg1_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
  } as const;

  const randomizeStylingVisibility = () => {
    if (!parallax) return;
    // FX toggle gate
    if (!enableFx) {
      parallax.setLayerVisible('bg1_styling1', false);
      parallax.setLayerVisible('bg1_styling2', false);
      return;
    }
    // First spin always show all
    if (firstSpinShowAllLayers) {
      parallax.setLayerVisible('bg1_styling1', true);
      parallax.setLayerVisible('bg1_styling2', true);
      firstSpinShowAllLayers = false;
      return;
    }
    // Later spins randomize styling
    const show1 = Math.random() > 0.35;
    const show2 = Math.random() > 0.35;
    parallax.setLayerVisible('bg1_styling1', show1);
    parallax.setLayerVisible('bg1_styling2', show2);
  };

  const initPixi = async () => {
    if (!viewEl) return;
    app = new PIXI.Application({
      resizeTo: window,
      backgroundAlpha: 1,
      backgroundColor: 0x000000,
      antialias: true,
    });
    await app.init();
    viewEl.appendChild(app.canvas);

    const stage = app.stage;
    stage.sortableChildren = true;

    // Camera and parallax
    camera = new Camera({ viewportWidth: app.renderer.width, deadZonePercent: 0.3, lerpAlpha: 0.12 });
    const tex = await getBG1Textures();
    // Match existing background layout from shared context
    const layout = context.stateLayoutDerived.normalBackgroundLayout({ scale: 1 });
    const globalScaleX = 1;
    const globalScaleY = 1;
    parallax = new ParallaxManager({
      container: stage,
      layout: { x: layout.x, y: layout.y, width: (layout as any).width, height: (layout as any).height },
      textures: tex,
      overrides: BG_OVERRIDES as any,
      config: { bg1_sky: 0.05, bg1_background: 0.25, bg1_styling1: 0.45, bg1_styling2: 0.45, bg1_floor: 1.0 },
      globalScaleX,
      globalScaleY,
    });
    randomizeStylingVisibility();

    // Player surrogate: simple sprite as placeholder
    const playerTex = PIXI.Texture.WHITE; // replace with player anim later if desired
    const player = new PIXI.Sprite(playerTex);
    player.tint = 0xffee88;
    player.width = 20;
    player.height = 50;
    player.anchor.set(0.5, 1);
    stage.addChild(player);

    // Resize handling
    const onResize = () => {
      if (!app) return;
      const newLayout = context.stateLayoutDerived.normalBackgroundLayout({ scale: 1 });
      parallax?.setLayout({ x: newLayout.x, y: newLayout.y, width: (newLayout as any).width, height: (newLayout as any).height }, 1, 1);
      camera?.setViewportWidth(app.renderer.width);
    };
    window.addEventListener('resize', onResize);

    // Input: S toggles stumble; Enter starts a round
    window.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 's') {
        stumble = !stumble;
        if (stumble) onStumble();
      }
      if (e.key === 'Enter') {
        startRound();
      }
    });

    // Simple RGS placeholders
    rgs = createRgsClient();
    await rgs.authenticate();

    // Game loop
    let last = performance.now();
    app.ticker.add(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;

      // Accelerate and move player when in round and not stumbled
      if (inRound && !stumble) {
        playerSpeed = Math.min(playerMaxSpeed, playerSpeed + playerAcceleration * dt);
        const dx = playerSpeed * dt;
        playerXWorld += dx;
        // Broadcast movement for background parallax and other listeners
        context.eventEmitter.broadcast({ type: 'playerMoved', dx, playerX: playerXWorld, playerY: app!.renderer.height * 0.7 });
      }

      // Camera follow
      camera!.setTarget(playerXWorld);
      const camX = camera!.update(dt);

      // Parallax update using camera world position
      parallax!.update(camX);

      // Screen-space player x: clamp within dead-zone bounds, but allow continuous world run
      const leftDeadX = app!.renderer.width * 0.3;
      const rightDeadX = app!.renderer.width * (1 - 0.3);
      let desiredPlayerScreenX = leftDeadX + (playerXWorld - camX);
      // keep hero near middle-left dead-zone; camera scrolls the world
      if (desiredPlayerScreenX < leftDeadX) desiredPlayerScreenX = leftDeadX;
      if (desiredPlayerScreenX > rightDeadX) desiredPlayerScreenX = rightDeadX;
      player.x = desiredPlayerScreenX;
      player.y = app!.renderer.height * 0.7;

      // Win collect when player world passes right edge (use world and camera)
      if (inRound && !stumble && (playerXWorld - camX) > app!.renderer.width + 40) {
        const mult = currentBet > 0 ? lastPlayWin / currentBet : 0;
        onCollect(mult);
        rgs?.endRound();
        // Reset for next round
        inRound = false;
        playerXWorld = 0;
        playerSpeed = 120;
        context.eventEmitter.broadcast({ type: 'playerStopRunning' });
        randomizeStylingVisibility();
      }
    });
  };

  // Minimal RGS wrapper (placeholder wiring; replace with real implementation)
  function createRgsClient() {
    const url = new URL(window.location.href);
    const sessionID = url.searchParams.get('sessionID') ?? '';
    const rgs_url = url.searchParams.get('rgs_url') ?? '';
    const device = url.searchParams.get('device') ?? 'desktop';
    const lang = url.searchParams.get('lang') ?? 'en';

    const toMoney = (f: number) => Math.round(f * 1_000_000);

    return {
      async authenticate() {
        // TODO: call `${rgs_url}/wallet/authenticate` with sessionID
        return { ok: true, minBet: 100000, maxBet: 100000000, stepBet: 100000, betLevels: [] };
      },
      async play({ bet }: { bet: number }) {
        // TODO: call `${rgs_url}/play` with bet (int, 6dp)
        // Mock predetermined outcome
        const win = Math.random() < 0.5 ? toMoney(0) : toMoney(1.5);
        return { win };
      },
      async endRound() {
        // TODO: `${rgs_url}/wallet/end-round`
        return { ok: true };
      },
    };
  }

  async function startRound() {
    if (!rgs || inRound) return;
    // Reset state for a new run
    stumble = false;
    inRound = true;
    playerXWorld = 0;
    playerSpeed = 120;
    context.eventEmitter.broadcast({ type: 'playerStartRunning' });
    // First frame must show all layers; subsequent randomized handled after collect
    if (firstSpinShowAllLayers) {
      randomizeStylingVisibility();
    }
    // Request predetermined outcome
    const res = await rgs.play({ bet: currentBet });
    lastPlayWin = res.win;
    if (lastPlayWin === 0) {
      // Stumble: stop movement and emit hook
      stumble = true;
      onStumble();
      inRound = false;
      context.eventEmitter.broadcast({ type: 'playerStopRunning' });
      // Randomize for next attempt
      randomizeStylingVisibility();
    }
  }

  onMount(() => {
    initPixi();
  });
</script>

<div bind:this={viewEl} style="position: absolute; inset: 0;"></div>
