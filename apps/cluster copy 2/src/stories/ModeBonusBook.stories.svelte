<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MODE_BONUS/book',
	});
</script>

<script lang="ts">
	import {
		StoryGameTemplate,
		StoryLocale,
		type TemplateArgs,
		templateArgs,
	} from 'components-storybook';
	import { randomInteger } from 'utils-shared/random';

	import Game from '../components/Game.svelte';
  import { setContext } from '../game/context';
  import { playRunnerFromBook } from '../game/utils';
  import runnerBonusBooks from './data/runner_bonus_books';

	setContext();
</script>

{#snippet template(args: TemplateArgs<any>)}
	<StoryGameTemplate
		skipLoadingScreen={args.skipLoadingScreen}
		action={async () => {
			await args.action?.(args.data);
		}}
	>
		<StoryLocale lang="en">
			<Game />
		</StoryLocale>
	</StoryGameTemplate>
{/snippet}

<Story
  name="runner-bonus (action button)"
  args={templateArgs({
    skipLoadingScreen: true,
    data: {},
    action: async () => {
      const index = randomInteger({ min: 0, max: runnerBonusBooks.length - 1 });
      const data = runnerBonusBooks[index];
      await playRunnerFromBook({ ...data, state: data.events } as any);
    },
  })}
  {template}
/>
