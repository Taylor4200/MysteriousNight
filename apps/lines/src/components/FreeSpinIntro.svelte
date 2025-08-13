<script lang="ts" module>
export type EmitterEventFreeSpinIntro =
		| { type: 'freeSpinIntroShow'; total: number }
		| { type: 'freeSpinIntroHide' }
		| { type: 'freeSpinIntroStartAwait' };
</script>

<script lang="ts">
	import { CanvasSizeRectangle } from 'components-layout';
	import { stateUrlDerived } from 'state-shared';
	import { FadeContainer } from 'components-pixi';
	import { waitForResolve } from 'utils-shared/wait';
	import { BitmapText, SpineProvider, SpineSlot, SpineTrack, Sprite } from 'pixi-svelte';

	import { getContext } from '../game/context';
	import PressToContinue from './PressToContinue.svelte';
	import FreeSpinAnimation from './FreeSpinAnimation.svelte';

	type AnimationName = 'intro' | 'idle';

	const context = getContext();

	let show = $state(false);
	let animationName = $state<AnimationName>('intro');
	let freeSpinsFromEvent = $state(0);
	let oncomplete = $state(() => {});

	context.eventEmitter.subscribeOnMount({
		freeSpinIntroShow: (e: { total: number }) => {
			freeSpinsFromEvent = e.total;
			show = true;
		},
		freeSpinIntroHide: () => (show = false),
		freeSpinIntroStartAwait: async () => {
			await waitForResolve((resolve) => (oncomplete = resolve));
		},
	});
</script>

<FadeContainer {show}>
	<CanvasSizeRectangle backgroundColor={0x000000} backgroundAlpha={0.5} />

	<FreeSpinAnimation>
		{#snippet children({ sizes })}
			<Sprite
				anchor={{ x: 0.5, y: 1.2 }}
				width={500 * 2.2}
				height={156 * 2.2}
				key="freespins_{stateUrlDerived.lang()}.png"
			/>

			<SpineProvider key="fsIntroNumber" width={sizes.width * 0.3}>
				<SpineTrack
					trackIndex={0}
					{animationName}
					loop={animationName === 'idle'}
					listener={{
						complete: () => (animationName = 'idle'),
					}}
				/>
				<SpineSlot slotName="slot_number">
					<BitmapText
						anchor={{ x: 0.5, y: 0.5 }}
						text={freeSpinsFromEvent}
						style={{
							fontFamily: 'gold',
							fontSize: sizes.width * 0.1,
							fontWeight: 'bold',
						}}
					/>
				</SpineSlot>
			</SpineProvider>

			<Sprite anchor={{ x: 0.5, y: -3 }} width={183 * 2.2} height={42 * 2.2} key="freespins.png" />
		{/snippet}
	</FreeSpinAnimation>

	<PressToContinue onpress={() => oncomplete()} />
</FadeContainer>
