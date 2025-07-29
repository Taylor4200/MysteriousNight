<script lang="ts" module>
	import { stateBet, stateBetDerived } from 'state-shared';
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { getContextEventEmitter } from 'utils-event-emitter';
	import { createInterruptible } from 'utils-shared/interruptible';
	import { waitForTimeout } from 'utils-shared/wait';
	import type { EmitterEventHotKey } from '../types';

	const context = getContextEventEmitter<EmitterEventHotKey>();
	const interruptible = createInterruptible();
	const WAIT_TO_HOLD_TIMEOUT = 3000; // 3 seconds for turbo spin activation
	let isHolding = $state(false);
	let isWaitingToHold = $state(false);
	let turboActivated = $state(false);

	const holdTimeoutStart = async () => {
		isWaitingToHold = true;
		const { interrupted } = await interruptible.add(() => waitForTimeout(WAIT_TO_HOLD_TIMEOUT));
		if (!interrupted) {
			isHolding = true;
			turboActivated = true;
			// Enable turbo spins
			stateBet.autoSpinsCounter = 0;
			stateBet.isSpaceHold = true;
			stateBetDerived.updateIsTurbo(true, { persistent: true });
			console.log('Turbo spins activated!');
		}
	};

	const holdTimeoutStop = () => {
		isWaitingToHold = false;
		interruptible.interrupt();
		interruptible.clear();
	};

	const keyDown = () => {
		if (!isWaitingToHold) holdTimeoutStart();
		if (!isHolding) {
			// Regular space press - start spin
			console.log('Space pressed - starting spin');
		}
	};

	const keyUp = () => {
		if (isWaitingToHold) holdTimeoutStop();

		if (isHolding) {
			// Turbo mode was active, now deactivate
			stateBet.isSpaceHold = false;
			stateBetDerived.updateIsTurbo(false, { persistent: true });
			turboActivated = false;
			console.log('Turbo spins deactivated');
		} else {
			// Regular space release
			console.log('Space released');
		}

		isHolding = false;
	};

	context.eventEmitter.subscribeOnMount({
		hotKey: (emitterEvent) => {
			if (emitterEvent.key !== 'Space') return;
			if (emitterEvent.action === 'keyUp') return keyUp();
			if (emitterEvent.action === 'keyDown') return keyDown();
		},
	});

	$effect(() => {
		if (isHolding) {
			// Keep turbo active while holding
		}
	});

	onDestroy(() => keyUp());
</script>
