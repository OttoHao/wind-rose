import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Wind {
  speed: number;
  direction: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {
  generate(): Observable<Array<Wind>>{
    let ret: Array<Wind> = [];
    for (let index = 0; index < 24*60; index++) {
      const windSpeed = Math.random() * 99.9;
      const windDirection = Math.random() * 360;
      ret.push({speed: windSpeed, direction: windDirection});
    }

    return of(ret);
  }
}
