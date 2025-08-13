<script lang="ts">
	import { MainContainer, OnPressFullScreen } from 'components-layout';
	import { OnHotkey } from 'components-shared';
	import { Text } from 'pixi-svelte';

	type Props = {
		onpress: () => void;
	};

	const props: Props = $props();
</script>

<MainContainer alignVertical="bottom">
	<Text
		text="PRESS TO CONTINUE"
		style={{ fill: 0xffffff, fontSize: 32, fontWeight: 'bold' }}
		anchor={{ x: 0.5, y: 1 }}
		x={0}
		y={0}
	/>
</MainContainer>
<OnHotkey hotkey="Space" onpress={() => props.onpress()} />
<OnPressFullScreen onpress={() => props.onpress()} />
