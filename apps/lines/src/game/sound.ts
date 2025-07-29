import { createSound } from 'utils-sound';

export type MusicName =
	| 'Basegame_music'
	| 'Freespin_music'
	| 'WinLevel-Nice'
	| 'WinLevel-Substantial'
	| 'WinLevel_Small';

export type SoundEffectName =
	| 'AnticipationStart'
	| 'Anticipation'
	| 'CoinLoopBigWins'
	| 'BtnGeneral'
	| 'Spin'
	| 'FsRespin'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Big_Hit'
	| 'Wild_Drop'
	| 'Reel1'
	| 'Reel1'
	| 'Reel1'
	| 'Reel1'
	| 'Reel1'
	| 'Wild_Drop'
	| 'ScatterReveal'
	| 'Scatterstop1'
	| 'Scatterstop2'
	| 'Scatterstop3'
	| 'Scatterstop4'
	| 'Scatterstop5'
	| 'ScatterWin'
	| 'ScatterWinV2'
	| 'FsRespin'
	| 'Wild_Drop'
	| 'Wild_Drop'
	| 'WinLevel-Nice'
	| 'WinLevel-Nice'
	| 'WinLevel_Small'
	| 'WinLevel_Small'
	| 'WinLevel-Substantial'
	| 'Sfx-You-Won-Panel'
	| 'Small_Hit'
	| 'Small_Hit'
	| 'Small_Hit'
	| 'Small_Hit'
	| 'Small_Hit';

export type SoundName = MusicName | SoundEffectName;

const sound = createSound<SoundName>();

export { sound };
