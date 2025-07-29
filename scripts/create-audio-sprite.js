#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const INPUT_DIR = './assets/audio/individual';
const OUTPUT_DIR = './static/assets/audio';
const SPRITE_NAME = 'sounds';

// Check if audiosprite is installed
try {
  execSync('which audiosprite', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ AudioSprite not found. Install it first:');
  console.error('npm install -g audiosprite');
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Get all audio files from input directory
const audioFiles = fs.readdirSync(INPUT_DIR)
  .filter(file => /\.(mp3|wav|ogg|m4a)$/i.test(file))
  .map(file => path.join(INPUT_DIR, file));

if (audioFiles.length === 0) {
  console.error('❌ No audio files found in', INPUT_DIR);
  process.exit(1);
}

console.log('🎵 Found audio files:', audioFiles.length);

// Create audio sprite
try {
  // Use the correct AudioSprite command syntax
  const command = `audiosprite ${audioFiles.join(' ')} -o ${path.join(OUTPUT_DIR, SPRITE_NAME)} --format howler --export json`;
  console.log('🔄 Creating audio sprite...');
  console.log('Command:', command);
  execSync(command, { stdio: 'inherit' });
  
  // Check if files were created
  const oggFile = path.join(OUTPUT_DIR, `${SPRITE_NAME}.ogg`);
  const jsonFile = path.join(OUTPUT_DIR, `${SPRITE_NAME}.json`);
  
  if (fs.existsSync(oggFile)) {
    console.log('✅ Audio sprite file created:', oggFile);
  } else {
    console.log('⚠️  Audio sprite file not found, checking for other formats...');
  }
  
  if (fs.existsSync(jsonFile)) {
    console.log('✅ JSON sprite map created:', jsonFile);
  }
  
  // List all created files
  const createdFiles = fs.readdirSync(OUTPUT_DIR).filter(file => file.startsWith(SPRITE_NAME));
  console.log('📁 Created files:', createdFiles);
  
} catch (error) {
  console.error('❌ Error creating audio sprite:', error.message);
  process.exit(1);
}

// Update the JSON file to match your project structure
const spriteJsonPath = path.join(OUTPUT_DIR, `${SPRITE_NAME}.json`);
if (fs.existsSync(spriteJsonPath)) {
  const spriteData = JSON.parse(fs.readFileSync(spriteJsonPath, 'utf8'));

  // Update src paths to match your project
  spriteData.src = [
    `./assets/audio/${SPRITE_NAME}.ogg`,
    `./assets/audio/${SPRITE_NAME}.m4a`,
    `./assets/audio/${SPRITE_NAME}.mp3`,
    `./assets/audio/${SPRITE_NAME}.ac3`
  ];

  fs.writeFileSync(spriteJsonPath, JSON.stringify(spriteData, null, 2));
  console.log('✅ Updated JSON file with correct paths');
}

console.log('🎉 Audio sprite creation complete!');
console.log('📋 Next steps:');
console.log('   1. Place your individual audio files in', INPUT_DIR);
console.log('   2. Run this script again to update the sprite');
console.log('   3. The sprite map is ready to use in your game'); 