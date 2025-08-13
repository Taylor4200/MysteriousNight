<script lang="ts">
	import { getContext } from '../game/context';
	import DustParticle from './DustParticle.svelte';

	const context = getContext();

	// Dust particle management
	let dustParticles = $state<Array<{
		id: number;
		x: number;
		y: number;
		direction: 'left' | 'right';
		type: 'player' | 'enemy';
		zone: 'BG1' | 'BG2' | 'BG3' | 'BG4';
	}>>([]);
	
	let nextParticleId = $state(1);
	let playerFootstepCounter = $state(0);
	
	// Footstep timing - spawn dust every 10 frames while walking
	const FOOTSTEP_INTERVAL = 10;
	
	// Current zone tracking
	let currentZone = $state<'BG1' | 'BG2' | 'BG3' | 'BG4'>('BG1');
	
	// Subscribe to zone changes
	context.eventEmitter.subscribeOnMount({
		playerZoneChanged: (e: { zone: number }) => {
			// Update current zone based on zone index
			if (e.zone === 0) currentZone = 'BG1';
			else if (e.zone === 1) currentZone = 'BG2';
			else if (e.zone === 2) currentZone = 'BG3';
			else if (e.zone === 3) currentZone = 'BG4';
		}
	});
	
	// Subscribe to player movement events
	context.eventEmitter.subscribeOnMount({
		playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
			// Only spawn dust if player is moving and on ground
			if (e.dx !== 0) {
				playerFootstepCounter++;
				
				// Spawn dust particle every FOOTSTEP_INTERVAL frames
				if (playerFootstepCounter >= FOOTSTEP_INTERVAL) {
					spawnDustParticle(e.playerX, e.playerY, e.dx > 0 ? 'right' : 'left', 'player', currentZone);
					playerFootstepCounter = 0;
				}
			} else {
				// Reset counter when player stops
				playerFootstepCounter = 0;
			}
		}
	});
	

	
	// Spawn a new dust particle
	const spawnDustParticle = (x: number, y: number, direction: 'left' | 'right', type: 'player' | 'enemy', zone: 'BG1' | 'BG2' | 'BG3' | 'BG4') => {
		// Calculate dust spawn position (slightly below feet)
		const footOffset = type === 'player' ? 100 : 95; // Slightly different for enemies
		
		// X positioning - automatically invert based on direction
		const baseXOffset = -50; // Base offset (negative = left side)
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
