#!/usr/bin/env python3
import os
import json
from PIL import Image

def create_spritesheet():
    # Configuration
    frame_width = 468
    frame_height = 534
    frames = 30
    cols = 6  # 6x5 grid for 30 frames
    rows = 5
    
    # Paths
    input_dir = "apps/lines/static/assets/animations/bats"
    output_dir = "apps/lines/static/assets/spritesheets"
    spritesheet_path = os.path.join(output_dir, "bats_spritesheet.png")
    json_path = os.path.join(output_dir, "bats_spritesheet.json")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Create spritesheet image
    spritesheet_width = cols * frame_width
    spritesheet_height = rows * frame_height
    spritesheet = Image.new('RGBA', (spritesheet_width, spritesheet_height), (0, 0, 0, 0))
    
    # JSON data for PIXI.js
    frames_data = {}
    animations_data = {"bats": []}
    
    # Process each frame
    for i in range(frames):
        frame_filename = f"bats_{i:02d}.png"
        frame_path = os.path.join(input_dir, frame_filename)
        
        if not os.path.exists(frame_path):
            print(f"Warning: {frame_path} not found, skipping...")
            continue
            
        # Load frame image
        frame_img = Image.open(frame_path)
        
        # Calculate position in spritesheet
        col = i % cols
        row = i // cols
        x = col * frame_width
        y = row * frame_height
        
        # Paste frame into spritesheet
        spritesheet.paste(frame_img, (x, y))
        
        # Create frame data for JSON
        frame_name = f"bats_{i:02d}.png"
        frames_data[frame_name] = {
            "frame": {"x": x, "y": y, "w": frame_width, "h": frame_height},
            "sourceSize": {"w": frame_width, "h": frame_height},
            "spriteSourceSize": {"x": 0, "y": 0, "w": frame_width, "h": frame_height}
        }
        animations_data["bats"].append(frame_name)
        
        print(f"Added frame {i}: {frame_filename} at ({x}, {y})")
    
    # Save spritesheet image
    spritesheet.save(spritesheet_path, "PNG")
    print(f"Spritesheet saved: {spritesheet_path}")
    
    # Create JSON file for PIXI.js
    json_data = {
        "frames": frames_data,
        "animations": animations_data,
        "meta": {
            "format": "RGBA8888",
            "size": {"w": spritesheet_width, "h": spritesheet_height},
            "scale": 1
        }
    }
    
    with open(json_path, 'w') as f:
        json.dump(json_data, f, indent=2)
    print(f"JSON data saved: {json_path}")
    
    print(f"\nSpritesheet created successfully!")
    print(f"Size: {spritesheet_width}x{spritesheet_height}")
    print(f"Frames: {len(frames_data)}")
    
if __name__ == "__main__":
    create_spritesheet() 