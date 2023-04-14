import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ColorsService {
  public getHueSpectrum(colorCount: number): number[] {
    const colors = Array<number>(colorCount);

    for (let i = 0; i < colorCount; i++) {
      colors[i] = Math.round(360 * (i / colorCount));
    }

    return colors;
  }
}
