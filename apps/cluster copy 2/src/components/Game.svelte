<script lang="ts">
	import { onMount } from 'svelte';

	import { EnablePixiExtension } from 'components-pixi';
	import { EnableHotkey } from 'components-shared';
	import { MainContainer } from 'components-layout';
	import { App, Text, REM } from 'pixi-svelte';
	import { stateModal } from 'state-shared';

	import { UI, UiGameName } from 'components-ui-pixi';
	import { GameVersion } from 'components-ui-html';
import ModalsCluster from './ModalsCluster.svelte';

	import { getContext } from '../game/context';
	import EnableSound from './EnableSound.svelte';
	import EnableGameActor from './EnableGameActor.svelte';
	import ResumeBet from './ResumeBet.svelte';
	import Sound from './Sound.svelte';
	import Background from './Background.svelte';
	import LoadingScreen from './LoadingScreen.svelte';
	import BoardFrame from './BoardFrame.svelte';
	import MultiplierGrid from './MultiplierGrid.svelte';
	import Board from './Board.svelte';
	import Anticipations from './Anticipations.svelte';
	import ClusterWinAmounts from './ClusterWinAmounts.svelte';
	import TumbleBoard from './TumbleBoard.svelte';
	import TumbleWinAmount from './TumbleWinAmount.svelte';
	import GlobalMultiplier from './GlobalMultiplier.svelte';
	import Win from './Win.svelte';
	import FreeSpinIntro from './FreeSpinIntro.svelte';
	import FreeSpinCounter from './FreeSpinCounter.svelte';
	import FreeSpinOutro from './FreeSpinOutro.svelte';
	import Transition from './Transition.svelte';
	import I18nTest from './I18nTest.svelte';
	import Characters from './Characters.svelte';
	import SpinPanelCluster from './SpinPanelCluster.svelte';
	import ClusterModalGameRules from './ClusterModalGameRules.svelte';
    
	import DustParticleManager from './DustParticleManager.svelte';
    import MeatField from './MeatField.svelte';
    import RunWinCounter from './RunWinCounter.svelte';

	const context = getContext();
	let showInfo = $state(false);

	onMount(() => (context.stateLayout.showLoadingScreen = true));

	context.eventEmitter.subscribeOnMount({
		buyBonusConfirm: () => {
			stateModal.modal = { name: 'buyBonusConfirm' };
		},
		clusterInfoOpen: () => (showInfo = true),
	});

	$effect(() => {
		if (stateModal.modal?.name === 'gameRules' || stateModal.modal?.name === 'payTable') {
			showInfo = true;
			stateModal.modal = null;
		}
		// Intercept buyBonus modal to ensure it uses our custom cluster version
		if (stateModal.modal?.name === 'buyBonus') {
			// Let our custom ModalBuyBonusCluster handle it
			// No need to redirect, just ensure it's not the shared one
		}
	});
</script>

<App>
	<EnableSound />
	<EnableHotkey />
	<EnableGameActor />
	<EnablePixiExtension />

	<Background />

	{#if context.stateLayout.showLoadingScreen}
		<LoadingScreen onloaded={() => (context.stateLayout.showLoadingScreen = false)} />
	{:else}
		<ResumeBet />
		<!--
			The reason why <Sound /> is rendered after clicking the loading screen:
			"Autoplay with sound is allowed if: The user has interacted with the domain (click, tap, etc.)."
			Ref: https://developer.chrome.com/blog/autoplay
		-->
		<Sound />

		<MainContainer>
			<BoardFrame />
		</MainContainer>

		<MainContainer>
			<MultiplierGrid />
		</MainContainer>

		<MainContainer>
			<Board />
			<Anticipations />
			<TumbleWinAmount />
			<GlobalMultiplier />
		</MainContainer>

		<MainContainer>
			<TumbleBoard />
			<ClusterWinAmounts />
		</MainContainer>

		<!-- Characters above background/board, below UI -->
		<Characters />

        <!-- Dust Particle System -->
        <DustParticleManager />

        <!-- Visual-only collectible field -->
        <MeatField />

        <!-- Visual-only run win counter above player's head -->
        <RunWinCounter />

        <UI>
			{#snippet gameName()}
				<UiGameName name="CLUSTER GAME" />
			{/snippet}
            {#snippet logo()}{/snippet}
			{#snippet buttonPayTable(buttonProps: any)}{/snippet}
			{#snippet buttonGameRules(buttonProps: any)}{/snippet}
		</UI>

		<!-- Cluster spin panel (no paytable) -->
		<MainContainer alignVertical="bottom">
			<SpinPanelCluster anchor={{ x: 0.5, y: 0.5 }} />
		</MainContainer>

		<Win />
		<FreeSpinIntro />
		{#if ['desktop', 'landscape'].includes(context.stateLayoutDerived.layoutType())}
			<FreeSpinCounter />
		{/if}
		<FreeSpinOutro />
		<Transition />

		<I18nTest />
	{/if}
</App>

<!-- Cluster-specific modals (version snippet required) -->
<ModalsCluster>
	{#snippet version()}
		<GameVersion version="0.0.0" />
	{/snippet}
</ModalsCluster>

{#if showInfo}
	<ClusterModalGameRules open />
{/if}

