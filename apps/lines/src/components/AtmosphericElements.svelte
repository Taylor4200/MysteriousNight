<script lang="ts">
	import { Sprite } from 'pixi-svelte';
	import { getContext } from '../game/context';

	const context = getContext();
	
	// Size multipliers for easy adjustment
	const FOG_SCALE_X = 3;          // Fog width scale
	const FOG_SCALE_Y = 1.21;          // Fog height scale
	const SPIKES_SCALE = 1.3;         // Make spikes 20% smaller
	const FRAME_BACK_SCALE_X = .91;   // Frame back width scale (on top of main frame scale)
	const FRAME_BACK_SCALE_Y = .8;    // Frame back height scale (on top of main frame scale)
	const LOGO_SCALE = 1.5;             // Make logo smaller for header
	
	// Position adjustments for each element (offset from base position)
	const FOG_OFFSET_X = 0;           // Fog X position offset
	const FOG_OFFSET_Y = 180;           // Fog Y position offset
	const SPIKES_OFFSET_X = 5;        // Spikes X position offset  
	const SPIKES_OFFSET_Y = 250;      // Spikes Y position offset
	
	// Responsive logo positioning
	const logoPosition = $derived(() => {
		const layoutType = context.stateLayoutDerived.layoutType();
		
		if (layoutType === 'portrait') {
			// Portrait mobile positioning - custom position
			return {
				x: context.stateGameDerived.boardLayout().x + -5,  // Adjustable X offset
				y: 310,  // Adjustable Y position from top
			};
		} else {
			// Desktop/landscape positioning - keep original
			return {
				x: context.stateGameDerived.boardLayout().x + 0,  // Original LOGO_OFFSET_X was 0
				y: 130,  // Original LOGO_OFFSET_Y
			};
		}
	});
	
	// Match the exact positioning from BoardFrame.svelte
	const POSITION_ADJUSTMENT_X = 1.01; // Same as main frame
	const POSITION_ADJUSTMENT_Y = 1; // Same as main frame  
	const SPRITE_SCALE = { width: 1.1, height: 0.83 }; // Same as main frame
</script>

<!-- Atmospheric elements for the base game -->

<!-- Logo - positioned at top center with adjustable offset -->
<Sprite
	key="logo"
	anchor={0.45}
	zIndex={100}
	x={logoPosition().x}
	y={logoPosition().y}
	width={200 * LOGO_SCALE}
	height={100 * LOGO_SCALE}
	alpha={1}
/>

<!-- Fog - atmospheric background element with adjustable position -->
<Sprite
	key="fog"
	anchor={0.5}
	zIndex={-10}
	x={context.stateGameDerived.boardLayout().x + FOG_OFFSET_X}
	y={context.stateGameDerived.boardLayout().y + FOG_OFFSET_Y}
	width={context.stateGameDerived.boardLayout().width * FOG_SCALE_X}
	height={context.stateGameDerived.boardLayout().height * FOG_SCALE_Y}
	alpha={1}
/>

<!-- Spikes removed -->

<!-- Frame back - perfectly aligned behind main frame, scales with it automatically -->
<Sprite
	key="frameBack"
	anchor={0.5}
	zIndex={-2}
	x={context.stateGameDerived.boardLayout().x * POSITION_ADJUSTMENT_X}
	y={context.stateGameDerived.boardLayout().y * POSITION_ADJUSTMENT_Y}
	width={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.width * FRAME_BACK_SCALE_X}
	height={context.stateGameDerived.boardLayout().width * SPRITE_SCALE.height * FRAME_BACK_SCALE_Y}
	alpha={1}
/> 