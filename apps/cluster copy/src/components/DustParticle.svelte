<script lang="ts">
	import { getContext } from '../game/context';
	import { AnimatedSprite } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	const context = getContext();

	// Props for particle behavior
	const props = $props<{
		x: number;
		y: number;
		direction: 'left' | 'right';
		type: 'player' | 'enemy';
		zone: 'BG1' | 'BG2' | 'BG3' | 'BG4';
		onComplete: () => void;
	}>();

	const x = props.x;
	const y = props.y;
	const direction = props.direction;
	const type = props.type;
	const zone = props.zone;
	const onComplete = props.onComplete;

	// Dust particle state
	let currentFrame = $state(0);
	let scale = $state(1.0);
	let alpha = $state(1.0);
	let posX = $state(x);
	let posY = $state(y);
	
	// Velocity (opposite to movement direction for realistic effect)
	const vx = direction === 'right' ? -0.3 : 0.3;
	const vy = -0.1;
	
	// Zone-specific particle colors and effects
	const getParticleStyle = () => {
		switch (zone) {
			case 'BG1': // Base zone - normal dust (original color)
				return { tint: 0xFFFFFF, scale: 1.0 };
			case 'BG2': // Bonus zone - normal dust (original color)
				return { tint: 0xFFFFFF, scale: 1.0 };
			case 'BG3': // Ultra Bonus zone - green dust
				return { tint: 0xB0BC12, scale: 1.0 };
			case 'BG4': // Super Bonus zone - normal dust (original color)
				return { tint: 0xFFFFFF, scale: 1.0 };
			default:
				return { tint: 0xFFFFFF, scale: 1.0 };
		}
	};
	
	const particleStyle = $derived(getParticleStyle());
	
	// Dust particle textures
	const dustTextures = $derived([
		'dust_particle_0', 'dust_particle_1', 'dust_particle_2', 'dust_particle_3', 'dust_particle_4',
	].map((k) => (context.stateApp.loadedAssets as any)[k]).filter(Boolean));

	// Animation loop - 5 frames at ~100ms each
	$effect(() => {
		if (dustTextures.length === 0) return;
		
		const interval = setInterval(() => {
			currentFrame++;
			
			// Update particle properties
			scale = Math.max(0.5, 1.0 - (currentFrame * 0.1)); // Shrink from 1.0 to 0.5
			alpha = Math.max(0.0, 1.0 - (currentFrame * 0.2)); // Fade from 1.0 to 0.0
			
			// Update position
			posX += vx;
			posY += vy;
			
			// Check if animation is complete
			if (currentFrame >= 4) {
				clearInterval(interval);
				onComplete();
			}
		}, 100); // 100ms per frame
		
		return () => clearInterval(interval);
	});
</script>

{#if dustTextures.length > 0}
	<MainContainer>
		<AnimatedSprite
			textures={dustTextures}
			animationSpeed={0.1}
			loop={false}
			play={true}
			anchor={{ x: 0.5, y: 0.5 }}
			x={posX}
			y={posY}
			scale={{ x: scale * particleStyle.scale, y: scale * particleStyle.scale }}
			alpha={alpha}
			tint={particleStyle.tint}
		/>
	</MainContainer>
{/if}
