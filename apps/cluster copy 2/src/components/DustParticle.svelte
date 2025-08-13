<script lang="ts">
	import { getContext } from '../game/context';
	import { AnimatedSprite } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';

	const context = getContext();

	// Props for particle behavior - only player in BG1
	const props = $props<{
		x: number;
		y: number;
		direction: 'left' | 'right';
		type: 'player';
		zone: 'BG1';
		vx?: number; // initial horizontal velocity override (px per frame)
		vy?: number; // initial vertical velocity override (px per frame)
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
	
	// Velocity: allow override; otherwise infer from direction
	let velX = props.vx ?? (direction === 'right' ? -4.2 : 4.2);
	let velY = props.vy ?? -1.2; // initial burst upward
	const gravity = 0.14; // downward pull
	const friction = 0.94; // slow down horizontally
	
	// BG1 particle style - normal dust
	const particleStyle = { tint: 0xFFFFFF, scale: 1.0 };
	
	// Dust particle textures
	const dustTextures = $derived([
		'dust_particle_0', 'dust_particle_1', 'dust_particle_2', 'dust_particle_3', 'dust_particle_4',
	].map((k) => (context.stateApp.loadedAssets as any)[k]).filter(Boolean));

	// Animation loop - 10 frames at ~70ms each for a longer, smoother trail
	$effect(() => {
		if (dustTextures.length === 0) return;
		
		const interval = setInterval(() => {
			currentFrame++;
			
			// Update particle properties
			scale = Math.max(0.4, 1.0 - (currentFrame * 0.06));
			alpha = Math.max(0.0, 1.0 - (currentFrame * 0.12));
			
			// Update position (simple ballistic)
			posX += velX;
			posY += velY;
			velX *= friction;
			velY += gravity;
			
			// Check if animation is complete
			if (currentFrame >= 9) {
				clearInterval(interval);
				onComplete();
			}
		}, 70);
		
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
