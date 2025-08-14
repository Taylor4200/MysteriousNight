<script lang="ts">
	import { Popup } from 'components-shared';
	import { zIndex } from 'constants-shared/zIndex';
	import { stateModal, stateBet } from 'state-shared';
	import { Button } from 'components-shared';
	import { getContextEventEmitter } from 'utils-event-emitter';
	import { numberToCurrencyString } from 'utils-shared/amount';

	import BaseIcon from 'components-ui-html/src/components/BaseIcon.svelte';
	import BaseTitle from 'components-ui-html/src/components/BaseTitle.svelte';
	import BaseContent from 'components-ui-html/src/components/BaseContent.svelte';
	import BaseScrollable from 'components-ui-html/src/components/BaseScrollable.svelte';
	import BaseButtonWrap from 'components-ui-html/src/components/BaseButtonWrap.svelte';
	import BaseButtonContent from 'components-ui-html/src/components/BaseButtonContent.svelte';
	import BonusCard from 'components-ui-html/src/components/BonusCard.svelte';
	import { i18nDerived } from 'components-ui-html/src/i18n/i18nDerived';
	import type { EmitterEventModal } from 'components-ui-html/src/types';

	const { eventEmitter } = getContextEventEmitter<EmitterEventModal>();

	// Custom bonus options for cluster copy game
	const bonusOptions = [
		{
			id: 'cluster-bonus-1',
			title: 'CLUSTERs',
			description: 'Unlock the cluster bonus feature for enhanced gameplay',
			costMultiplier: 50,
			buttonText: 'ACTIVATE'
		},
		{
			id: 'cluster-bonus-2', 
			title: 'SUPERs',
			description: 'Access the super cluster bonus with massive rewards',
			costMultiplier: 100,
			buttonText: 'ACTIVATE'
		}
	];

	const activateBonus = (bonusId: string) => {
		// Custom logic for cluster copy game bonuses
		eventEmitter.broadcast({ type: 'soundPressGeneral' });
		stateModal.modal = null;
		// Add your custom bonus activation logic here
	};
</script>

{#if stateModal.modal?.name === 'buyBonus'}
	<Popup zIndex={zIndex.modal} onclose={() => (stateModal.modal = null)}>
		<BaseContent maxWidth="500px">
			<BaseTitle>
				CLUSTER GAME BONUSES
			</BaseTitle>
			<BaseScrollable type="column">
				<div style="text-align: center; margin-bottom: 1rem;">
					<p>Choose your bonus feature to enhance your cluster gaming experience!</p>
				</div>
				
				{#each bonusOptions as bonus}
					<BonusCard>
						{#snippet title()}
							<div class="title">
								{bonus.title}
							</div>
						{/snippet}

						{#snippet description()}
							<div class="description">
								{bonus.description}
							</div>
						{/snippet}

						{#snippet price()}
							<div class="price">
								{numberToCurrencyString(stateBet.betAmount * bonus.costMultiplier)}
							</div>
						{/snippet}

						{#snippet button()}
							<Button
								onclick={() => activateBonus(bonus.id)}
								disabled={stateBet.betAmount <= 0 || 
									stateBet.balanceAmount < stateBet.betAmount * bonus.costMultiplier}
							>
								<BaseIcon width="100%" height="2rem" border="2px solid white;" />
								<BaseButtonContent>
									<span style="font-size: 1rem;">{bonus.buttonText}</span>
								</BaseButtonContent>
							</Button>
						{/snippet}
					</BonusCard>
				{/each}
			</BaseScrollable>
		</BaseContent>
	</Popup>
{/if}

<style lang="scss">
	.title {
		font-size: 1rem;
		line-height: 1rem;
		text-align: center;
	}

	.description {
		font-size: 0.75rem;
		text-align: center;
		min-height: 4rem;
		white-space: pre-line;
		display: inline-flex;
		align-items: center;
	}

	.description:empty {
		display: none;
	}

	.price {
		font-size: 1rem;
		line-height: 1rem;
		text-align: center;
		white-space: nowrap;
	}
</style>
