<script lang="ts">
	import { stateMeta } from 'state-shared';

	// Only show actual game rules, not paytable stuff (that has its own modal)
	const gameRulesOnly = stateMeta.gameRuleMeta.gameRules.filter(section => 
		section.title === 'GAME RULES' ||
		section.title === 'BONUS FEATURES' ||
		section.title === 'SUPER BONUS FEATURES' ||
		section.title === 'GAME INFORMATION' ||
		section.title === 'LEGAL NOTICE'
	);
</script>

{#each gameRulesOnly as ruleSection}
	<div class="rule-section">
		<h2 class="section-title">{ruleSection.title}</h2>
		
		{#if ruleSection.title === 'GAME INFORMATION'}
			<!-- Subtle RTP info display -->
			<div class="game-info-content">
				{@html ruleSection.containers[0].text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
			</div>
		{:else if ruleSection.title === 'GAME RULES' || ruleSection.title === 'BONUS FEATURES' || ruleSection.title === 'SUPER BONUS FEATURES'}
			<!-- Game rules and bonus features with structured content -->
			<div class="game-rules-content">
				{#each ruleSection.containers as container}
					<div class="rule-item">
						{#if container.title}
							<h3 class="rule-title">{container.title}</h3>
						{/if}
						<div class="rule-content">
							{#if container.image && container.imagePosition === 'left'}
								<img src={container.image} alt={container.title} class="rule-icon" />
							{/if}
							<div class="rule-text">
								{@html container.text.replace(/\n/g, '<br>')}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if ruleSection.title === 'LEGAL NOTICE'}
			<!-- Legal notice with multiple sections -->
			<div class="legal-content">
				{#each ruleSection.containers as container}
					<div class="legal-item">
						{#if container.title}
							<h3 class="legal-title">{container.title}</h3>
						{/if}
						<div class="legal-text">
							{@html container.text.replace(/\n/g, '<br>')}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- UI Guide with icons -->
			<div class="ui-guide-content">
				{#each ruleSection.containers as container}
					<div class="ui-item">
						{#if container.image}
							<img src={container.image} alt="UI Element" class="ui-icon" />
						{/if}
						<div class="ui-text">
							{@html container.text.replace(/\n/g, '<br>')}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/each}

<style lang="scss">
	.rule-section {
		margin-bottom: 2rem;
		
		&:last-child {
			margin-bottom: 0; /* Remove bottom margin from last section */
		}
	}

	.section-title {
		font-size: 1.4rem;
		font-weight: bold;
		margin-bottom: 1rem;
		color: #ffffff;
		text-align: left;
		border-bottom: 1px solid #444;
		padding-bottom: 0.5rem;
	}

	.game-info-content {
		color: #999;
		font-size: 0.85rem;
		line-height: 1.4;
		text-align: center;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		margin-bottom: 1rem;
	}

	.game-rules-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.rule-item {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid #333;
		border-radius: 8px;
		padding: 1rem;
	}

	.rule-title {
		color: #ffffff;
		font-size: 1.1rem;
		font-weight: bold;
		margin: 0 0 0.75rem 0;
		border-bottom: 1px solid #444;
		padding-bottom: 0.5rem;
	}

	.rule-content {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.rule-icon {
		width: 50px;
		height: 50px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.rule-text {
		color: #ffffff;
		line-height: 1.5;
		font-size: 0.9rem;
		flex: 1;
	}

	.legal-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.legal-item {
		background: rgba(0, 0, 0, 0.2);
		border: 1px solid #333;
		border-radius: 8px;
		padding: 1rem;
	}

	.legal-title {
		color: #ff6b6b;
		font-size: 1.1rem;
		font-weight: bold;
		margin: 0 0 0.75rem 0;
		border-bottom: 1px solid #444;
		padding-bottom: 0.5rem;
	}

	.legal-text {
		color: #cccccc;
		line-height: 1.5;
		font-size: 0.85rem;
	}


</style>