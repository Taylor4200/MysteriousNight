<script lang="ts">
	import BackgroundsManager from './BackgroundsManager.svelte';
	import { getContext } from '../game/context';

	const context = getContext();

	// Global controls
	let scale = 1; // uniform
	let scaleX = 1; // horizontal multiplier
	let scaleY = 1; // vertical multiplier
	let offsetX = 0; // global X shift
	let offsetY = 0; // global Y shift

	// Per-layer overrides. Tweak any layer here.
	type Ov = { offsetX?: number; offsetY?: number; scaleX?: number; scaleY?: number };
	let overrides: Record<string, Ov> = {
		// BG1
		bg1_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
		bg1_sky: { offsetX: 0, offsetY: -250, scaleX: 0.4, scaleY: 0.6 },
		bg1_styling1: { offsetX: 0, offsetY: 115, scaleX: 0.3, scaleY: 0.5 },
		bg1_styling2: { offsetX: 0, offsetY: 20, scaleX: 0.3, scaleY: 0.5 },
		bg1_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
		// BG2
		bg2_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
		bg2_flags: { offsetX: 0, offsetY: 0, scaleX: 0.3, scaleY: 0.5 },
		bg2_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
		// BG3
		bg3_background: { offsetX: 0, offsetY: -20, scaleX: 0.4, scaleY: 0.3 },
		bg3_pillar: { offsetX: 50, offsetY: -60, scaleX: 0.3, scaleY: 0.33 },
		bg3_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
		// BG4
		bg4_background: { offsetX: 0, offsetY: 0, scaleX: 0.4, scaleY: 0.3 },
		bg4_styling1: { offsetX: -20, offsetY: -400, scaleX: 0.32, scaleY: 0.5 },
		bg4_flags: { offsetX: 50, offsetY: -50, scaleX: 1, scaleY: 0.4 },
		bg4_floor: { offsetX: 0, offsetY: 265, scaleX: 1, scaleY: 0.3 },
	};

	// Scrolling effects for different background layers (px/sec)
	// Only BG1 sky (clouds) should move - other zones stay static
	let scrollX = { 
		bg1_sky: 5        // Only BG1 clouds drift right
	} as Record<string, number>;
	
	let currentZone = $state<'BG1' | 'BG2' | 'BG3' | 'BG4'>('BG1');
	
	// Continuous zone position (0.0 to 3.0 for smooth transitions)
	let continuousZonePosition = $state(0.0);
	
	// Zone transition effect
	let zoneTransition = $state(false);
	let previousZone = $state<'BG1' | 'BG2' | 'BG3' | 'BG4'>('BG1');
	
	// Debug log zone changes
	$effect(() => {
		console.log('Zone changed to:', currentZone);
	});
	
	// Zone transition effect
	$effect(() => {
		if (currentZone !== previousZone) {
			zoneTransition = true;
			setTimeout(() => {
				zoneTransition = false;
			}, 300);
			previousZone = currentZone;
		}
	});
	


    // Listen to playerMoved using the shared emitter API
    context.eventEmitter.subscribeOnMount({
        playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
            const width = context.stateLayoutDerived.mainLayout().width;
            
            // Use the actual player position from the Characters component
            const currentPlayerX = e.playerX;
            
            // Check if player is at the absolute edge to trigger zone transition
            if (e.dx > 0 && currentPlayerX >= width * 0.9) { // 90% of screen width - almost at the very edge
                // Player reached right edge, transition to next zone
                const nextZoneIndex = Math.min(3, Math.floor(continuousZonePosition) + 1);
                if (nextZoneIndex !== Math.floor(continuousZonePosition)) {
                    // Trigger zone transition
                    zoneTransition = true;
                    setTimeout(() => {
                        // Change to next zone
                        continuousZonePosition = nextZoneIndex;
                        currentZone = (['BG1','BG2','BG3','BG4'] as const)[nextZoneIndex];
                        
                        // Reset player position to left side of new zone
                        context.eventEmitter.broadcast({ 
                            type: 'playerZoneChanged', 
                            zone: nextZoneIndex,
                            resetPosition: true 
                        });
                        
                        // End transition effect
                        setTimeout(() => {
                            zoneTransition = false;
                        }, 300);
                    }, 150);
                }
            } else if (e.dx < 0 && currentPlayerX <= width * 0.1) { // 10% of screen width - almost at the very edge
                // Player reached left edge, transition to previous zone
                const prevZoneIndex = Math.max(0, Math.floor(continuousZonePosition) - 1);
                if (prevZoneIndex !== Math.floor(continuousZonePosition)) {
                    // Trigger zone transition
                    zoneTransition = true;
                    setTimeout(() => {
                        // Change to previous zone
                        continuousZonePosition = prevZoneIndex;
                        currentZone = (['BG1','BG2','BG3','BG4'] as const)[prevZoneIndex];
                        
                        // Reset player position to right side of new zone
                        context.eventEmitter.broadcast({ 
                            type: 'playerZoneChanged', 
                            zone: prevZoneIndex,
                            resetPosition: true 
                        });
                        
                        // End transition effect
                        setTimeout(() => {
                            zoneTransition = false;
                        }, 300);
                    }, 150);
                }
            }
        },
    });
	

</script>



<!-- Zone transition overlay -->
{#if zoneTransition}
	<div style="
		position: absolute; 
		top: 0; 
		left: 0; 
		right: 0; 
		bottom: 0; 
		background: rgba(0,0,0,0.8); 
		z-index: 999; 
		pointer-events: none;
		animation: fadeInOut 0.6s ease-in-out;
	"></div>
{/if}

<style>
	@keyframes fadeInOut {
		0% { opacity: 0; }
		50% { opacity: 1; }
		100% { opacity: 0; }
	}
</style>

<BackgroundsManager zone={currentZone} {scale} {scaleX} {scaleY} {offsetX} {offsetY} {overrides} scrollX={scrollX} continuousZonePosition={continuousZonePosition} />
