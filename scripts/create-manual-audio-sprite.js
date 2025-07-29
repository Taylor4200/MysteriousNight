#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = './static/assets/audio';
const SPRITE_NAME = 'sounds';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Manual timing mapping (you'll need to fill this in from Audacity)
// Format: [startTimeInSeconds, durationInSeconds]
const manualMapping = {
  "Anticipation": [0, 9.37],
  "AnticipationStart": [11, 2.24],
  "Basegame_music": [15, 177.11],
  "BetDown": [194, 0.44],
  "BetUp": [196, 0.44],
  "Big_Hit": [198, 0.55],
  "BtnGeneral": [200, 2.26],
  "CoinLoopBigWins": [204, 18.56],
  "DeadSpin": [224, 0.31],
  "End-Game-Loop": [226, 7.30],
  "Endgame_start": [235, 4.78],
  "Freespin_music": [241, 128.44],
  "FsRespin": [371, 5.87],
  "PayTicks": [378, 1.07],
  "Reel1": [381, 1.81],
  "ScatterReveal": [384, 2.80],
  "ScatterWin": [388, 2.66],
  "ScatterWinV2": [392, 4.97],
  "Scatterstop1": [398, 2.44],
  "Scatterstop2": [402, 2.30],
  "Scatterstop3": [406, 2.89],
  "Scatterstop4": [410, 2.80],
  "Scatterstop5": [414, 1.94],
  "Sfx-You-Won-Panel": [417, 3.84],
  "Small_Hit": [422, 0.55],
  "Spin-Turbo": [424, 0.34],
  "Spin": [426, 0.51],
  "Turbo-Toggle": [428, 0.03],
  "Wild_Drop": [430, 0.55],
  "WinLevel-Nice": [432, 2.71],
  "WinLevel-Substantial": [436, 3.70],
  "WinLevel_Small": [441, 2.75]
};

// Convert to milliseconds for Howler.js
const spriteData = {
  urls: [],
  sprite: {}
};

Object.entries(manualMapping).forEach(([name, [start, duration]]) => {
  spriteData.sprite[name] = [
    Math.round(start * 1000), // Convert to milliseconds
    Math.round(duration * 1000) // Convert to milliseconds
  ];
});

// Add src paths
spriteData.src = [
  `./assets/audio/${SPRITE_NAME}.mp3`,
  `./assets/audio/${SPRITE_NAME}.ogg`,
  `./assets/audio/${SPRITE_NAME}.m4a`,
  `./assets/audio/${SPRITE_NAME}.ac3`
];

// Write the JSON file
const jsonPath = path.join(OUTPUT_DIR, `${SPRITE_NAME}.json`);
fs.writeFileSync(jsonPath, JSON.stringify(spriteData, null, 2));

console.log('✅ Manual audio sprite mapping created!');
console.log(`📁 Output: ${jsonPath}`);
console.log('');
console.log('📋 Next steps:');
console.log('   1. Export your Audacity project as a single MP3 file');
console.log('   2. Save it as: static/assets/audio/sounds.mp3');
console.log('   3. Update the timing values in this script if needed');
console.log('   4. The sprite map is ready to use in your game');
console.log('');
console.log('💡 To get exact timing from Audacity:');
console.log('   - Select each sound region');
console.log('   - Note the start time (in seconds)');
console.log('   - Note the duration (in seconds)');
console.log('   - Update the manualMapping object above'); 