<script lang="ts">
	import { stateModal } from 'state-shared';
	export let open = false;
</script>

{#if open}
	<div class="modal-overlay" on:click={() => (open = false)}>
		<div class="modal-container" on:click|stopPropagation>
			<div class="modal-content">
				<button class="close-button" on:click={() => (open = false)}>×</button>
				<h1 class="modal-title">Game Information</h1>
				<div class="scrollable-content">
					<!-- Cluster-specific rules/info content -->
					<h2 class="section-title">GAME RULES</h2>
					<div class="game-rules-content">
						<div class="rule-item">
							<div class="rule-text">
								<p>Match clusters to win. Larger clusters pay more.</p>
								<p>Waves: defeat enemies to progress to the next wave.</p>
								<p>Bonus: defeating certain waves triggers bonus features.</p>
							</div>
						</div>
					</div>
					<h2 class="section-title">GAME INFORMATION</h2>
					<div class="game-info-content">
						<p>RTP: 95.2%</p>
						<p>Version: Cluster Copy</p>
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
		padding: 2rem;
		width: 90%;
		max-width: 900px;
		max-height: 85vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		position: relative;

		@media (max-width: 768px) {
			width: 95%;
			max-height: 90vh;
			padding: 1.5rem;
			border-radius: 8px;
		}
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

		&:hover { color: #ccc; }

		@media (max-width: 768px) {
			width: 2.5rem;
			height: 2.5rem;
			font-size: 2.5rem;
			top: 0.75rem;
			right: 0.75rem;
		}
	}

	.modal-title {
		color: #ffffff;
		font-size: 1.8rem;
		font-weight: bold;
		margin: 0 0 1.5rem 0;
		text-align: center;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid #444;
		flex-shrink: 0;
	}

	.scrollable-content {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding-right: 0.5rem;
		margin-right: -0.5rem;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		touch-action: pan-y;
		scrollbar-width: thin;
		scrollbar-color: #666 transparent;

		&::-webkit-scrollbar { width: 8px; }
		&::-webkit-scrollbar-track { background: transparent; }
		&::-webkit-scrollbar-thumb { background: #666; border-radius: 4px; }
		&::-webkit-scrollbar-thumb:hover { background: #888; }

		@media (max-width: 768px) {
			padding-right: 0.25rem;
			margin-right: -0.25rem;
			scrollbar-width: none;
			-ms-overflow-style: none;
			&::-webkit-scrollbar { display: none; }
		}
	}

	.section-title { font-size: 1.4rem; font-weight: bold; margin-bottom: 1rem; color: #ffffff; text-align: left; border-bottom: 1px solid #444; padding-bottom: 0.5rem; }
	.game-info-content { color: #999; font-size: 0.85rem; line-height: 1.4; text-align: center; padding: 0.75rem; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1rem; }
	.game-rules-content { display: flex; flex-direction: column; gap: 1.5rem; }
	.rule-item { background: rgba(0, 0, 0, 0.2); border: 1px solid #333; border-radius: 8px; padding: 1rem; }
	.rule-text { color: #ffffff; line-height: 1.5; font-size: 0.9rem; flex: 1; }
</style>
