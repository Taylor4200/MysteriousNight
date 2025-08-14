<script lang="ts">
  import { AnimatedSprite as AnimatedSpriteBase, Container } from 'pixi-svelte';
  import { getContext } from '../game/context';

  const context = getContext();

  const { x = 0, y = 0, scale = 1 } = $props<{ x?: number; y?: number; scale?: number }>();

  // Meat visuals removed
  const keys: string[] = [];
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

<!-- Meat visuals removed: this component renders nothing -->


