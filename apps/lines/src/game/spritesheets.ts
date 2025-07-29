import { Assets, Spritesheet } from 'pixi.js';

export interface SpritesheetAnimationConfig {
	src: string;
	frameWidth: number;
	frameHeight: number;
	frames: number;
	animationSpeed: number;
	loop: boolean;
}

export const SPRITESHEET_ANIMATIONS = {
	ambient_bats: {
		src: '/assets/spritesheets/bats_spritesheet.png',
		frameWidth: 468,
		frameHeight: 534,
		frames: 30,
		animationSpeed: 0.15,
		loop: true
	}
} as const;

/**
 * Creates a PIXI spritesheet configuration for an animation
 */
export function createSpritesheetData(config: SpritesheetAnimationConfig) {
	const frames: Record<string, any> = {};
	const animations: Record<string, string[]> = {};
	
	const cols = Math.ceil(Math.sqrt(config.frames)); // Square-ish layout
	const animationFrames: string[] = [];
	
	for (let i = 0; i < config.frames; i++) {
		const frameNumber = i.toString().padStart(2, '0');
		const frameName = `frame_${frameNumber}`;
		const col = i % cols;
		const row = Math.floor(i / cols);
		
		frames[frameName] = {
			frame: {
				x: col * config.frameWidth,
				y: row * config.frameHeight,
				w: config.frameWidth,
				h: config.frameHeight
			},
			sourceSize: {
				w: config.frameWidth,
				h: config.frameHeight
			},
			spriteSourceSize: {
				x: 0,
				y: 0,
				w: config.frameWidth,
				h: config.frameHeight
			}
		};
		
		animationFrames.push(frameName);
	}
	
	animations.animation = animationFrames;
	
	return {
		frames,
		animations,
		meta: {
			format: 'RGBA8888',
			size: {
				w: cols * config.frameWidth,
				h: Math.ceil(config.frames / cols) * config.frameHeight
			},
			scale: 1
		}
	};
}

/**
 * Loads a spritesheet animation
 */
export async function loadSpritesheetAnimation(animationType: keyof typeof SPRITESHEET_ANIMATIONS) {
	const config = SPRITESHEET_ANIMATIONS[animationType];
	const spritesheetData = createSpritesheetData(config);
	
	// Load the texture
	const texture = await Assets.load(config.src);
	
	// Create spritesheet
	const spritesheet = new Spritesheet(texture, spritesheetData);
	await spritesheet.parse();
	
	// Get animation textures
	const textures = spritesheet.animations.animation;
	
	return {
		textures,
		animationSpeed: config.animationSpeed,
		loop: config.loop
	};
} 