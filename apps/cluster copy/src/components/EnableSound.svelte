<script lang="ts">
	import { onMount } from 'svelte';

	import type { LoadedAudio } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import { sound, type SoundName } from '../game/sound';

	const context = getContext();

	onMount(() => {
		const audioAsset = context.stateApp.loadedAssets['sound'] as LoadedAudio<SoundName> | undefined;
		if (!audioAsset) return;
		const { destroy } = sound.load(audioAsset);
		return () => destroy();
	});

	sound.enableEffect();
	sound.volumeEffect();
</script>
