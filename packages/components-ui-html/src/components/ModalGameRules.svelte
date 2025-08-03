<script lang="ts">
	import type { Snippet } from 'svelte';

	import { zIndex } from 'constants-shared/zIndex';
	import { stateModal } from 'state-shared';

	type Props = {
		children: Snippet;
	};

	const props: Props = $props();
</script>

{#if stateModal.modal?.name === 'gameRules'}
	<div class="modal-overlay" on:click={() => (stateModal.modal = null)}>
		<div class="modal-container" on:click|stopPropagation>
			<div class="modal-content">
				<button class="close-button" on:click={() => (stateModal.modal = null)}>×</button>
				<h1 class="modal-title">Game Information</h1>
						<div class="scrollable-content">
			{@render props.children()}
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
		pointer-events: auto; /* Re-enable pointer events on content */
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
		
		/* Mobile optimizations */
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
		touch-action: manipulation; /* Better touch response */

		&:hover {
			color: #ccc;
		}
		
		/* Mobile optimizations */
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
		flex-shrink: 0; /* Don't shrink the title */
	}

	.scrollable-content {
		flex: 1; /* Take remaining space */
		overflow-y: auto;
		overflow-x: hidden;
		padding-right: 0.5rem; /* Space for scrollbar */
		margin-right: -0.5rem; /* Pull scrollbar to edge */
		overscroll-behavior: contain; /* Prevent scroll chaining */
		
		/* Enhanced mobile scrolling */
		-webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
		touch-action: pan-y; /* Allow vertical touch scrolling */
		
		/* Custom scrollbar styling */
		scrollbar-width: thin;
		scrollbar-color: #666 transparent;

		&::-webkit-scrollbar {
			width: 8px;
		}

		&::-webkit-scrollbar-track {
			background: transparent;
		}

		&::-webkit-scrollbar-thumb {
			background: #666;
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb:hover {
			background: #888;
		}
		
		/* Mobile-specific improvements */
		@media (max-width: 768px) {
			padding-right: 0.25rem;
			margin-right: -0.25rem;
			
			/* Hide scrollbar on mobile for cleaner look */
			scrollbar-width: none;
			-ms-overflow-style: none;
			
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
</style>
