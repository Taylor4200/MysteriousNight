<script lang="ts" module>
	export type EmitterEventGlobalMultiplier =
		| { type: 'globalMultiplierShow' }
		| { type: 'globalMultiplierHide' }
		| { type: 'globalMultiplierUpdate'; multiplier: number };
</script>

<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { FadeContainer } from 'components-pixi';
	import BoardContainer from './BoardContainer.svelte';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import { Text, Container } from 'pixi-svelte';

	const PANEL_WIDTH = SYMBOL_SIZE * 0.641;
	const context = getContext();
	const scale = $derived(context.stateLayoutDerived.isStacked() ? 1.28 : 1);
	const desktopPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.3,
		y: -SYMBOL_SIZE * 0.47,
	});
	const portraitPosition = $derived({
		x: context.stateGameDerived.boardLayout().width - PANEL_WIDTH * 1.5,
		y: -SYMBOL_SIZE * 0.55,
	});
	const position = $derived(
		context.stateLayoutDerived.isStacked() ? portraitPosition : desktopPosition,
	);

	let show = $state(false);
	let multiplier = $state(1);
	let previousMultiplier = new Tween(1);

	context.eventEmitter.subscribeOnMount({
		globalMultiplierShow: () => (show = true),
		globalMultiplierHide: () => (show = false),
		globalMultiplierUpdate: async (emitterEvent) => {
			multiplier = emitterEvent.multiplier;
			previousMultiplier.set(multiplier, { duration: 0 });
		},
	});
</script>

<FadeContainer {show}>
	<BoardContainer>
		<Container {...position} {scale}>
			<Text
				anchor={0.5}
				text={`${Math.round(previousMultiplier.current)}×`}
				style={{ fill: 0xffffff, fontSize: SYMBOL_SIZE * 1.2, fontWeight: 'bold' }}
			/>
		</Container>
	</BoardContainer>
</FadeContainer>
