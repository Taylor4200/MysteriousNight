<script lang="ts" module>
	export type EmitterEventBoardFrame =
		| { type: 'boardFrameGlowShow' }
		| { type: 'boardFrameGlowHide' };
</script>

<script lang="ts">
	import { Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';

	import { getContext } from '../game/context';

	const context = getContext();
	const SPINE_SCALE = { width: 0.62, height: 0.66 };
	const SPRITE_SCALE = { width: 1.1, height: 0.83 }; // Less wide, taller
	const POSITION_ADJUSTMENT_X = 1.01; // Horizontal position (unchanged)
	const POSITION_ADJUSTMENT_Y = 0.94; // Vertical position (moved up)2

 // Reelhouse glow removed
</script>

<!-- Reelhouse glow removed -->

<Sprite
	key="mainFrame"
	anchor={0.5}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT_X}
	y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT_Y}
	width={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.width}
	height={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.height}
/>
