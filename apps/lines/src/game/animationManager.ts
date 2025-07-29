import { Texture, Assets, Spritesheet } from 'pixi.js';

/**
 * Animation configurations for different symbol types
 */
export const ANIMATION_CONFIGS = {
	// Wild symbol animation
	wild_hit: {
		type: 'spritesheet' as const,
		src: '/assets/animations/wolf_icon/wolf_icon.png',
		jsonSrc: '/assets/animations/wolf_icon/wolf_icon.json',
		animationSpeed: 0.3,
		loop: false
	},
	// High-value symbol animations
	queen_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/queen/queen.png',
		jsonSrc: '/assets/animations/queen/queen.json',
		animationSpeed: 0.3,
		loop: false
	},
	king_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/king/king.png',
		jsonSrc: '/assets/animations/king/king.json',
		animationSpeed: 0.3,
		loop: false
	},
	// Card symbol animations
	A_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/A/A.png',
		jsonSrc: '/assets/animations/A/A.json',
		animationSpeed: 0.3,
		loop: false
	},
	J_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/J/J.png',
		jsonSrc: '/assets/animations/J/J.json',
		animationSpeed: 0.3,
		loop: false
	},
	K_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/K/K.png',
		jsonSrc: '/assets/animations/K/K.json',
		animationSpeed: 0.3,
		loop: false
	},
	Q_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/Q/q.png', // Fixed: lowercase filename
		jsonSrc: '/assets/animations/Q/q.json', // Fixed: lowercase filename
		animationSpeed: 0.3,
		loop: false
	},
	// Special effect animations
	bonus_tease: {
		type: 'spritesheet' as const,
		src: '/assets/animations/bats/Bats.png', // Use bats animation for bonus tease
		jsonSrc: '/assets/animations/bats/Bats.json',
		animationSpeed: 0.2,
		loop: true
	},
	big_win: {
		type: 'spritesheet' as const,
		src: '/assets/animations/flies/flies.png', // Use flies animation for big win
		jsonSrc: '/assets/animations/flies/flies.json',
		animationSpeed: 0.4,
		loop: false
	},
	// Ambient animations
	ambient_bats: {
		type: 'spritesheet' as const,
		src: '/assets/animations/bats/Bats.png',
		jsonSrc: '/assets/animations/bats/Bats.json',
		animationSpeed: 0.2,
		loop: true
	}
} as const;

/**
 * Cache for loaded animation textures to avoid reloading
 */
const animationCache = new Map<string, Texture[]>();

/**
 * Loads spritesheet animation textures
 */
async function loadSpritesheetAnimation(config: typeof ANIMATION_CONFIGS[keyof typeof ANIMATION_CONFIGS]) {
	if (config.type !== 'spritesheet') {
		throw new Error('Invalid config type for spritesheet loading');
	}

	console.log(`[AnimationManager] Loading spritesheet: ${config.src}`);
	
	try {
		// Load spritesheet using the JSON file - this should load both texture and data
		const spritesheet = await Assets.load(config.jsonSrc);
		
		// Check if this is already a parsed spritesheet
		if (spritesheet.animations) {
			const animationNames = Object.keys(spritesheet.animations);
			
			if (animationNames.length === 0) {
				throw new Error(`No animations found in spritesheet: ${config.src}`);
			}
			
			const textures = spritesheet.animations[animationNames[0]];
			console.log(`[AnimationManager] Loaded ${textures.length} frames from spritesheet: ${config.src}`);
			return textures;
		}
		
		// If not parsed, we need to parse it manually
		await spritesheet.parse();
		
		const animationNames = Object.keys(spritesheet.animations);
		
		if (animationNames.length === 0) {
			throw new Error(`No animations found in spritesheet: ${config.src}`);
		}
		
		const textures = spritesheet.animations[animationNames[0]];
		console.log(`[AnimationManager] Loaded ${textures.length} frames from spritesheet: ${config.src}`);
		
		return textures;
	} catch (error) {
		console.error(`[AnimationManager] Failed to load spritesheet ${config.src}:`, error);
		
		// Fallback to the original method if the simplified approach fails
		try {
			const spritesheetData = await Assets.load(config.jsonSrc);
			const texture = await Assets.load(config.src);
			
			if (!texture || !spritesheetData) {
				throw new Error(`Failed to load texture or data from ${config.src}`);
			}
			
			const spritesheet = new Spritesheet(texture, spritesheetData);
			await spritesheet.parse();
			
			const animationNames = Object.keys(spritesheet.animations);
			
			if (animationNames.length === 0) {
				throw new Error(`No animations found in spritesheet: ${config.src}`);
			}
			
			const textures = spritesheet.animations[animationNames[0]];
			console.log(`[AnimationManager] Loaded ${textures.length} frames from spritesheet: ${config.src}`);
			
			return textures;
		} catch (fallbackError) {
			console.error(`[AnimationManager] Fallback method also failed:`, fallbackError);
			throw fallbackError;
		}
	}
}

/**
 * Loads and caches animation textures for a given animation type
 * @param animationType - Key from ANIMATION_CONFIGS
 * @returns Promise that resolves to array of textures
 */
export async function getAnimationTextures(animationType: keyof typeof ANIMATION_CONFIGS): Promise<Texture[]> {
	if (animationCache.has(animationType)) {
		return animationCache.get(animationType)!;
	}
	
	const config = ANIMATION_CONFIGS[animationType];
	const textures = await loadSpritesheetAnimation(config);
	
	animationCache.set(animationType, textures);
	return textures;
}

/**
 * Creates PIXI.AnimatedSprite configuration for a given animation type
 * @param animationType - Key from ANIMATION_CONFIGS
 * @returns Promise that resolves to object with textures and animation configuration
 */
export async function createAnimationConfig(animationType: keyof typeof ANIMATION_CONFIGS) {
	const textures = await getAnimationTextures(animationType);
	const config = ANIMATION_CONFIGS[animationType];
	
	return {
		textures,
		animationSpeed: config.animationSpeed,
		loop: config.loop
	};
} 