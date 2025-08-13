export class Camera {
  private viewportWidth: number;
  private deadZonePercent: number;
  private lerpAlpha: number;

  private cameraWorldX: number = 0;
  private targetWorldX: number = 0;

  constructor({ viewportWidth, deadZonePercent = 0.3, lerpAlpha = 0.12 }: { viewportWidth: number; deadZonePercent?: number; lerpAlpha?: number }) {
    this.viewportWidth = viewportWidth;
    this.deadZonePercent = deadZonePercent;
    this.lerpAlpha = lerpAlpha;
  }

  public setViewportWidth(width: number): void {
    this.viewportWidth = width;
  }

  public setTarget(worldX: number): void {
    this.targetWorldX = worldX;
  }

  // Horizontal follow only with dead-zone and lerp smoothing
  public update(deltaSeconds: number): number {
    const deadZoneLeft = this.cameraWorldX + this.viewportWidth * this.deadZonePercent;
    const deadZoneRight = this.cameraWorldX + this.viewportWidth * (1 - this.deadZonePercent);

    let desiredCameraX = this.cameraWorldX;
    if (this.targetWorldX < deadZoneLeft) {
      desiredCameraX = this.targetWorldX - this.viewportWidth * this.deadZonePercent;
    } else if (this.targetWorldX > deadZoneRight) {
      desiredCameraX = this.targetWorldX - this.viewportWidth * (1 - this.deadZonePercent);
    }

    // Lerp smoothing (delta aware but keep simple constant alpha)
    const alpha = 1 - Math.pow(1 - this.lerpAlpha, Math.max(1, deltaSeconds * 60));
    this.cameraWorldX = this.cameraWorldX + (desiredCameraX - this.cameraWorldX) * alpha;

    return this.cameraWorldX;
  }

  public get worldX(): number {
    return this.cameraWorldX;
  }
}


