const DEFAULT_BET_MODE_META = {
	BASE: {
		mode: 'BASE',
		costMultiplier: 1.0,
		type: 'default',
		parent: '',
		children: '',
		assets: {
			icon: '',
			dialogImage: '',
			dialogVolatility: '',
			volatility: '',
			button: '',
		},
		text: {
			title: '',
			dialog: '',
			button: '',
			betAmountLabel: '',
			tickerIdle: '',
			tickerSpin: '',
			bannerText: '',
		},
		maxWin: 8888,
	},
	BONUS: {
		mode: 'BONUS',
		costMultiplier: 100,
		type: 'buy',
		parent: '',
		children: '',
		assets: {
			icon: 'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_9_97/betModes/icon_bonusbuy.webp',
			dialogImage:
				'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_9_97/betModes/bonus_image.webp',
			dialogVolatility:
				'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_9_97/betModes/volatility/volatility_04.webp',
			volatility:
				'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_9_97/betModes/volatility/volatility_white_04.webp',
			button:
				'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_8_97/betModes/button_buy.webp',
		},
		text: {
			title: 'Lunar Loot',
			dialog:
				' Activates the Lunar Loot feature for 100x your bet. Increased chance for wild symbols to land with multipliers. Provides 8 free spins.',
			description: 'FREE SPINS with a higher frequency of wild symbols appearing with random multipliers. 8 free spins',
			button: 'BUY',
			tickerIdle: 'PLACE YOUR BET',
			tickerSpin: 'LUNAR LOOT BUY ACTIVATED',
			bannerText: 'example banner text',
		},
	},
};

