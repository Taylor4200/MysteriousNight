<script lang="ts">
	import { getContext } from 'svelte';
	import { MainContainer } from 'components-layout';
	import { BitmapText } from 'pixi-svelte';

	// Demo state
	let currentText = '';
	let currentType: 'zone' | 'battle' | 'reward' | 'special' = 'zone';
	let showText = false;
	
	// Get context safely
	let context: any = null;
	
	// Try to get context multiple times
	$effect(() => {
		const tryGetContext = () => {
			try {
				const ctx = getContext('gameContext');
				if (ctx) {
					context = ctx;
					console.log('Context loaded successfully');
				}
			} catch (e) {
				console.log('Context not available yet, retrying...');
				// Retry after a short delay
				setTimeout(tryGetContext, 100);
			}
		};
		
		tryGetContext();
	});

	// Demo texts
	const demoTexts = {
		zone: ['ZONE 1', 'ZONE 2 BONUS', 'ZONE 3 ULTRA BONUS', 'ZONE 4 SUPER BONUS'],
		battle: ['VICTORY!', 'DEFEATED', 'BOSS DEFEATED', 'CRITICAL HIT!'],
		reward: ['BIG WIN', 'MEGA WIN', 'EPIC WIN', 'SUPER WIN'],
		special: ['BONUS UNLOCKED', 'SUPER BONUS', 'ULTRA BONUS', 'FREE SPINS UNLOCKED']
	};

	// Show text function
	const showBattleText = (type: 'zone' | 'battle' | 'reward' | 'special', text: string) => {
		currentType = type;
		currentText = text;
		showText = true;
		
		// Auto-hide after 3 seconds
		setTimeout(() => {
			showText = false;
		}, 3000);
	};

	// Get font assets safely
	const fontTexture = $derived(context?.stateApp?.loadedAssets?.gladiators_font);
	const fontData = $derived(context?.stateApp?.loadedAssets?.gladiators_fnt);
	
	// Check if both font assets are loaded
	const fontLoaded = $derived(fontTexture && fontData);
	
	// Debug logging
	$effect(() => {
		if (context) {
			console.log('Context available:', context);
			console.log('Loaded assets:', Object.keys(context.stateApp?.loadedAssets || {}));
			console.log('Font texture:', fontTexture);
			console.log('Font data:', fontData);
			console.log('Font loaded:', fontLoaded);
		}
	});
	
	// Create font style object
	const fontStyle = $derived({
		fontName: 'Gladiators',
		fontSize: 64
	});

	// Get color based on type
	const getColor = () => {
		switch (currentType) {
			case 'zone':
				return 0xFFD700; // Gold
			case 'battle':
				return 0xFF4500; // Orange-red
			case 'reward':
				return 0xFFD700; // Gold
			case 'special':
				return 0x00FF7F; // Spring green
			default:
				return 0xFFFFFF; // White
		}
	};
</script>

<MainContainer>
	<!-- Demo Controls -->
	<div style="position:absolute;top:10px;left:10px;background:rgba(0,0,0,.8);color:#fff;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;z-index:1000;">
		<div style="font-weight:bold;margin-bottom:10px;">🎮 Battle Text Demo</div>
		
		<div style="margin-bottom:15px;">
			<div style="font-weight:bold;color:#FFD700;">Zone Intros:</div>
			{#each demoTexts.zone as text}
				<button 
					onclick={() => showBattleText('zone', text)}
					style="display:block;margin:2px;padding:4px 8px;background:#333;border:1px solid #666;color:#fff;border-radius:4px;cursor:pointer;"
				>
					{text}
				</button>
			{/each}
		</div>

		<div style="margin-bottom:15px;">
			<div style="font-weight:bold;color:#FF4500;">Battle Outcomes:</div>
			{#each demoTexts.battle as text}
				<button 
					onclick={() => showBattleText('battle', text)}
					style="display:block;margin:2px;padding:4px 8px;background:#333;border:1px solid #666;color:#fff;border-radius:4px;cursor:pointer;"
				>
					{text}
				</button>
			{/each}
		</div>

		<div style="margin-bottom:15px;">
			<div style="font-weight:bold;color:#FFD700;">Reward Popups:</div>
			{#each demoTexts.reward as text}
				<button 
					onclick={() => showBattleText('reward', text)}
					style="display:block;margin:2px;padding:4px 8px;background:#333;border:1px solid #666;color:#fff;border-radius:4px;cursor:pointer;"
				>
					{text}
				</button>
			{/each}
		</div>

		<div style="margin-bottom:15px;">
			<div style="font-weight:bold;color:#00FF7F;">Special Triggers:</div>
			{#each demoTexts.special as text}
				<button 
					onclick={() => showBattleText('special', text)}
					style="display:block;margin:2px;padding:4px 8px;background:#333;border:1px solid #666;color:#fff;border-radius:4px;cursor:pointer;"
				>
					{text}
				</button>
			{/each}
		</div>

		<div style="font-size:10px;color:#888;margin-top:10px;">
			Font Texture: {fontTexture ? '✅ Loaded' : '❌ Not Loaded'}
			<br />
			Font Data: {fontData ? '✅ Loaded' : '❌ Not Loaded'}
			<br />
			Font Ready: {fontLoaded ? '✅ Yes' : '❌ No'}
			<br />
			Context: {context ? '✅ Available' : '❌ Not Available'}
		</div>
	</div>

	<!-- Battle Text Display -->
	{#if showText && fontLoaded && currentText}
		<BitmapText
			text={currentText}
			style={fontStyle}
			tint={getColor()}
			anchor={{ x: 0.5, y: 0.5 }}
			x={context?.stateLayoutDerived?.mainLayout()?.width * 0.5 || 600}
			y={context?.stateLayoutDerived?.mainLayout()?.height * 0.3 || 200}
			scale={1.2}
		/>
	{/if}
</MainContainer>
