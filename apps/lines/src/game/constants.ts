import _ from 'lodash';

import type { RawSymbol, SymbolState } from './types';

export const SYMBOL_SIZE = 120;

export const REEL_PADDING = 0.54; // Reduced from 0.53 to fix first reel spacing

// initial board (padded top and bottom)
export const INITIAL_BOARD: RawSymbol[][] = [
	[
		{
			name: 'L2',
		},
		{
			name: 'L1',
		},
		{
			name: 'L4',
		},
		{
			name: 'H2',
		},
		{
			name: 'L1',
		},
	],
	[
		{
			name: 'H1',
		},
		{
			name: 'L1',
		},
		{
			name: 'L2',
		},
		{
			name: 'H3',
		},
		{
			name: 'L4',
		},
	],
	[
		{
			name: 'L3',
		},
		{
			name: 'L2',
		},
		{
			name: 'L3',
		},
		{
			name: 'H4',
		},
		{
			name: 'L4',
		},
	],
	[
		{
			name: 'H4',
		},
		{
			name: 'H3',
		},
		{
			name: 'L4',
		},
		{
			name: 'L3',
		},
		{
			name: 'L1',
		},
	],
	[
		{
			name: 'H3',
		},
		{
			name: 'L3',
		},
		{
			name: 'L3',
		},
		{
			name: 'H1',
		},
		{
			name: 'H1',
		},
	],
];

export const BOARD_DIMENSIONS = { x: INITIAL_BOARD.length, y: INITIAL_BOARD[0].length - 2 };

export const BOARD_SIZES = {
	width: SYMBOL_SIZE * BOARD_DIMENSIONS.x,
	height: SYMBOL_SIZE * BOARD_DIMENSIONS.y,
};

export const BACKGROUND_RATIO = 2039 / 1000;
export const PORTRAIT_BACKGROUND_RATIO = 1242 / 2208;
const PORTRAIT_RATIO = 800 / 1422;
const LANDSCAPE_RATIO = 1600 / 900;
const DESKTOP_RATIO = 1422 / 800;

const DESKTOP_HEIGHT = 800;
const LANDSCAPE_HEIGHT = 900;
const PORTRAIT_HEIGHT = 1422;
export const DESKTOP_MAIN_SIZES = { width: DESKTOP_HEIGHT * DESKTOP_RATIO, height: DESKTOP_HEIGHT };
export const LANDSCAPE_MAIN_SIZES = {
	width: LANDSCAPE_HEIGHT * LANDSCAPE_RATIO,
	height: LANDSCAPE_HEIGHT,
};
export const PORTRAIT_MAIN_SIZES = {
	width: PORTRAIT_HEIGHT * PORTRAIT_RATIO,
	height: PORTRAIT_HEIGHT,
};

export const HIGH_SYMBOLS = ['H1', 'H2', 'H3', 'H4']; // Fixed: Removed H5

export const INITIAL_SYMBOL_STATE: SymbolState = 'static';

const HIGH_SYMBOL_SIZE = 0.9;
const LOW_SYMBOL_SIZE = 0.9;
const SPECIAL_SYMBOL_SIZE = 1;

const SPIN_OPTIONS_SHARED = {
	reelBounceBackSpeed: 0.15,
	reelSpinSpeedBeforeBounce: 4,
	reelPaddingMultiplierNormal: 1.2,
	reelPaddingMultiplierAnticipated: 10,
	reelSpinDelay: 145,
};

export const SPIN_OPTIONS_DEFAULT = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 2,
	reelSpinSpeed: 3,
	reelBounceSizeMulti: 0.3,
};

export const SPIN_OPTIONS_FAST = {
	...SPIN_OPTIONS_SHARED,
	reelPreSpinSpeed: 5,
	reelSpinSpeed: 5,
	reelBounceSizeMulti: 0.05,
};

export const MOTION_BLUR_VELOCITY = 31;

export const zIndexes = {
	background: {
		backdrop: -3,
		normal: -2,
		feature: -1,
	},
};

