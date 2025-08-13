<script lang="ts">
  import { MainContainer } from 'components-layout';
  import MeatCollectible from './MeatCollectible.svelte';
  import { getContext } from '../game/context';
  import { onMount } from 'svelte';

  const context = getContext();

  type MeatItem = { id: number; worldX: number; collected: boolean };

  // Start empty; we'll spawn ahead of camera so it's visible immediately
  let items = $state<MeatItem[]>([]);
  let nextId = $state(1);

  let cameraWorldX = $state(0);
  let playerWorldX = $state(0);
  let lastSpawnWorldX = $state(-Infinity);

  // Spawn controls
  const MIN_GAP = 1200; // require at least this much progress between spawns
  const SPAWN_CHANCE = 0.35; // 35% chance when eligible

  const centerX = $derived(context.stateLayoutDerived.mainLayout().width * 0.5);
  const groundY = $derived(context.stateLayoutDerived.mainLayout().height * 0.68);
  const screenW = $derived(context.stateLayoutDerived.mainLayout().width);

  // Listen to camera/player movement
  context.eventEmitter.subscribeOnMount({
    cameraMoved: (e: { worldX: number }) => {
      cameraWorldX = e.worldX;
      // no-op; only spawn on player move/start to avoid over-spawn
    },
    playerMoved: (e: { dx: number }) => {
      playerWorldX += e.dx;
      checkCollect();
      ensureAheadSpawn();
    },
    playerStartRunning: () => ensureAheadSpawn(true),
  });

  onMount(() => {
    // Drop one visibly in the very first frame
    const initialX = cameraWorldX + 200; // just ahead of the centered player
    items = [...items, { id: nextId++, worldX: initialX, collected: false }];
    // Also seed additional ahead spawns
    ensureAheadSpawn(true);
  });

  function checkCollect() {
    // Simple 1D collision on worldX
    items = items.map((m) => {
      if (m.collected) return m;
      if (Math.abs(playerWorldX - m.worldX) < 45) {
        // mark collected and broadcast visual effect
        context.eventEmitter.broadcast({ type: 'meatCollectedVisual' } as any);
        return { ...m, collected: true };
      }
      return m;
    });
  }

  function ensureAheadSpawn(force = false) {
    const ahead = items.filter((m) => !m.collected && m.worldX > cameraWorldX);
    if (force) {
      // Seed just one on start, a bit ahead
      if (ahead.length === 0) {
        const worldX = playerWorldX + 300; // fixed in world space ahead of player
        items = [...items, { id: nextId++, worldX, collected: false }];
        lastSpawnWorldX = playerWorldX;
      }
      return;
    }

    // Do not always keep one ahead; require progress and chance
    if (ahead.length > 0) return;
    if (playerWorldX - lastSpawnWorldX < MIN_GAP) return;
    if (Math.random() > SPAWN_CHANCE) return;

    const gap = 600 + Math.random() * 800; // 600..1400 ahead of player
    const worldX = playerWorldX + gap;
    items = [...items, { id: nextId++, worldX, collected: false }];
    lastSpawnWorldX = playerWorldX;
  }

  const visibleItems = $derived(
    items.filter((m) => !m.collected).map((m) => {
      const screenX = centerX + (m.worldX - cameraWorldX);
      const onScreen = screenX > -120 && screenX < screenW + 120;
      return { ...m, screenX, onScreen };
    })
  );
</script>

<MainContainer>
  {#each visibleItems as m (m.id)}
    {#if m.onScreen}
      <MeatCollectible x={m.screenX} y={groundY} scale={0.7} />
    {/if}
  {/each}
</MainContainer>


