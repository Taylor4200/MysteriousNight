<script lang="ts" module>
	export type EmitterEventFreeSpinCounter =
		| { type: 'freeSpinCounterShow' }
		| { type: 'freeSpinCounterHide' }
		| { type: 'freeSpinCounterUpdate'; current?: number; total?: number };
</script>

<script lang="ts">
	import { MainContainer } from 'components-layout';
	import { FadeContainer } from 'components-pixi';
	import { getContext } from '../game/context';
	import { SYMBOL_SIZE } from '../game/constants';
	import { Text } from 'pixi-svelte';

	const context = getContext();
	const panelWidth = $derived(SYMBOL_SIZE * 2);
	const panelSizes = $derived({
		width: panelWidth,
		height: panelWidth * 0.75,
	});
	const position = $derived({
		x:
			context.stateGameDerived.boardLayout().x -
			context.stateGameDerived.boardLayout().width * 0.5 -
			panelSizes.width -
			SYMBOL_SIZE * 0.7,
		y:
			context.stateGameDerived.boardLayout().y -
			context.stateGameDerived.boardLayout().height * 0.5,
	});

	const fontSize = SYMBOL_SIZE * 0.275;

	let show = $state(false);
	let current = $state(0);
	let total = $state(0);

	context.eventEmitter.subscribeOnMount({
		freeSpinCounterShow: () => (show = true),
		freeSpinCounterHide: () => (show = false),
		freeSpinCounterUpdate: (emitterEvent) => {
			if (emitterEvent.current !== undefined) current = emitterEvent.current;
			if (emitterEvent.total !== undefined) total = emitterEvent.total;
		},
	});
</script>

<MainContainer>
	<FadeContainer {show} {...position}>
		<Text text="FREE SPIN" style={{ fill: 0xffffff, fontSize }} />
		<Text
			text={`${current} OF ${total}`}
			y={fontSize * 1.2}
			style={{ fill: 0xffffff, fontSize }}
		/>
	</FadeContainer>
</MainContainer>