const explosion = {
	type: 'animated', // Fixed: Reverted back to animated since big_win is available
	animationType: 'big_win',
	sizeRatios: { width: 1, height: 1 },
};

const h1Static = { type: 'sprite', assetKey: 'H1', sizeRatios: { width: 1, height: 1 } };
const h2Static = { type: 'sprite', assetKey: 'H2', sizeRatios: { width: 1, height: 1 } };
const h3Static = { type: 'sprite', assetKey: 'H3', sizeRatios: { width: 1, height: 1 } };
const h4Static = { type: 'sprite', assetKey: 'H4', sizeRatios: { width: 1, height: 1 } };
// Removed: h5Static definition

const l1Static = { type: 'sprite', assetKey: 'L1', sizeRatios: { width: 1, height: 1 } };
const l2Static = { type: 'sprite', assetKey: 'L2', sizeRatios: { width: 1, height: 1 } };
const l3Static = { type: 'sprite', assetKey: 'L3', sizeRatios: { width: 1, height: 1 } };
const l4Static = { type: 'sprite', assetKey: 'L4', sizeRatios: { width: 1, height: 1 } };

const sStatic = { type: 'sprite', assetKey: 'S', sizeRatios: { width: 1.243, height: 1.243 } };
const wStatic = { type: 'sprite', assetKey: 'W', sizeRatios: { width: 1.12, height: 1.12 } };

const wSizeRatios = { width: 1.5 * 0.9, height: SPECIAL_SYMBOL_SIZE * 1.15 };
const sSizeRatios = { width: 2.5, height: SPECIAL_SYMBOL_SIZE * 2.3 };

export const SYMBOL_INFO_MAP = {
	H1: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'wild_hit',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for proper display
		},
		postWinStatic: h1Static,
		static: h1Static,
		spin: h1Static,
		land: h1Static,
	},
	H2: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'king_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for proper display
		},
		postWinStatic: h2Static,
		static: h2Static,
		spin: h2Static,
		land: h2Static,
	},
	H3: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'queen_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for proper display
		},
		postWinStatic: h3Static,
		static: h3Static,
		spin: h3Static,
		land: h3Static,
	},
	H4: {
		explosion,
		win: {
			type: 'sprite',
			assetKey: 'H4',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for proper display
		},
		postWinStatic: h4Static,
		static: h4Static,
		spin: h4Static,
		land: h4Static,
	},
	L1: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'J_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for card symbols
		},
		postWinStatic: l1Static,
		static: l1Static,
		spin: l1Static,
		land: l1Static,
	},
	L2: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'A_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for card symbols
		},
		postWinStatic: l2Static,
		static: l2Static,
		spin: l2Static,
		land: l2Static,
	},
	L3: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'K_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for card symbols
		},
		postWinStatic: l3Static,
		static: l3Static,
		spin: l3Static,
		land: l3Static,
	},
	L4: {
		explosion,
		win: {
			type: 'animated',
			animationType: 'Q_win',
			sizeRatios: { width: 1, height: 1 }, // Fixed: Much smaller for card symbols
		},
		postWinStatic: l4Static,
		static: l4Static,
		spin: l4Static,
		land: l4Static,
	},

	W: {
		explosion,
		postWinStatic: wStatic,
		static: wStatic,
		spin: wStatic,
		win: wStatic, // Changed from animated to static - W stays static during wins
		land: wStatic, // Fixed: Use static sprite for smooth reel mechanics
	},
	S: {
		explosion,
		postWinStatic: sStatic,
		static: sStatic,
		spin: sStatic,
		win: { type: 'sprite', assetKey: 'S', sizeRatios: { width: 1, height: 1 } },
		land: sStatic, // Fixed: Use static sprite for smooth reel mechanics
	},
} as const;

export const SCATTER_LAND_SOUND_MAP = {
	1: 'Scatterstop1',
	2: 'Scatterstop2',
	3: 'Scatterstop3',
	4: 'Scatterstop4',
	5: 'Scatterstop5',
} as const;
