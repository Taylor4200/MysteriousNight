<script lang="ts">
	import type { Snippet } from 'svelte';

	import { Popup } from 'components-shared';
	import { zIndex } from 'constants-shared/zIndex';
	import { stateModal } from 'state-shared';

	import BaseContent from './BaseContent.svelte';
	import BaseScrollable from './BaseScrollable.svelte';

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();

	const baseUrl: string = (import.meta as any).env?.BASE_URL ?? '/';
	const icon = (name: string) => `${baseUrl}assets/icons/${name}`;
	// Paytable data with new tiered structure
	const paytableData = [
		{
			symbol: 'W',
			name: 'Wild Symbol',
			asset: icon('wild.png'),
			payouts: [
				{ count: 5, multiplier: 50 }
			]
		},
		{
			symbol: 'H1',
			name: 'High Symbol 1',
			asset: icon('wolf_icon.png'),
			payouts: [
				{ count: 5, multiplier: 5 },
				{ count: 4, multiplier: 2 },
				{ count: 3, multiplier: 0.8 }
			]
		},
		{
			symbol: 'H2',
			name: 'High Symbol 2',
			asset: icon('king.png'),
			payouts: [
				{ count: 5, multiplier: 4 },
				{ count: 4, multiplier: 1.8 },
				{ count: 3, multiplier: 0.7 }
			]
		},
		{
			symbol: 'H3',
			name: 'High Symbol 3',
			asset: icon('queen.png'),
			payouts: [
				{ count: 5, multiplier: 3 },
				{ count: 4, multiplier: 1.5 },
				{ count: 3, multiplier: 0.6 }
			]
		},
		{
			symbol: 'L1',
			name: 'Low Symbol 1',
			asset: icon('A.png'),
			payouts: [
				{ count: 5, multiplier: 2 },
				{ count: 4, multiplier: 1.5 },
				{ count: 3, multiplier: 0.8 }
			]
		},
		{
			symbol: 'L2',
			name: 'Low Symbol 2',
			asset: icon('K.png'),
			payouts: [
				{ count: 5, multiplier: 1.8 },
				{ count: 4, multiplier: 1.3 },
				{ count: 3, multiplier: 0.7 }
			]
		},
		{
			symbol: 'L3',
			name: 'Low Symbol 3',
			asset: icon('Q.png'),
			payouts: [
				{ count: 5, multiplier: 1.8 },
				{ count: 4, multiplier: 1.3 },
				{ count: 3, multiplier: 0.7 }
			]
		},
		{
			symbol: 'L4',
			name: 'Low Symbol 4',
			asset: icon('J.png'),
			payouts: [
				{ count: 5, multiplier: 1.5 },
				{ count: 4, multiplier: 1.2 },
				{ count: 3, multiplier: 0.6 }
			]
		}
	];
</script>

{#if stateModal.modal?.name === 'payTable'}
	<div class="modal-overlay" on:click={() => (stateModal.modal = null)}>
		<div class="modal-container" on:click|stopPropagation>
			<div class="modal-content">
				<button class="close-button" on:click={() => (stateModal.modal = null)}>×</button>
				<h1 class="modal-title">Paytable</h1>
				<div class="paytable">
					<div class="paytable-grid">
						{#each paytableData as symbol}
							<div class="symbol-card">
								<div class="symbol-frame">
									<img src={symbol.asset} alt={symbol.name} class="symbol" />
								</div>
								<div class="payout-info">
									<div class="payout-line">5={symbol.payouts[0].multiplier}x</div>
									{#if symbol.payouts[1]}
										<div class="payout-line">4={symbol.payouts[1].multiplier}x</div>
									{/if}
									{#if symbol.payouts[2]}
										<div class="payout-line">3={symbol.payouts[2].multiplier}x</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-content {
		pointer-events: auto;
		background: rgba(0, 0, 0, 0.9);
		border: 2px solid #444;
		border-radius: 12px;
		padding: 1.5rem;
		width: 90%;
		max-width: 700px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;
	}

	.close-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		cursor: pointer;
		color: white;
		font-size: 2rem;
		font-weight: bold;
		background-color: transparent;
		border: none;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		transition: color 0.2s ease;
		touch-action: manipulation;

		&:hover {
			color: #ccc;
		}
	}

	.modal-title {
		color: #ffffff;
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 0 1rem 0;
		text-align: center;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #444;
		flex-shrink: 0;
	}

	.paytable {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}

	.paytable-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(2, 1fr);
		gap: 0.5rem;
		width: 100%;
		height: 100%;
	}

	.symbol-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.3);
		border: 1px solid #444;
		border-radius: 8px;
		padding: 0.5rem;
		text-align: center;
	}

	.symbol-frame {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.25rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid #666;
	}

	.symbol {
		width: 100%;
		height: 100%;
		object-fit: contain;
		border-radius: 50%;
	}

	.payout-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.payout-line {
		color: #ffffff;
		font-size: 0.65rem;
		font-weight: 500;
		line-height: 1;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		.modal-content {
			padding: 1rem;
			max-height: 85vh;
		}

		.modal-title {
			font-size: 1.3rem;
			margin-bottom: 0.75rem;
		}

		.paytable-grid {
			gap: 0.4rem;
		}

		.symbol-frame {
			width: 35px;
			height: 35px;
		}

		.payout-line {
			font-size: 0.6rem;
		}
	}
</style>
