<script lang="ts" module>
	export type EmitterEventBonusGameChests =
		| { type: 'bonusGameChestsShow' }
		| { type: 'bonusGameChestsHide' }
		| { type: 'bonusGameChestsUpdate'; totalFreeSpins: number };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { Container, Sprite, Text, SpriteSheet, BitmapText } from 'pixi-svelte';
	import { Button } from 'components-pixi';
	import { anchorToPivot } from 'pixi-svelte';
	import { onMount } from 'svelte';

	import { getContext } from '../game/context';

	const context = getContext();

	let show = $state(false);
	let totalFreeSpins = $state(0);
	let selectedChestIndex = $state(-1);
	let chestAnimating = $state(false);
	let chestAnimationComplete = $state(false); // Track if animation is done
	let oncomplete = $state(() => {});
	let animationKey = $state(0); // Force re-render when animation starts

	// Perfect fit for 1200x675 Stake iframe
	const IFRAME_WIDTH = 1200;
	const IFRAME_HEIGHT = 675;
	
	// Chest size - adjust this to change all chest sizes
	const CHEST_SIZE = 256;
	
	// Hit box size - smaller than visual size for more precise clicking
	const CHEST_HIT_BOX_SIZE = 100; // Smaller hit box for more precise clicking

	// Chest positions (3x2 grid)
	const chestPositions = [
		{ x: -300, y: -100 }, // Top left
		{ x: -50, y: -100 },     // Top center
		{ x: 250, y: -100 },   // Top right
		{ x: -300, y: 50 },   // Bottom left
		{ x: 35, y: 50 },      // Bottom center
		{ x: 340, y: 50 },    // Bottom right
	];

	context.eventEmitter.subscribeOnMount({
		bonusGameChestsShow: () => {
			console.log(`[BonusGameChests] Showing bonus game chests`);
			show = true;
		},
		bonusGameChestsHide: () => {
			console.log(`[BonusGameChests] Hiding bonus game chests`);
			show = false;
		},
		bonusGameChestsUpdate: async (emitterEvent: { totalFreeSpins: number }) => {
			console.log(`[BonusGameChests] Updating with ${emitterEvent.totalFreeSpins} free spins`);
			totalFreeSpins = emitterEvent.totalFreeSpins;
			selectedChestIndex = -1;
			chestAnimating = false;
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});

	function handleChestClick(index: number) {
		if (chestAnimating || selectedChestIndex !== -1) return;
		
		console.log(`[BonusGameChests] Chest ${index} clicked, starting animation`);
		
		selectedChestIndex = index;
		chestAnimating = true;
		chestAnimationComplete = false; // Reset animation state
		animationKey++; // Force re-render of chest sprite
		
		// Play chest opening sound
		context.eventEmitter.broadcast({ type: 'soundOnce', name: 'BtnGeneral' });
		
		// Calculate timing
		// Animation duration: 23 frames at 0.15 speed = ~1.53 seconds
		const animationDuration = 1530;
		// Total viewing time: 4 seconds
		const totalViewingTime = 4000;
		// Time to show free spins text: 1.6 seconds
		const textDisplayTime = 1600;
		
		console.log(`[BonusGameChests] Animation will complete in ${animationDuration}ms, text appears at ${textDisplayTime}ms`);
		
		// Wait for animation to complete, then pause on last frame
		setTimeout(() => {
			console.log(`[BonusGameChests] Animation completed, pausing on last frame`);
			chestAnimationComplete = true; // Mark animation as complete, but keep animated sprite visible
		}, animationDuration);
		
		// Wait for text display time, then show free spins text
		setTimeout(() => {
			console.log(`[BonusGameChests] Showing free spins text`);
			// Text will show when chestAnimationComplete is true
		}, textDisplayTime);
		
		// Wait for total viewing time, then resolve
		setTimeout(() => {
			console.log(`[BonusGameChests] Total viewing time completed, resolving`);
			oncomplete();
		}, totalViewingTime);
	}
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.8} />

	<!-- Bonus Game Background - Pixel perfect sizing -->
	<Sprite
		key="bonusGameBackground"
		anchor={0.5}
		x={IFRAME_WIDTH * 0.5}
		y={IFRAME_HEIGHT * 0.5}
		width={IFRAME_WIDTH}
		height={IFRAME_HEIGHT}
	/>

	<!-- Title Text -->
	<Container x={IFRAME_WIDTH * 0.5} y={IFRAME_HEIGHT * 0.5 - 250}>
		<Text
			text="PICK A CHEST"
			style={{
				fontFamily: 'gold',
				fontSize: 48,
				fontWeight: 'bold',
				fill: 0xffffff,
				letterSpacing: 2,
			}}
			anchor={0.5}
		/>
	</Container>

	<!-- Chests Grid -->
	<Container x={IFRAME_WIDTH * 0.5} y={IFRAME_HEIGHT * 0.5}>
		{#each chestPositions as position, index}
			<Container x={position.x} y={position.y}>
				<Button
					sizes={{ width: CHEST_HIT_BOX_SIZE, height: CHEST_HIT_BOX_SIZE }}
					onpress={() => handleChestClick(index)}
					disabled={selectedChestIndex !== -1}
					anchor={0.5}
				>
					{#snippet children({ center, hovered, pressed }: { center: any; hovered: boolean; pressed: boolean })}
						<Container {...center}>
							{#if selectedChestIndex === index && chestAnimating && !chestAnimationComplete}
								<!-- Animated chest opening - overlays the exact same position and size -->
								<SpriteSheet
									key="chestOpening"
									width={CHEST_SIZE}
									height={CHEST_SIZE}
									anchor={0.5}
									animationSpeed={0.15}
									loop={false}
									play={true}
								/>
							{:else if selectedChestIndex === index && chestAnimationComplete}
								<!-- Static opened chest - shows after animation completes -->
								<Sprite
									key="chestOpened"
									width={CHEST_SIZE}
									height={CHEST_SIZE}
									anchor={0.5}
								/>
							{:else}
								<!-- Static closed chest -->
								<Sprite
									key="chestClosed"
									width={CHEST_SIZE}
									height={CHEST_SIZE}
									anchor={0.5}
									alpha={hovered ? 0.8 : 1}
								/>
							{/if}
						</Container>
					{/snippet}
				</Button>
			</Container>
		{/each}
	</Container>

	<!-- Free Spins Display - appears at the clicked chest position -->
	{#if selectedChestIndex !== -1 && chestAnimationComplete}
		<Container 
			x={IFRAME_WIDTH * 0.5 + chestPositions[selectedChestIndex].x} 
			y={IFRAME_HEIGHT * 0.5 + chestPositions[selectedChestIndex].y - CHEST_SIZE * 0.3}
		>
			<BitmapText
				text={`${totalFreeSpins} FREE SPINS!`}
				style={{
					fontFamily: 'gold',
					fontSize: 36,
					fontWeight: 'bold',
					letterSpacing: 1,
				}}
				anchor={0.5}
			/>
		</Container>
	{/if}
</FadeContainer> 