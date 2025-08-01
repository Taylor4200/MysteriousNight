export default {
	loader: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/loader/loader.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/loader/loader.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	// Loading screen assets
	loadingLogo: {
		type: 'sprite',
		src: new URL('../../assets/logo.png', import.meta.url).href,
		preload: true,
	},
	loadingBackground: {
		type: 'sprite',
		src: new URL('../../assets/loading_back.png', import.meta.url).href,
		preload: true,
	},
	loadingSpinner: {
		type: 'sprite',
		src: new URL('../../assets/splash_screen/loading.png', import.meta.url).href,
		preload: true,
	},
	pressToContinueText: {
		type: 'sprites',
		src: new URL('../../assets/sprites/pressToContinueText/MM_pressanywhere.json', import.meta.url).href,
		preload: true,
	},
	// Animation spritesheets
	ambient_bats: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/bats/Bats.json', import.meta.url).href,
	},
	// Symbol win animations
	wild_hit: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/wolf_icon/wolf_icon.json', import.meta.url).href,
	},
	queen_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/queen/queen.json', import.meta.url).href,
	},
	king_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/king/king.json', import.meta.url).href,
	},
	A_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/A/A.json', import.meta.url).href,
	},
	J_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/J/J.json', import.meta.url).href,
	},
	K_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/K/K.json', import.meta.url).href,
	},
	Q_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/Q/q.json', import.meta.url).href,
	},
	// Special effect animations
	bonus_tease: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/bats/Bats.json', import.meta.url).href,
	},
	big_win: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/flies/flies.json', import.meta.url).href,
	},
	// New PNG-based symbol assets
	H1: {
		type: 'sprite',
		src: new URL('../../assets/icons/wolf_icon.png', import.meta.url).href,
	},
	H2: {
		type: 'sprite',
		src: new URL('../../assets/icons/king.png', import.meta.url).href,
	},
	H3: {
		type: 'sprite',
		src: new URL('../../assets/icons/queen.png', import.meta.url).href,
	},
	H4: {
		type: 'sprite',
		src: new URL('../../assets/icons/A.png', import.meta.url).href,
	},
	L1: {
		type: 'sprite',
		src: new URL('../../assets/icons/J.png', import.meta.url).href,
	},
	L2: {
		type: 'sprite',
		src: new URL('../../assets/icons/A.png', import.meta.url).href,
	},
	L3: {
		type: 'sprite',
		src: new URL('../../assets/icons/K.png', import.meta.url).href,
	},
	L4: {
		type: 'sprite',
		src: new URL('../../assets/icons/Q.png', import.meta.url).href,
	},
	W: {
		type: 'sprite',
		src: new URL('../../assets/icons/wild.png', import.meta.url).href,
	},
	S: {
		type: 'sprite',
		src: new URL('../../assets/icons/bonus_symbol.png', import.meta.url).href,
	},
	// Background and UI assets
	background: {
		type: 'sprite',
		src: new URL('../../assets/main_game/back.png', import.meta.url).href,
		preload: true,
	},
	logo: {
		type: 'sprite',
		src: new URL('../../assets/main_game/logo.png', import.meta.url).href,
	},
	frameBack: {
		type: 'sprite',
		src: new URL('../../assets/main_game/frame_back.png', import.meta.url).href,
	},
	mainFrame: {
		type: 'sprite',
		src: new URL('../../assets/main_game/frame.png', import.meta.url).href,
	},
	fog: {
		type: 'sprite',
		src: new URL('../../assets/main_game/fog.png', import.meta.url).href,
	},
	spikes: {
		type: 'sprite',
		src: new URL('../../assets/main_game/spikes.png', import.meta.url).href,
	},
	spinButton: {
		type: 'sprite',
		src: new URL('../../assets/main_game/spin_up.png', import.meta.url).href,
	},
	spinButtonDown: {
		type: 'sprite',
		src: new URL('../../assets/main_game/spin_down.png', import.meta.url).href,
	},
	// Bonus game assets
	bonusGameBackground: {
		type: 'sprite',
		src: new URL('../../assets/png/bonus_game/bonus_game_back.png', import.meta.url).href,
		preload: true,
	},
	chestClosed: {
		type: 'sprite',
		src: new URL('../../assets/animations/chest_opening/chest_01.png', import.meta.url).href,
		preload: true,
	},
	chestOpened: {
		type: 'sprite',
		src: new URL('../../assets/animations/chest_opening/chest_23.png', import.meta.url).href,
		preload: true,
	},
	chestOpening: {
		type: 'spriteSheet',
		src: new URL('../../assets/animations/chest_opening/chest_opening.json', import.meta.url).href,
		preload: true,
	},
	// Keep existing non-symbol assets for now
	M: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols2/symbols2.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols2/M.json', import.meta.url).href,
			scale: 2,
		},
	},
	explosion: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/symbols3/symbols3.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/symbols3/explosion.json', import.meta.url).href,
			scale: 2,
		},
	},
	reelsFrame: {
		type: 'sprites',
		src: new URL('../../assets/sprites/reelsFrame/reels_frame.json', import.meta.url).href,
	},
	payFrame: {
		type: 'sprite',
		src: new URL('../../assets/sprites/payFrame/payFrame.png', import.meta.url).href,
	},
	anticipation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/anticipation/anticipation.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/anticipation/anticipation.json', import.meta.url).href,
			scale: 2,
		},
	},
	goldFont: {
		type: 'font',
		src: new URL('../../assets/fonts/goldFont/mm_gold.xml', import.meta.url).href,
	},
	goldBlur: {
		type: 'font',
		src: new URL('../../assets/fonts/goldBlur/miningfont_gold_blur.xml', import.meta.url).href,
	},
	silverFont: {
		type: 'font',
		src: new URL('../../assets/fonts/silverFont/mm_silver.xml', import.meta.url).href,
	},
	purpleFont: {
		type: 'font',
		src: new URL('../../assets/fonts/purpleFont/mm_purple.xml', import.meta.url).href,
	},
	bigwin: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/bigwin/big_wins.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/bigwin/mm_bigwin.json', import.meta.url).href,
			scale: 2,
		},
	},
	globalMultiplier: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/globalMultiplier/multiframe.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/globalMultiplier/multiframe.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsIntro: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_screen.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsIntroNumber: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_screen_number.json', import.meta.url).href,
			scale: 2,
		},
	},
	fsOutroNumber: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/fsIntro/fs_screen.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/fsIntro/fs_total_number.json', import.meta.url).href,
			scale: 2,
		},
	},
	foregroundAnimation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/foregroundAnimation/mm_bg.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/foregroundAnimation/mm_bg.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	foregroundFeatureAnimation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/foregroundFeatureAnimation/mm_bg_feature.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/foregroundFeatureAnimation/mm_bg_feature.json', import.meta.url).href,
			scale: 2,
		},
		preload: true,
	},
	tumble_multiplier: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/tumbleWin/tumble_win.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/tumbleWin/tumble_multiplier.json', import.meta.url).href,
			scale: 2,
		},
	},
	tumble_win: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/tumbleWin/tumble_win.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/tumbleWin/tumble_win.json', import.meta.url).href,
			scale: 2,
		},
	},
	reelhouse: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/reelhouse/reelhouse_glow.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/reelhouse/reelhouse_glow.json', import.meta.url).href,
			scale: 2,
		},
	},
	progressBar: {
		type: 'sprites',
		src: new URL('../../assets/sprites/progressBar/progressBar.json', import.meta.url).href,
		preload: true,
	},
	freeSpins: {
		type: 'sprites',
		src: new URL('../../assets/sprites/freeSpins/freeSpins.json', import.meta.url).href,
	},
	winSmall: {
		type: 'sprites',
		src: new URL('../../assets/sprites/winSmall/MM_Localisation_winsmall.json', import.meta.url).href,
	},
	clusterWin: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/clusterWin/clusterpay.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/clusterWin/clusterpay.json', import.meta.url).href,
			scale: 2,
		},
	},
	transition: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/transition/transition.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/transition/transition.json', import.meta.url).href,
			scale: 2,
		},
	},
	symbolsStatic: {
		type: 'sprites',
		src: new URL('../../assets/sprites/symbolsStatic/symbolsStatic.json', import.meta.url).href,
	},
	coins: {
		type: 'spriteSheet',
		src: new URL('../../assets/sprites/coin/SD2_Coin.json', import.meta.url).href,
	},
	sound: {
		type: 'audio',
		src: new URL('../../assets/audio/sounds.json', import.meta.url).href,
		preload: true,
	},
	// Scatter/bonus symbol animation
	scatterBonusAnimation: {
		type: 'spine',
		src: {
			atlas: new URL('../../assets/spines/bonusSymbol/bonusSymbol.atlas', import.meta.url).href,
			skeleton: new URL('../../assets/spines/bonusSymbol/bonusSymbol.json', import.meta.url).href,
			scale: 1,
		},
		preload: true,
	},
} as const;
