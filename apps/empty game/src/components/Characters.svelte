<script lang="ts">
	import { AnimatedSprite } from 'pixi-svelte';
	import { MainContainer } from 'components-layout';
	import { getContext } from '../game/context';
	import type { LoadedSprite } from 'pixi-svelte';

	const context = getContext();
	const playerKeys = [
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
		'enemy2_idle_0','enemy2_idle_1','enemy2_idle_2','enemy2_idle_3','enemy2_idle_4','enemy2_idle_5','enemy2_idle_6','enemy2_idle_7','enemy2_idle_8','enemy2_idle_9'
	];
	const enemy3Keys = [
		'enemy3_idle_0','enemy3_idle_1','enemy3_idle_2','enemy3_idle_3','enemy3_idle_4','enemy3_idle_5','enemy3_idle_6','enemy3_idle_7','enemy3_idle_8','enemy3_idle_9'
	];

	const playerTextures = $derived(
		playerKeys.map((k) => context.stateApp.loadedAssets[k]).filter((t): t is LoadedSprite => Boolean(t))
	);
	const enemy1Textures = $derived(
		enemy1Keys.map((k) => context.stateApp.loadedAssets[k]).filter((t): t is LoadedSprite => Boolean(t))
	);
	const enemy2Textures = $derived(
		enemy2Keys.map((k) => context.stateApp.loadedAssets[k]).filter((t): t is LoadedSprite => Boolean(t))
	);
	const enemy3Textures = $derived(
		enemy3Keys.map((k) => context.stateApp.loadedAssets[k]).filter((t): t is LoadedSprite => Boolean(t))
	);

	let activeEnemy: 'enemy1' | 'enemy2' | 'enemy3' = 'enemy1';
	const getActiveTextures = () => (activeEnemy === 'enemy1' ? enemy1Textures : activeEnemy === 'enemy2' ? enemy2Textures : enemy3Textures);
</script>

<MainContainer>
	<!-- Player -->
	<AnimatedSprite
		textures={playerTextures}
		animationSpeed={0.3}
		loop
		play
		anchor={0.5}
		x={context.stateLayoutDerived.mainLayout().width * 0.2}
		y={context.stateLayoutDerived.mainLayout().height * 0.67}
	/>

	<!-- Active Enemy (flipped to face player) -->
	<AnimatedSprite
		textures={getActiveTextures()}
		animationSpeed={0.25}
		loop
		play
		anchor={0.5}
		scale={{ x: -1, y: 1 }}
		x={context.stateLayoutDerived.mainLayout().width * 0.7}
		y={context.stateLayoutDerived.mainLayout().height * 0.682}
	/>
</MainContainer>
