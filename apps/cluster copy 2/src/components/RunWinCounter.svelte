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
  let lostState = $state(false);

  // Hook into movement/run events
  context.eventEmitter.subscribeOnMount({
    playerStartRunning: () => {
      isRunning = true;
      lastDx = 0;
      // reset loss tint when a new run starts
      lostState = false;
    },
    playerStopRunning: () => {
      isRunning = false;
      lastDx = 0;
    },
    playerStumbled: () => {
      lostState = true;
    },
    playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
      playerX = e.playerX;
      playerY = e.playerY;
      totalDistance += Math.abs(e.dx);
      lastDx = e.dx;
    },
  });

  // Integrate win visually based on speed and distance
  $effect(() => {
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000; // seconds
      last = now;

      if (!isRunning) return;

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
	const headOffsetX = -30;

  // Fonts are preloaded by the app loader (type: 'font'), so the bitmap font is available here
  const fontLoaded = true;

  // Avoid TS complaining about BitmapText style typing (uses BitmapFont style)
  const bitmapStyle: any = $derived({ fontFamily: 'Gladiators', fontSize: 44, fill: lostState ? 0xFF4D4D : 0xFFD54D, align: 'center' });
</script>

{#if fontLoaded}
  <Container x={playerX} y={playerY + headOffsetY}>
    <BitmapText text={textValue} style={bitmapStyle} anchor={{ x: 1.8, y: 0.5 }} />
  </Container>
{/if}


