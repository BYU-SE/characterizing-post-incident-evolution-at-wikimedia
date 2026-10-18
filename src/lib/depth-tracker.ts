export class DepthTracker {
  private constructor(public depthLeft: number, public stamps: string[]) {}

  stampAndDecrementDepth(stamp: string) {
    let d = this.depthLeft;
    return new DepthTracker(--d, this.stamps.concat(stamp + ` (${d})`));
  }

  stampOnly(stamp: string) {
    const d = this.depthLeft;
    return new DepthTracker(this.depthLeft, this.stamps.concat(stamp + ` (${d})`));
  }

  static create(depthLeft: number, initialStamp?: string) {
    return new DepthTracker(depthLeft, initialStamp ? [initialStamp] : []);
  }
}
