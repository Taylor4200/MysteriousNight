<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'MODE_BASE/book',
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
    import { playBet, playRunnerFake, playRunnerFromBook } from '../game/utils';
    import runnerBaseBooks from './data/runner_base_books';
    import runnerMaxBook from './data/runner_max_book';
    import runnerBonusBooks from './data/runner_bonus_books';
	import books from './data/base_books';

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
    name="random"
	args={templateArgs({
		skipLoadingScreen: true,
		data: {},
        action: async () => {
            // Random base runner book (no special max chance)
            const index = randomInteger({ min: 0, max: runnerBaseBooks.length - 1 });
            const data = runnerBaseBooks[index];
            await playRunnerFromBook({ ...data, state: data.events } as any);
        },
	})}
	{template}
/>

<Story
  name="runner fake (action button)"
  args={templateArgs({
    skipLoadingScreen: true,
    data: {},
    action: async () => {
      // Drive the runner by playing a random runner-base book using the runner pipeline
      const index = randomInteger({ min: 0, max: runnerBaseBooks.length - 1 });
      const data = runnerBaseBooks[index];
      await playRunnerFromBook({ ...data, state: data.events } as any);
    },
  })}
  {template}
/>

<Story
  name="runner MAX 7500x"
  args={templateArgs({
    skipLoadingScreen: true,
    data: {},
    action: async () => {
      await playRunnerFromBook({ ...runnerMaxBook, state: runnerMaxBook.events } as any);
    },
  })}
  {template}
/>

<Story
  name="mode_bonus (runner-bonus)"
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
