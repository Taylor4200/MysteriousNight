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

	// Player walk animation frames
	const playerWalkKeys = [
		'player_walk_0', 'player_walk_1', 'player_walk_2', 'player_walk_3', 'player_walk_4',
		'player_walk_5', 'player_walk_6', 'player_walk_7', 'player_walk_8', 'player_walk_9',
		'player_walk_10', 'player_walk_11', 'player_walk_12', 'player_walk_13', 'player_walk_14',
		'player_walk_15', 'player_walk_16', 'player_walk_17'
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

    // Player movement state and position
	let isPlayerMoving = $state(false);
	let playerDirection = $state<'left' | 'right'>('right');
    // Keep the player statically centered on screen
    let playerX = $state(context.stateLayoutDerived.mainLayout().width * 0.5);
	let playerY = $state(context.stateLayoutDerived.mainLayout().height * 0.67);
	let currentFrame = $state(0);
    // Player world position for camera/parallax (does NOT affect on-screen x)
    let playerWorldX = $state(0);
    // Exit phase: allow external controller to push hero off-screen
    let exitPhase = $state(false);

	// Keyboard controls for debugging
	let keysPressed = $state<Set<string>>(new Set());

	// Handle keyboard input
	const handleKeyDown = (e: KeyboardEvent) => {
		keysPressed.add(e.key.toLowerCase());
	};
	const handleKeyUp = (e: KeyboardEvent) => {
		keysPressed.delete(e.key.toLowerCase());
	};

	$effect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

    // Track last moving state to emit start/stop events once
    let wasMoving = false;

    // Simple acceleration model for holding keys (D to accelerate right, A to accelerate left)
    let currentSpeed = 0;
    const MIN_SPEED = 1.5; // px per tick (baseline when starting to move)
    const MAX_SPEED = 30;  // cap for demo
    const ACCEL_PER_SEC = 35; // how quickly speed builds while key is held
    const DECEL_PER_SEC = 50; // how quickly speed drops when released or opposite key pressed

    $effect(() => {
        let last = performance.now();
        const interval = setInterval(() => {
            const now = performance.now();
            const dt = (now - last) / 1000;
            last = now;

            const screenWidth = context.stateLayoutDerived.mainLayout().width;
            let dx = 0;
			
			// Handle movement (skip when externally controlled; controller broadcasts movement)
			if (externalControlRunning) {
				isPlayerMoving = true;
				dx = 0;
			} else if (keysPressed.has('a') || keysPressed.has('arrowleft')) {
				isPlayerMoving = true;
				playerDirection = 'left';
                // Accelerate left
                if (currentSpeed < MIN_SPEED) currentSpeed = MIN_SPEED;
                currentSpeed = Math.min(MAX_SPEED, currentSpeed + ACCEL_PER_SEC * dt);
                dx = -currentSpeed;
			} else if (keysPressed.has('d') || keysPressed.has('arrowright')) {
				isPlayerMoving = true;
				playerDirection = 'right';
                // Accelerate right
                if (currentSpeed < MIN_SPEED) currentSpeed = MIN_SPEED;
                currentSpeed = Math.min(MAX_SPEED, currentSpeed + ACCEL_PER_SEC * dt);
                dx = currentSpeed;
			} else {
				isPlayerMoving = false;
                // Decelerate to 0 when not moving
                if (currentSpeed > 0) {
                    currentSpeed = Math.max(0, currentSpeed - DECEL_PER_SEC * dt);
                }
			}
			
            // Emit run start/stop on edge transitions
            if (isPlayerMoving && !wasMoving) {
                context.eventEmitter.broadcast({ type: 'playerStartRunning' });
            } else if (!isPlayerMoving && wasMoving) {
                context.eventEmitter.broadcast({ type: 'playerStopRunning' });
            }
            wasMoving = isPlayerMoving;

            if (!externalControlRunning && !exitPhase && dx !== 0) {
                // Advance world position and broadcast
                playerWorldX += dx;
                context.eventEmitter.broadcast({ type: 'playerMoved', dx, playerX, playerY });
                // Camera follows world position; send for parallax to consume
                context.eventEmitter.broadcast({ type: 'cameraMoved', worldX: playerWorldX });
            } else if (!externalControlRunning && !exitPhase && currentSpeed === 0 && wasMoving) {
                // Ensure cameraMoved zero-delta freeze via stop event already wired elsewhere
                context.eventEmitter.broadcast({ type: 'cameraMoved', worldX: playerWorldX });
            }
		}, 16);
		return () => clearInterval(interval);
	});

    // Scale animation speed with external counter rate during runner mode
    let externalRate = $state(0);
    context.eventEmitter.subscribeOnMount({
        runnerCounterRate: (e: { rate: number }) => (externalRate = e.rate),
    });

    $effect(() => {
        const walkCount = playerWalkTextures.length || 1;
        const idleCount = playerIdleTextures.length || 1;
        if (isPlayerMoving) {
            let last = performance.now();
            const interval = setInterval(() => {
                const now = performance.now();
                const dt = (now - last) / 1000;
                last = now;
                const fps = Math.min(46, 3 + externalRate * 8); // 8..28 fps
                const framesToAdvance = Math.max(1, Math.floor(fps * dt));
                currentFrame = (currentFrame + framesToAdvance) % walkCount;
            }, 50);
            return () => clearInterval(interval);
        } else {
            const interval = setInterval(() => {
                currentFrame = (currentFrame + 1) % idleCount;
            }, 50);
            return () => clearInterval(interval);
        }
    });

    // Stumble (death) textures
    const playerDeathKeys = [
        'player_death_0','player_death_1','player_death_2','player_death_3','player_death_4','player_death_5','player_death_6','player_death_7','player_death_8','player_death_9',
        'player_death_10','player_death_11','player_death_12','player_death_13','player_death_14','player_death_15','player_death_16','player_death_17','player_death_18','player_death_19',
        'player_death_20','player_death_21','player_death_22','player_death_23','player_death_24','player_death_25','player_death_26','player_death_27','player_death_28','player_death_29',
        'player_death_30','player_death_31','player_death_32','player_death_33','player_death_34'
    ];
    const playerDeathTextures = $derived(playerDeathKeys.map((k)=> (context.stateApp.loadedAssets as any)[k]).filter(Boolean));

    const hasIdle = $derived(playerIdleTextures.length > 0);
    const hasWalk = $derived(playerWalkTextures.length > 0);
    const hasDeath = $derived(playerDeathTextures.length > 0);
    const activeTextures = $derived(isPlayerMoving && hasWalk ? playerWalkTextures : hasIdle ? playerIdleTextures : []);

    // Track whether a run has actually started at least once; stumbling only valid after that
    let hasRunAtLeastOnce = $state(false);
    // Stumble states
    let stumblePlaying = $state(false);
    let stumbleFrozen = $state(false); // hold last frame on ground until next run
    let stumbleTimeoutId: ReturnType<typeof setTimeout> | null = null;
	// External controller flag to keep walk cycle active without keys
	let externalControlRunning = $state(false);
    const startStumble = () => {
        if (stumblePlaying || stumbleFrozen || !hasRunAtLeastOnce || !hasDeath) return;
        stumblePlaying = true;
        stumbleFrozen = false;
        // auto-clear after animation duration
        const frames = playerDeathTextures.length || 20;
        const approxMs = Math.min(2000, Math.max(600, frames * 60));
        if (stumbleTimeoutId) clearTimeout(stumbleTimeoutId);
        stumbleTimeoutId = setTimeout(() => {
            stumblePlaying = false;
            stumbleFrozen = true;
            stumbleTimeoutId = null;
        }, approxMs);
    };
    context.eventEmitter.subscribeOnMount({
        // Explicit reset to original centered position when Knights Favor starts
        knightsFavorStart: () => {
            exitPhase = false;
            externalControlRunning = false;
            isPlayerMoving = false;
            currentFrame = 0;
            // Clear any stumble/death states immediately
            if (stumbleTimeoutId) {
                clearTimeout(stumbleTimeoutId);
                stumbleTimeoutId = null;
            }
            stumblePlaying = false;
            stumbleFrozen = false;
            playerWorldX = 0;
            playerX = context.stateLayoutDerived.mainLayout().width * 0.5;
            playerY = context.stateLayoutDerived.mainLayout().height * 0.67;
            context.eventEmitter.broadcast({ type: 'cameraMoved', worldX: 0 });
        },
        playerStartRunning: () => {
            hasRunAtLeastOnce = true;
            // Force-reset any in-progress stumble/death animation when a new run starts
            if (stumbleTimeoutId) {
                clearTimeout(stumbleTimeoutId);
                stumbleTimeoutId = null;
            }
            stumblePlaying = false;
            stumbleFrozen = false;
            exitPhase = false;
            externalControlRunning = true;
            isPlayerMoving = true;
            // Always begin from the first frame of the walk cycle for a crisp start
            currentFrame = 0;
            // Re-center hero on screen at the start of every action so he is visible immediately
            playerX = context.stateLayoutDerived.mainLayout().width * 0.5;
            playerY = context.stateLayoutDerived.mainLayout().height * 0.67;
        },
        runnerExitStart: () => {
            exitPhase = true;
            externalControlRunning = true; // keep walking animation while exiting
        },
        runnerExitEnd: () => {
            exitPhase = false;
        },
        // During exit phase, accept external screen-space X so the hero visibly runs off-screen
        playerMoved: (e: { dx: number; playerX: number; playerY: number }) => {
            if (exitPhase) {
                playerX = e.playerX;
                playerY = e.playerY;
            }
        },
        playerStopRunning: () => {
            externalControlRunning = false;
            isPlayerMoving = false;
        },
        playerStumbled: () => {
            externalControlRunning = false;
            isPlayerMoving = false;
            startStumble();
        },
    });

    // Stumble visual offset to align with current character
    const STUMBLE_OFFSET = { x: -45, y: -45 };
    const lastDeathFrameIndex = $derived(Math.max(0, playerDeathTextures.length - 1));

	// Create a local reference to AnimatedSprite for currentFrame support
	const AnimatedSprite: any = AnimatedSpriteBase;
</script>

<MainContainer>
	<!-- Player - Render idle and walk animations only -->
    {#if stumblePlaying && hasDeath}
        <!-- Stumble/Death animation (visual) when movement stops -->
        <AnimatedSprite
            textures={playerDeathTextures}
            animationSpeed={0.25}
            loop={false}
            play={true}
            anchor={0.5}
            x={playerX + STUMBLE_OFFSET.x}
            y={playerY + STUMBLE_OFFSET.y}
            scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
        />
    {:else if stumbleFrozen && hasDeath}
        <!-- Hold last frame on ground after stumble completes -->
        <AnimatedSprite
            textures={playerDeathTextures}
            animationSpeed={0}
            loop={false}
            play={false}
            currentFrame={lastDeathFrameIndex}
            anchor={0.5}
            x={playerX + STUMBLE_OFFSET.x}
            y={playerY + STUMBLE_OFFSET.y}
            scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
        />
    {:else if playerIdleTextures.length > 0 || playerWalkTextures.length > 0}
        <AnimatedSprite
			textures={activeTextures}
			animationSpeed={0}
			loop={false}
            play={false}
            currentFrame={activeTextures.length ? currentFrame % activeTextures.length : 0}
			anchor={0.5}
			x={playerX}
			y={playerY}
			scale={{ x: playerDirection === 'left' ? -1 : 1, y: 1 }}
		/>
	{/if}

	<!-- Simple Debug Panel -->
	<div style="position:absolute;top:10px;right:10px;background:rgba(0,0,0,.8);color:#fff;padding:10px;border-radius:5px;font-family:monospace;font-size:12px;z-index:1000;">
		<div style="margin-bottom:10px;font-weight:bold;">Controls & Debug</div>
		
		<!-- Controls -->
		<div style="margin-bottom:10px;font-size:10px;">
			<div><strong>Movement:</strong></div>
			<div>A/D: Move left/right</div>
		</div>
		
		<!-- Status Info -->
		<div style="margin-top:10px;font-size:10px;color:#ccc;">
			<div>Player: {isPlayerMoving ? '🚶' : '💤'}</div>
		</div>
		
		<!-- Position Debug -->
		<div style="margin-top:10px;font-size:9px;color:#aaa;">
			<div><strong>Position:</strong></div>
			<div>X: {Math.round(playerX)} | Y: {Math.round(playerY)}</div>
		</div>
	</div>
</MainContainer>
