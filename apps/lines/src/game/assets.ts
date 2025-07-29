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
		src: '/assets/logo.png',
		preload: true,
	},
	loadingBackground: {
		type: 'sprite',
		src: '/assets/loading_back.png',
		preload: true,
	},
	loadingSpinner: {
		type: 'sprite',
		src: '/assets/splash_screen/loading.png',
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
		src: '/assets/animations/bats/Bats.json',
	},
	// Symbol win animations
	wild_hit: {
		type: 'spriteSheet',
		src: '/assets/animations/wolf_icon/wolf_icon.json',
	},
	queen_win: {
		type: 'spriteSheet',
		src: '/assets/animations/queen/queen.json',
	},
	king_win: {
		type: 'spriteSheet',
		src: '/assets/animations/king/king.json',
	},
	A_win: {
		type: 'spriteSheet',
		src: '/assets/animations/A/A.json',
	},
	J_win: {
		type: 'spriteSheet',
		src: '/assets/animations/J/J.json',
	},
	K_win: {
		type: 'spriteSheet',
		src: '/assets/animations/K/K.json',
	},
	Q_win: {
		type: 'spriteSheet',
		src: '/assets/animations/Q/q.json', // Fixed: lowercase filename
	},
	// Special effect animations
	bonus_tease: {
		type: 'spriteSheet',
		src: '/assets/animations/bats/Bats.json',
	},
	big_win: {
		type: 'spriteSheet',
		src: '/assets/animations/flies/flies.json',
	},
	// New PNG-based symbol assets
	H1: {
		type: 'sprite',
		src: '/assets/icons/wolf_icon.png',
	},
	H2: {
		type: 'sprite',
		src: '/assets/icons/king.png',
	},
	H3: {
		type: 'sprite',
		src: '/assets/icons/queen.png',
	},
	H4: {
		type: 'sprite',
		src: '/assets/icons/A.png', // Fixed: Use existing A.png instead of non-existent 10.png
	},
	L1: {
		type: 'sprite',
		src: '/assets/icons/J.png',
	},
	L2: {
		type: 'sprite',
		src: '/assets/icons/A.png',
	},
	L3: {
		type: 'sprite',
		src: '/assets/icons/K.png',
	},
	L4: {
		type: 'sprite',
		src: '/assets/icons/Q.png',
	},
	W: {
		type: 'sprite',
		src: '/assets/icons/wild.png',
	},
	S: {
		type: 'sprite',
		src: '/assets/icons/wolf_icon.png', // Fixed: Use existing wolf_icon.png instead of non-existent scatter.png
	},
	// Special effect assets
	// Background and UI assets
	background: {
		type: 'sprite',
		src: '/assets/main_game/back.png',
	},
	logo: {
		type: 'sprite',
		src: '/assets/main_game/logo.png',
	},
	frameBack: {
		type: 'sprite',
		src: '/assets/main_game/frame_back.png',
	},
	mainFrame: {
		type: 'sprite',
		src: '/assets/main_game/frame.png',
	},
	fog: {
		type: 'sprite',
		src: '/assets/main_game/fog.png',
	},
	spikes: {
		type: 'sprite',
		src: '/assets/main_game/spikes.png',
	},
	spinButton: {
		type: 'sprite',
		src: '/assets/main_game/spin_up.png',
	},
	spinButtonDown: {
		type: 'sprite',
		src: '/assets/main_game/spin_down.png',
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
} as const;
