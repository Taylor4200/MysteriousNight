<script lang="ts">
    import { AnimatedSprite as AnimatedSpriteBase, Sprite, SpineProvider, SpineTrack } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';
	import { getContext } from '../game/context';
	import type { LoadedSprite } from 'pixi-svelte';

	const context = getContext();

	const playerIdleKeys = [
		'player_idle_0',
		'player_idle_1',
		'player_idle_2',
		'player_idle_3',
		'player_idle_4',
		'player_idle_5',
		'player_idle_6',
		'player_idle_7',
		'player_idle_8',
		'player_idle_9',
	];

	// Now using individual PNGs for walk
	const playerWalkKeys = [
		'player_walk_0', 'player_walk_1', 'player_walk_2', 'player_walk_3', 'player_walk_4',
		'player_walk_5', 'player_walk_6', 'player_walk_7', 'player_walk_8', 'player_walk_9',
		'player_walk_10', 'player_walk_11', 'player_walk_12', 'player_walk_13', 'player_walk_14',
		'player_walk_15', 'player_walk_16', 'player_walk_17'
	];

	// Player combat animations
	const playerHitKeys = [
		'player_hit_0', 'player_hit_1', 'player_hit_2', 'player_hit_3', 'player_hit_4',
		'player_hit_5', 'player_hit_6', 'player_hit_7', 'player_hit_8', 'player_hit_9',
		'player_hit_10', 'player_hit_11', 'player_hit_12', 'player_hit_13', 'player_hit_14',
		'player_hit_15', 'player_hit_16', 'player_hit_17', 'player_hit_18', 'player_hit_19',
		'player_hit_20', 'player_hit_21'
	];

	const playerDefenseKeys = [
		'player_defense_0', 'player_defense_1', 'player_defense_2', 'player_defense_3', 'player_defense_4',
		'player_defense_5', 'player_defense_6', 'player_defense_7', 'player_defense_8', 'player_defense_9'
	];

	const enemy1Keys = [
		'enemy1_idle_0',
		'enemy1_idle_1',
		'enemy1_idle_2',
		'enemy1_idle_3',
		'enemy1_idle_4',
		'enemy1_idle_5',
		'enemy1_idle_6',
		'enemy1_idle_7',
		'enemy1_idle_8',
		'enemy1_idle_9',
	];

	const enemy2Keys = [
		'enemy2_idle_0',
		'enemy2_idle_1',
		'enemy2_idle_2',
		'enemy2_idle_3',
		'enemy2_idle_4',
		'enemy2_idle_5',
		'enemy2_idle_6',
		'enemy2_idle_7',
		'enemy2_idle_8',
		'enemy2_idle_9',
	];

	const enemy3Keys = [
		'enemy3_idle_0',
		'enemy3_idle_1',
		'enemy3_idle_2',
		'enemy3_idle_3',
		'enemy3_idle_4',
		'enemy3_idle_5',
		'enemy3_idle_6',
		'enemy3_idle_7',
		'enemy3_idle_8',
		'enemy3_idle_9',
	];

	// Get textures from loaded assets
	const playerIdleTextures = $derived(
		playerIdleKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	// Get walk textures from individual PNGs
	const playerWalkTextures = $derived(
		playerWalkKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	const playerHitTextures = $derived(
		playerHitKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	const playerDefenseTextures = $derived(
		playerDefenseKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	const enemy1Textures = $derived(
		enemy1Keys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	const enemy2Textures = $derived(
		enemy2Keys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	const enemy3Textures = $derived(
		enemy3Keys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	// Enemy1 combat animations
	const enemy1HitKeys = [
		'enemy1_hit_0', 'enemy1_hit_1', 'enemy1_hit_2', 'enemy1_hit_3', 'enemy1_hit_4',
		'enemy1_hit_5', 'enemy1_hit_6', 'enemy1_hit_7', 'enemy1_hit_8', 'enemy1_hit_9',
		'enemy1_hit_10', 'enemy1_hit_11', 'enemy1_hit_12', 'enemy1_hit_13', 'enemy1_hit_14',
		'enemy1_hit_15', 'enemy1_hit_16', 'enemy1_hit_17', 'enemy1_hit_18', 'enemy1_hit_19',
		'enemy1_hit_20', 'enemy1_hit_21'
	];
	
	// Player death animations
	const playerDeathKeys = [
		'player_death_0', 'player_death_1', 'player_death_2', 'player_death_3', 'player_death_4',
		'player_death_5', 'player_death_6', 'player_death_7', 'player_death_8', 'player_death_9',
		'player_death_10', 'player_death_11', 'player_death_12', 'player_death_13', 'player_death_14',
		'player_death_15', 'player_death_16', 'player_death_17', 'player_death_18', 'player_death_19',
		'player_death_20', 'player_death_21', 'player_death_22', 'player_death_23', 'player_death_24',
		'player_death_25', 'player_death_26', 'player_death_27', 'player_death_28', 'player_death_29',
		'player_death_30', 'player_death_31', 'player_death_32', 'player_death_33', 'player_death_34'
	];
	
	// Player get hit animations
	const playerGetHitKeys = [
		'player_gethit_0', 'player_gethit_1', 'player_gethit_2', 'player_gethit_3', 'player_gethit_4',
		'player_gethit_5', 'player_gethit_6', 'player_gethit_7', 'player_gethit_8', 'player_gethit_9',
		'player_gethit_10', 'player_gethit_11', 'player_gethit_12', 'player_gethit_13'
	];
	
	// Enemy1 death animations
	const enemy1DeathKeys = [
		'enemy1_death_0', 'enemy1_death_1', 'enemy1_death_2', 'enemy1_death_3', 'enemy1_death_4',
		'enemy1_death_5', 'enemy1_death_6', 'enemy1_death_7', 'enemy1_death_8', 'enemy1_death_9',
		'enemy1_death_10', 'enemy1_death_11', 'enemy1_death_12', 'enemy1_death_13', 'enemy1_death_14',
		'enemy1_death_15', 'enemy1_death_16', 'enemy1_death_17', 'enemy1_death_18', 'enemy1_death_19',
		'enemy1_death_20', 'enemy1_death_21', 'enemy1_death_22', 'enemy1_death_23', 'enemy1_death_24',
		'enemy1_death_25', 'enemy1_death_26', 'enemy1_death_27', 'enemy1_death_28', 'enemy1_death_29',
		'enemy1_death_30'
	];
	
	// Enemy1 get hit animations
	const enemy1GetHitKeys = [
		'enemy1_gethit_0', 'enemy1_gethit_1', 'enemy1_gethit_2', 'enemy1_gethit_3', 'enemy1_gethit_4',
		'enemy1_gethit_5', 'enemy1_gethit_6', 'enemy1_gethit_7', 'enemy1_gethit_8', 'enemy1_gethit_9',
		'enemy1_gethit_10', 'enemy1_gethit_11', 'enemy1_gethit_12', 'enemy1_gethit_13'
	];

	const enemy1HitTextures = $derived(
		enemy1HitKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);
	
	// Player death textures
	const playerDeathTextures = $derived(
		playerDeathKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);
	
	// Player get hit textures
	const playerGetHitTextures = $derived(
		playerGetHitKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);
	
	// Enemy1 death textures
	const enemy1DeathTextures = $derived(
		enemy1DeathKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);
	
	// Enemy1 get hit textures
	const enemy1GetHitTextures = $derived(
		enemy1GetHitKeys
			.map((k) => (context.stateApp.loadedAssets as any)[k])
			.filter(Boolean)
	);

	// Active enemy selection
	let activeEnemy: 'enemy1' | 'enemy2' | 'enemy3' = 'enemy1';

	// Active enemy textures
	const getActiveTextures = () => (activeEnemy === 'enemy1' ? enemy1Textures : activeEnemy === 'enemy2' ? enemy2Textures : enemy3Textures);

	// Player movement state and position
	let isPlayerMoving = $state(false);
	let playerDirection = $state<'left' | 'right'>('right');
	let playerX = $state(context.stateLayoutDerived.mainLayout().width * 0.2);
	let playerY = $state(context.stateLayoutDerived.mainLayout().height * 0.67);
	let currentFrame = $state(0);
	
	// Attack states and frame tracking
	let isPlayerAttacking = $state(false);
	let isEnemyAttacking = $state(false);
	let playerAttackFrame = $state(0);
	let enemyAttackFrame = $state(0);
	
	// Defense states and frame tracking
	let isPlayerDefending = $state(false);
	let isEnemyDefending = $state(false);
	let playerDefenseFrame = $state(0);
	let enemyDefenseFrame = $state(0);
	
	// Death states and frame tracking
	let isPlayerDead = $state(false);
	let isEnemyDead = $state(false);
	let playerDeathFrame = $state(0);
	let enemyDeathFrame = $state(0);
	
	// Get Hit states and frame tracking
	let isPlayerGettingHit = $state(false);
	let isEnemyGettingHit = $state(false);
	let playerGetHitFrame = $state(0);
	let enemyGetHitFrame = $state(0);
	
	// Enemy position (consistent between idle and attack)
	let enemyX = $derived(context.stateLayoutDerived.mainLayout().width * 0.7);
	let enemyY = $derived(context.stateLayoutDerived.mainLayout().height * 0.682);

	// Animation positioning offsets for proper visual centering
	// Different animation sprites have different visual centers, so we add offset positioning
	let playerAttackOffset = { x: 0, y: 15 }; // Attack animation needs to move up
	let playerDeathOffset = { x: 0, y: -20 }; // Death animation needs to move down
	let playerDefenseOffset = { x: 0, y: 10 }; // Defense animation needs to move up
	let playerGetHitOffset = { x: 0, y: 5 }; // Get hit animation needs to move up
	
	let enemyAttackOffset = { x: 0, y: 15 }; // Enemy attack animation needs to move up
	let enemyDeathOffset = { x: 0, y: -20 }; // Enemy death animation needs to move down
	let enemyDefenseOffset = { x: 0, y: 10 }; // Enemy defense animation needs to move up
	let enemyGetHitOffset = { x: 0, y: 5 }; // Enemy get hit animation needs to move up	


	// Keyboard controls for debugging
	let keysPressed = $state<Set<string>>(new Set());

	// Handle keyboard input
	const handleKeyDown = (e: KeyboardEvent) => {
		keysPressed.add(e.key.toLowerCase());
	};
	const handleKeyUp = (e: KeyboardEvent) => {
		keysPressed.delete(e.key.toLowerCase());
	};
	
	// Attack function
	const playerAttack = () => {
		if (!isPlayerAttacking) {
			isPlayerAttacking = true;
			playerAttackFrame = 0;
			// Attack animation duration - 22 frames at 50ms each = 1.1 seconds
			setTimeout(() => {
				isPlayerAttacking = false;
				playerAttackFrame = 0;
			}, 1100);
		}
	};
	
	const enemyAttack = () => {
		if (!isEnemyAttacking) {
			isEnemyAttacking = true;
			enemyAttackFrame = 0;
			// Attack animation duration - 22 frames at 50ms each = 1.1 seconds
			setTimeout(() => {
				isEnemyAttacking = false;
				enemyAttackFrame = 0;
			}, 1100);
		}
	};
	
	// Defense functions
	const playerDefend = () => {
		if (!isPlayerDefending) {
			isPlayerDefending = true;
			playerDefenseFrame = 0;
			// Defense animation duration - 10 frames at 50ms each = 0.5 seconds
			setTimeout(() => {
				isPlayerDefending = false;
				playerDefenseFrame = 0;
			}, 500);
		}
	};
	
	const enemyDefend = () => {
		if (!isEnemyDefending) {
			isEnemyDefending = true;
			enemyDefenseFrame = 0;
			// Defense animation duration - 10 frames at 50ms each = 0.5 seconds
			setTimeout(() => {
				isEnemyDefending = false;
				enemyDefenseFrame = 0;
			}, 500);
		}
	};
	
	// Death functions
	const playerDie = () => {
		if (!isPlayerDead) {
			isPlayerDead = true;
			playerDeathFrame = 0;
			// Death animation duration - 35 frames at 50ms each = 1.75 seconds
			setTimeout(() => {
				isPlayerDead = false;
				playerDeathFrame = 0;
			}, 1750);
		}
	};
	
	const enemyDie = () => {
		if (!isEnemyDead) {
			isEnemyDead = true;
			enemyDeathFrame = 0;
			// Death animation duration - 31 frames at 50ms each = 1.55 seconds
			setTimeout(() => {
				isEnemyDead = false;
				enemyDeathFrame = 0;
			}, 1550);
		}
	};
	
	// Get Hit functions
	const playerGetHit = () => {
		if (!isPlayerGettingHit) {
			isPlayerGettingHit = true;
			playerGetHitFrame = 0;
			// Get Hit animation duration - 14 frames at 50ms each = 0.7 seconds
			setTimeout(() => {
				isPlayerGettingHit = false;
				playerGetHitFrame = 0;
			}, 700);
		}
	};
	
	const enemyGetHit = () => {
		if (!isEnemyGettingHit) {
			isEnemyGettingHit = true;
			enemyGetHitFrame = 0;
			// Get Hit animation duration - 14 frames at 50ms each = 0.7 seconds
			setTimeout(() => {
				isEnemyGettingHit = false;
				enemyGetHitFrame = 0;
			}, 700);
		}
	};

	$effect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	$effect(() => {
		const interval = setInterval(() => {
			const screenWidth = context.stateLayoutDerived.mainLayout().width;
			const moveSpeed = 3;
			let dx = 0;
			
			// Handle movement
			if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
				isPlayerMoving = true;
				playerDirection = 'left';
				// Keep emitting movement even at left edge to still scroll background when needed
				if (playerX > screenWidth * 0.1) { playerX -= moveSpeed; dx = -moveSpeed; } else { dx = -moveSpeed; }
			} else if (keysPressed.has('d') || keysPressed.has('arrowright')) {
				isPlayerMoving = true;
				playerDirection = 'right';
				// Keep emitting movement even at right edge to still scroll background when needed
				if (playerX < screenWidth * 0.9) { playerX += moveSpeed; dx = moveSpeed; } else { dx = moveSpeed; }
			} else {
				isPlayerMoving = false;
			}
			
			// Handle attacks
			if (keysPressed.has('space') || keysPressed.has('f')) {
				playerAttack();
			}
			if (keysPressed.has('e')) {
				enemyAttack();
			}
			
			// Handle defense
			if (keysPressed.has('q')) {
				playerDefend();
			}
			if (keysPressed.has('r')) {
				enemyDefend();
			}
			
			// Handle death
			if (keysPressed.has('x')) {
				playerDie();
			}
			if (keysPressed.has('z')) {
				enemyDie();
			}
			
			// Handle get hit
			if (keysPressed.has('c')) {
				playerGetHit();
			}
			if (keysPressed.has('v')) {
				enemyGetHit();
			}
			
			if (dx !== 0) {
				context.eventEmitter.broadcast({ type: 'playerMoved', dx, playerX, playerY });
			}
		}, 16);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (isPlayerMoving) {
			// Walk animation - cycle through 18 frames
			const interval = setInterval(() => {
				currentFrame = (currentFrame + 1) % 18;
			}, 50);
			return () => clearInterval(interval);
		} else {
			// Idle animation - cycle through 10 frames
			const interval = setInterval(() => {
				currentFrame = (currentFrame + 1) % 10;
			}, 50); // Slower idle animation
			return () => clearInterval(interval);
		}
	});

	// Attack animation frame cycling
	$effect(() => {
		if (isPlayerAttacking) {
			// Player attack animation - cycle through 22 frames
			const interval = setInterval(() => {
				playerAttackFrame = (playerAttackFrame + 1) % 22;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (isEnemyAttacking) {
			// Enemy attack animation - cycle through 22 frames
			const interval = setInterval(() => {
				enemyAttackFrame = (enemyAttackFrame + 1) % 22;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	// Defense animation frame cycling
	$effect(() => {
		if (isPlayerDefending) {
			// Player defense animation - cycle through 10 frames
			const interval = setInterval(() => {
				playerDefenseFrame = (playerDefenseFrame + 1) % 10;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (isEnemyDefending) {
			// Enemy defense animation - cycle through 10 frames
			const interval = setInterval(() => {
				enemyDefenseFrame = (enemyDefenseFrame + 1) % 10;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	// Death animation frame cycling
	$effect(() => {
		if (isPlayerDead) {
			// Player death animation - cycle through 35 frames
			const interval = setInterval(() => {
				playerDeathFrame = (playerDeathFrame + 1) % 35;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (isEnemyDead) {
			// Enemy death animation - cycle through 31 frames
			const interval = setInterval(() => {
				enemyDeathFrame = (enemyDeathFrame + 1) % 31;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	// Get Hit animation frame cycling
	$effect(() => {
		if (isPlayerGettingHit) {
			// Player get hit animation - cycle through 14 frames
			const interval = setInterval(() => {
				playerGetHitFrame = (playerGetHitFrame + 1) % 14;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	$effect(() => {
		if (isEnemyGettingHit) {
			// Enemy get hit animation - cycle through 14 frames
			const interval = setInterval(() => {
				enemyGetHitFrame = (enemyGetHitFrame + 1) % 14;
			}, 50);
			return () => clearInterval(interval);
		}
	});

	const hasIdle = $derived(playerIdleTextures.length > 0);
	const hasWalk = $derived(playerWalkTextures.length > 0);
	const activeTextures = $derived(isPlayerMoving && hasWalk ? playerWalkTextures : hasIdle ? playerIdleTextures : []);

	// Create a local reference to AnimatedSprite for currentFrame support
	const AnimatedSprite: any = AnimatedSpriteBase;

	// Listen for zone changes to reset player position
	context.eventEmitter.subscribeOnMount({
		playerZoneChanged: (e) => {
			if (e.resetPosition) {
				const screenWidth = context.stateLayoutDerived.mainLayout().width;
				// Reset player to left side if moving right, right side if moving left
				if (playerDirection === 'right') {
					playerX = screenWidth * 0.2; // Left side
				} else {
					playerX = screenWidth * 0.8; // Right side
				}
			}
		},
	});
</script>

<MainContainer>
	<!-- Player - Render all animations with proper Y positioning for visual centering -->
	{#if isPlayerDead && playerDeathTextures.length > 0}
		<!-- Player Death Animation -->
		<AnimatedSprite
			textures={playerDeathTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={playerDeathFrame}
			anchor={0.5}
			x={playerX + playerDeathOffset.x}
			y={playerY + playerDeathOffset.y}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{:else if isPlayerGettingHit && playerGetHitTextures.length > 0}
		<!-- Player Get Hit Animation -->
		<AnimatedSprite
			textures={playerGetHitTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={playerGetHitFrame}
			anchor={0.5}
			x={playerX + playerGetHitOffset.x}
			y={playerY + playerGetHitOffset.y}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{:else if isPlayerAttacking && playerHitTextures.length > 0}
		<!-- Player Attack Animation using hit sprites -->
		<AnimatedSprite
			textures={playerHitTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={playerAttackFrame}
			anchor={0.5}
			x={playerX + playerAttackOffset.x}
			y={playerY + playerAttackOffset.y}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{:else if isPlayerDefending && playerDefenseTextures.length > 0}
		<!-- Player Defense Animation -->
		<AnimatedSprite
			textures={playerDefenseTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={playerDefenseFrame}
			anchor={0.5}
			x={playerX + playerDefenseOffset.x}
			y={playerY + playerDefenseOffset.y}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{:else if playerIdleTextures.length > 0 || playerWalkTextures.length > 0}
        <AnimatedSprite
			textures={activeTextures}
			animationSpeed={0}
			loop={false}
            play={false}
            currentFrame={currentFrame}
			anchor={0.5}
			x={playerX}
			y={playerY}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{/if}



	<!-- Active Enemy - Render all animations with proper Y positioning for visual centering -->
	{#if isEnemyDead && enemy1DeathTextures.length > 0}
		<!-- Enemy Death Animation -->
		<AnimatedSprite
			textures={enemy1DeathTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={enemyDeathFrame}
			anchor={0.5}
			scale={{ x: -1, y: 1 }}
			x={enemyX + enemyDeathOffset.x}
			y={enemyY + enemyDeathOffset.y}
		/>
	{:else if isEnemyGettingHit && enemy1GetHitTextures.length > 0}
		<!-- Enemy Get Hit Animation -->
		<AnimatedSprite
			textures={enemy1GetHitTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={enemyGetHitFrame}
			anchor={0.5}
			scale={{ x: -1, y: 1 }}
			x={enemyX + enemyGetHitOffset.x}
			y={enemyY + enemyGetHitOffset.y}
		/>
	{:else if isEnemyAttacking && enemy1HitTextures.length > 0}
		<!-- Enemy Attack Animation using hit sprites -->
		<AnimatedSprite
			textures={enemy1HitTextures}
			animationSpeed={0}
			loop={false}
			play={false}
			currentFrame={enemyAttackFrame}
			anchor={0.5}
			scale={{ x: -1, y: 1 }}
			x={enemyX + enemyAttackOffset.x}
			y={enemyY + enemyAttackOffset.y}
		/>
	{:else if getActiveTextures().length}
		<AnimatedSprite
			textures={getActiveTextures()}
			animationSpeed={0.25}
			loop
			play
			anchor={0.5}
			scale={{ x: -1, y: 1 }}
			x={enemyX}
			y={enemyY}
		/>
	{/if}

	<!-- Essential Debug Panel -->
	<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.8);color:#fff;padding:10px;border-radius:5px;font-family:monospace;font-size:12px;z-index:1000;">
		<div style="margin-bottom:10px;font-weight:bold;">Controls & Debug</div>
		
		<!-- Controls -->
		<div style="margin-bottom:10px;font-size:10px;">
			<div><strong>Movement:</strong></div>
			<div>A/D: Move left/right</div>
			<div><strong>Combat:</strong></div>
			<div>Space/F: Player Attack</div>
			<div>E: Enemy Attack</div>
			<div>Q: Player Defend</div>
			<div>R: Enemy Defend</div>
			<div>X: Player Die</div>
			<div>Z: Enemy Die</div>
			<div>C: Player Get Hit</div>
			<div>V: Enemy Get Hit</div>
		</div>
		
		<!-- Debug Buttons -->
		<div style="margin-top:10px;">
			<button onclick={() => console.log('Player Attack Asset:', context.stateApp.loadedAssets.player_attack)} style="padding: 5px; margin: 2px; background:#4CAF50; color:white; border:none; border-radius:3px; cursor:pointer;">
				Debug Player Attack
			</button>
			<button onclick={() => console.log('Enemy Attack Asset:', context.stateApp.loadedAssets.enemy_attack)} style="padding: 5px; margin: 2px; background:#2196F3; color:white; border:none; border-radius:3px; cursor:pointer;">
				Debug Enemy Attack
			</button>
		</div>
		
		<!-- Status Info -->
		<div style="margin-top:10px;font-size:10px;color:#ccc;">
			<div>Player: {isPlayerAttacking ? '⚔️' : isPlayerDefending ? '🛡️' : isPlayerDead ? '💀' : isPlayerGettingHit ? '💥' : isPlayerMoving ? '🚶' : '💤'}</div>
			<div>Enemy: {isEnemyAttacking ? '⚔️' : isEnemyDefending ? '🛡️' : isEnemyDead ? '💀' : isEnemyGettingHit ? '💥' : '💤'}</div>
		</div>
		
		<!-- Y Position Debug -->
		<div style="margin-top:10px;font-size:9px;color:#aaa;">
			<div><strong>Y Positions:</strong></div>
			<div>Player: {Math.round(playerY)} | Attack: {Math.round(playerY + playerAttackOffset.y)} | Death: {Math.round(playerY + playerDeathOffset.y)}</div>
			<div>Enemy: {Math.round(enemyY)} | Attack: {Math.round(enemyY + enemyAttackOffset.y)} | Death: {Math.round(enemyY + enemyDeathOffset.y)}</div>
		</div>
	</div>
</MainContainer>
