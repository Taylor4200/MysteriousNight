<script lang="ts">
  import { AnimatedSprite as AnimatedSpriteBase, Container } from 'pixi-svelte';
  import { getContext } from '../game/context';

  const context = getContext();

  const { x = 0, y = 0, scale = 1 } = $props<{ x?: number; y?: number; scale?: number }>();

  // Use a simple forward loop to avoid timing issues
  const keys = ['meat_1','meat_2','meat_3','meat_4','meat_5','meat_6','meat_7'];
  // Build textures similar to player walk frames
  const textures = $derived(
    keys
      .map((k) => (context.stateApp.loadedAssets as any)?.[k])
      .filter(Boolean)
  );

  const firstTexture = $derived(() => {
    const la = context.stateApp.loadedAssets as any;
    if (!la) return null;
    for (const k of keys) {
      if (la[k]) return la[k];
    }
    return null;
  });

  const AnimatedSprite: any = AnimatedSpriteBase;
</script>

{#if textures.length >= 2}
  <!-- Move via parent container so AnimatedSprite props don't change each frame -->
  <Container x={x} y={y} scale={{ x: scale, y: scale }}>
    <AnimatedSprite
      textures={textures}
      animationSpeed={0.22}
      loop
      play
      anchor={0.5}
    />
  </Container>
{:else if firstTexture}
  <Container x={x} y={y} scale={{ x: scale, y: scale }}>
    <AnimatedSprite
      textures={[firstTexture]}
      animationSpeed={0}
      loop={false}
      play={false}
      anchor={0.5}
    />
  </Container>
{/if}


