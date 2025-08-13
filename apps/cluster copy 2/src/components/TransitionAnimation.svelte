<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		oncomplete: () => void;
	};

	const props: Props = $props();

	onMount(() => {
		// Short delay to simulate transition, then complete
		const id = setTimeout(() => props.oncomplete(), 300);
		return () => clearTimeout(id);
	});
</script>