const DEFAULT_GAME_RULE_META = {
	payTable: [
		{
			containers: [
				{
					title: 'WILD SYMBOL',
					text: 'The Wild symbol substitutes all other symbols except Scatter.',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 0,
					column: 0,
				},
				{
					title: 'FREE SPINS',
						text: 'Free Spins are awarded via the Lunar Loot Bonus. This feature provides 8 Free Spins.',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 1,
					column: 0,
				},
				{
					title: 'FREE SPINS RETRIGGER',
					text: 'During FREE SPINS, Scatter Symbols are on all reels. If at least 3 Scatters land in a spin sequence, additional FREE SPINS rounds are triggered. 3 Scatters award 4 additional FREE SPINS. 4 Scatters award 6 additional FREE SPINS. 5 Scatters award 8 additional FREE SPINS. ',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 2,
					column: 0,
				},
			],
			rows: 3,
			columns: 1,
			title: 'PAYTABLE',
		},
		{
			containers: [
				{
					title: '',
					text: '5	|	10x\n4	|	5x\n3	|	2x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 0,
					column: 0,
				},
				{
					title: '',
					text: '5	|	5x\n4	|	2x\n3	|	1x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 0,
					column: 1,
				},
				{
					title: '',
					text: '5	|	5x\n4	|	2x\n3	|	1x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 0,
					column: 2,
				},
				{
					title: '',
					text: '5	|	3x\n4	|	1x\n3	|	0.5x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 1,
					column: 0,
				},
				{
					title: '',
					text: '5	|	3x\n4	|	1x\n3	|	0.5x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 1,
					column: 1,
				},
				{
					title: '',
					text: '5	|	2x\n4	|	0.8x\n3	|	0.4x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 3,
					column: 0,
				},
				{
					title: '',
					text: '5	|	2x\n4	|	0.8x\n3	|	0.4x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 3,
					column: 1,
				},
				{
					title: '',
					text: '5	|	1.5x\n4	|	0.5x\n3	|	0.2x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 3,
					column: 2,
				},
				{
					title: '',
					text: '5	|	1.5x\n4	|	0.5x\n3	|	0.2x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 4,
					column: 0,
				},
				{
					title: '',
					text: '5	|	1x\n4	|	0.3x\n3	|	0.1x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 4,
					column: 1,
				},
				{
					title: '',
					text: '5	|	1x\n4	|	0.3x\n3	|	0.1x\n',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/wild.ac78fbf6.png',
					imagePosition: 'left',
					row: 4,
					column: 2,
				},
			],
			rows: 5,
			columns: 3,
			title: 'SYMBOLS',
		},
		{
			containers: [
				{
					title: '',
					text: 'All symbols pay from left to right. Starting from the left most reel. Only symbols on adjacent reels will be a valid win way. This does not apply to Scatter. ',
					image: 'https://staging-1-0.twist-game.app/_app/immutable/assets/winWays.be45a8a4.png',
					imagePosition: 'top',
					row: 0,
					column: 0,
				},
			],
			rows: 1,
			columns: 1,
			title: 'WIN WAYS',
		},
	],
	gameRules: [
		{
			containers: [
				{
					title: 'GAME OVERVIEW',
					text: 'This is a 5-reel, 3-row slot game with 20 fixed paylines. Wins are paid from left to right, starting from the leftmost reel. Only winning combinations on adjacent reels are valid.\n\nThe game features Wild symbols, Scatter symbols, and various bonus features including Free Spins and multiplier wilds.',
					image: '',
					imagePosition: 'top',
					row: 0,
					column: 0,
				},
				{
					title: 'WILD SYMBOL',
					text: 'The Wild symbol substitutes for all other symbols except Scatter symbols to create winning combinations. Wild symbols can appear on all reels and may carry random multipliers from 2x to 100x.\n\nWhen a Wild symbol is part of a winning combination, the win is multiplied by the Wild\'s multiplier value.',
					image: '',
					imagePosition: 'left',
					row: 1,
					column: 0,
				},
				// Scatter section removed
			],
			rows: 3,
			columns: 1,
			title: 'GAME RULES',
		},
		{
			containers: [
				{
					title: 'LUNAR LOOT BONUS',
					text: 'The Lunar Loot Bonus can be purchased for 100x your base bet. This bonus provides 8 Free Spins with enhanced Wild symbol frequency and random multipliers.',
					image: 'https://test-fart-cdn-bucket.s3.ap-southeast-2.amazonaws.com/1_9_97/betModes/icon_bonusbuy.webp',
					imagePosition: 'left',
					row: 0,
					column: 0,
				},
			],
			rows: 1,
			columns: 1,
			title: 'BONUS FEATURES',
		},

		{
			containers: [
				{
					title: '',
					text: 'Theoretical Return to Player (RTP):\n\n• Base Game: 95.2%\n• Lunar Loot Bonus: 94.7%\n\nMaximum Win: 10,000x base bet',
					image: '',
					imagePosition: 'top',
					row: 0,
					column: 0,
				},
			],
			rows: 1,
			columns: 1,
			title: 'GAME INFORMATION',
		},
		{
			containers: [
				{
					title: 'RESPONSIBLE GAMING',
					text: 'Gambling should be entertaining and not a way to make money. Please gamble responsibly.\n\n• Set time and money limits before you start playing\n• Never chase your losses\n• Take regular breaks\n• Don\'t gamble if you\'re upset, angry, or depressed\n• Only gamble with money you can afford to lose\n\nIf you or someone you know has a gambling problem, help is available:\n\nUK: 0808 8020 133 (GamCare)\nIreland: 1800 936 725 (Gambling Awareness Trust)\nCanada: 1-866-531-2600 (ConnexOntario)\nAustralia: 1800 858 858 (Gambling Help Online)\nNew Zealand: 0800 654 655 (Gambling Helpline)\nSouth Africa: 0800 006 008 (National Responsible Gambling Programme)\n\nFor more information and support, visit: www.begambleaware.org',
					image: '',
					imagePosition: 'top',
					row: 0,
					column: 0,
				},
				{
					title: 'LEGAL DISCLAIMER',
					text: 'Malfunction voids all pays and plays. A consistent internet connection is required. In the event of a disconnection, reload the game to finish any uncompleted bets. The theoretical expected return is calculated over many spins. Movement of reels are not representative of any physical device, and is for illustrative purposes only.\n\nThis game is for entertainment purposes only. Gambling can be addictive. Please play responsibly.\n\nTM and © 2025 ZeroEdge Studios.',
					image: '',
					imagePosition: 'top',
					row: 1,
					column: 0,
				},
			],
			rows: 2,
			columns: 1,
			title: 'LEGAL NOTICE',
		},

	],
	splashScreen: [],
};

export { DEFAULT_BET_MODE_META, DEFAULT_GAME_RULE_META };
