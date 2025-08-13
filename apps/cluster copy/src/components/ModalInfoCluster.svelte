<script lang="ts">
	import UiFadeContainer from 'components-ui-pixi/src/components/UiFadeContainer.svelte';
	import { Rectangle, Text } from 'pixi-svelte';
	import { getContext } from '../game/context';

	const context = getContext();
</script>

<UiFadeContainer>
	<rect width={600} height={400} />
</UiFadeContainer>
