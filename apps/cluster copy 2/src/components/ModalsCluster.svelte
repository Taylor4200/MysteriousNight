<script lang="ts">
	import type { Snippet } from 'svelte';
	import ModalError from 'components-ui-html/src/components/ModalError.svelte';
	import ModalBetMenu from 'components-ui-html/src/components/ModalBetMenu.svelte';
	import ModalAutoSpin from 'components-ui-html/src/components/ModalAutoSpin.svelte';
	import ModalAutoSpinMessage from 'components-ui-html/src/components/ModalAutoSpinMessage.svelte';
	import ModalPayTable from 'components-ui-html/src/components/ModalPayTable.svelte';
	import ModalGameRules from 'components-ui-html/src/components/ModalGameRules.svelte';
	import ModalSettings from 'components-ui-html/src/components/ModalSettings.svelte';
	import GameRules from 'components-ui-html/src/components/GameRules.svelte';
	
	// Import our custom cluster bonus modal instead of the shared ones
	import ModalBuyBonusCluster from './ModalBuyBonusCluster.svelte';

	type Props = {
		version: Snippet;
	};

	const props: Props = $props();
</script>

<ModalError />
<ModalBetMenu />
<!-- Use our custom cluster bonus modal instead of shared ones -->
<ModalBuyBonusCluster />
<ModalAutoSpin />
<ModalAutoSpinMessage />
<ModalPayTable>
	{@render props.version()}
</ModalPayTable>
<ModalGameRules>
	<GameRules />
	{@render props.version()}
</ModalGameRules>
<ModalSettings />
