import * as PIXI from 'pixi.js';

export type ParallaxLayerKey = 'bg1_sky' | 'bg1_background' | 'bg1_styling1' | 'bg1_styling2' | 'bg1_floor';

export type ParallaxConfig = Partial<Record<ParallaxLayerKey, number>>;

export type ParallaxSprites = Partial<Record<ParallaxLayerKey, PIXI.TilingSprite>>;

export type ParallaxTextures = Partial<Record<ParallaxLayerKey, PIXI.Texture>>;

type Overrides = Partial<Record<ParallaxLayerKey, { offsetX?: number; offsetY?: number; scaleX?: number; scaleY?: number }>>;

export class ParallaxManager {
  private container: PIXI.Container;
  private layers: ParallaxSprites = {};
  private factors: Record<ParallaxLayerKey, number>;
  private layout = { x: 0, y: 0, width: 0, height: 0 };
  private overrides: Overrides = {};
  private globalScaleX = 1;
  private globalScaleY = 1;

  constructor({ container, layout, textures, overrides, config, globalScaleX = 1, globalScaleY = 1 }: { container: PIXI.Container; layout: { x: number; y: number; width: number; height: number }; textures: ParallaxTextures; overrides?: Overrides; config?: ParallaxConfig; globalScaleX?: number; globalScaleY?: number }) {
    this.container = container;
    this.layout = layout;
    this.overrides = overrides ?? {};
    this.globalScaleX = globalScaleX;
    this.globalScaleY = globalScaleY;

    const defaultConfig: Record<ParallaxLayerKey, number> = {
      bg1_sky: 0.05,
      bg1_background: 0.25,
      bg1_styling1: 0.45,
      bg1_styling2: 0.45,
      bg1_floor: 1.0,
    };
    this.factors = { ...defaultConfig, ...(config ?? {}) } as Record<ParallaxLayerKey, number>;

    this.rebuild(textures);
  }

  public setLayout(layout: { x: number; y: number; width: number; height: number }, globalScaleX = 1, globalScaleY = 1): void {
    this.layout = layout;
    this.globalScaleX = globalScaleX;
    this.globalScaleY = globalScaleY;
    this.resizeToLayout();
  }

  public rebuild(textures: ParallaxTextures): void {
    this.container.removeChildren();
    this.layers = {};

    const orderedKeys: ParallaxLayerKey[] = ['bg1_sky', 'bg1_background', 'bg1_styling2', 'bg1_styling1', 'bg1_floor'];
    for (const key of orderedKeys) {
      const tex = textures[key];
      if (!tex) continue;
      if (tex.baseTexture) tex.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      const sprite = new PIXI.TilingSprite(tex, 10, 10);
      sprite.anchor.set(0.5);
      sprite.zIndex = orderedKeys.indexOf(key);
      this.layers[key] = sprite;
      this.container.addChild(sprite);
    }

    this.resizeToLayout();
  }

  private resizeToLayout(): void {
    for (const k in this.layers) {
      const key = k as ParallaxLayerKey;
      const s = this.layers[key]!;
      const ov = this.overrides[key] ?? {};
      s.x = this.layout.x + (ov.offsetX ?? 0);
      s.y = this.layout.y + (ov.offsetY ?? 0);
      s.width = this.layout.width * (ov.scaleX ?? 1) * this.globalScaleX;
      s.height = this.layout.height * (ov.scaleY ?? 1) * this.globalScaleY;
    }
  }

  public update(cameraWorldX: number): void {
    for (const k in this.layers) {
      const key = k as ParallaxLayerKey;
      const layer = this.layers[key]!;
      const factor = this.factors[key] ?? 1.0;
      layer.tilePosition.x = -cameraWorldX * factor;
    }
  }

  public setLayerVisible(key: ParallaxLayerKey, visible: boolean): void {
    const s = this.layers[key];
    if (s) s.visible = visible;
  }
}


