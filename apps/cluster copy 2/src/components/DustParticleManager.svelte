<script lang="ts">
	import { getContext } from '../game/context';
	import DustParticle from './DustParticle.svelte';

	const context = getContext();

	// Dust particle management - only for player in BG1
	let dustParticles = $state<Array<{
		id: number;
		x: number;
		y: number;
		direction: 'left' | 'right';
		type: 'player';
		zone: 'BG1';
	}>>([]);
	
	let nextParticleId = $state(1);
	let playerFootstepCounter = $state(0);
	
	// Footstep timing - spawn dust every 10 frames while walking
    const FOOTSTEP_INTERVAL = 10; // spawn a bit more frequently for a stronger trail
	
	// Always use BG1 for infinite parallax
	let currentZone = 'BG1' as const;
	
	// Subscribe to player movement events
	context.eventEmitter.subscribeOnMount({
		playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
			// Only spawn dust if player is moving and on ground
			if (e.dx !== 0) {
				playerFootstepCounter++;
				
				// Spawn dust particle every FOOTSTEP_INTERVAL frames
				if (playerFootstepCounter >= FOOTSTEP_INTERVAL) {
					// Trail: particles should drift opposite to camera/player movement more noticeably
                const direction = e.dx > 0 ? 'right' : 'left';
                const vx = direction === 'right' ? -7.5 : 7.5; // stronger backward drift
                const vy = -1.6; // initial upward burst
                // Fan out multiple particles for a richer kick
                for (let n = 0; n < 2; n++) {
                    const jitterX = vx + (Math.random() - 0.5) * 1.8;
                    const jitterY = vy + (Math.random() - 0.5) * 0.6;
                    spawnDustParticle(e.playerX, e.playerY, direction, 'player', currentZone, jitterX, jitterY);
                }
					playerFootstepCounter = 0;
				}
			} else {
				// Reset counter when player stops
				playerFootstepCounter = 0;
			}
		}
	});
	
	// Spawn a new dust particle
	const spawnDustParticle = (x: number, y: number, direction: 'left' | 'right', type: 'player', zone: 'BG1', vx?: number) => {
		// Calculate dust spawn position (slightly below feet)
		const footOffset = 100; // Player foot offset
		
		// X positioning - automatically invert based on direction
		const baseXOffset = -5; // Base offset (negative = left side)
		const xRandomness = 15; // Random spread range
		
		// Invert the X offset when direction changes
		const xOffset = direction === 'right' ? baseXOffset : -baseXOffset;
		const dustX = x + xOffset + (Math.random() * xRandomness * 2 - xRandomness);
		
		const dustY = y + footOffset;
		
		// Add new particle
		dustParticles = [...dustParticles, {
			id: nextParticleId,
			x: dustX,
			y: dustY,
			direction,
			type,
			zone
		}];
		
		nextParticleId++;
	};
	
	// Remove a dust particle when animation completes
	const removeDustParticle = (id: number) => {
		dustParticles = dustParticles.filter(p => p.id !== id);
	};
</script>

<!-- Render all active dust particles -->
{#each dustParticles as particle (particle.id)}
	<DustParticle
		x={particle.x}
		y={particle.y}
		direction={particle.direction}
		type={particle.type}
		zone={particle.zone}
		onComplete={() => removeDustParticle(particle.id)}
	/>
{/each}
