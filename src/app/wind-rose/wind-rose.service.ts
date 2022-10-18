import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { DataGeneratorService, Wind } from '../data-generator.service';

export interface Series {
  data: number[];
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class WindRoseService {

  constructor(private dataGenerator: DataGeneratorService) {}
  getSeries(): Observable<Array<Series>> {
    return this.dataGenerator.generate().pipe(
      map(wind => this.convertToSeries(wind)));
  }

  convertToSeries(input: Array<Wind>): Array<Series> {
    const series: Array<Series> = [];
    const map = this.convert(input);

    map.forEach((value: Array<number>, key: [number, number]) => {
      series.push({data: value, label: `${key[0].toFixed(1)} - ${key[1].toFixed(1)}`})
    })

    for (let index = 1; index < series.length; index++) {
      series[index].data = series[index].data.map((item: number, idx: number) => item + series[index-1].data[idx]);
    }

    return series;
  }

  convert(input: Array<Wind>): Map<[number, number], Array<number>> {
    const numberOfWindDirectionBins = 16;
    const numberOfWindSpeedGroups = 4;
    const windDirectionBins = this.generateWindDirectionBins(
      numberOfWindDirectionBins
    );
    const windSpeedGroups = this.generateWindSpeedGroups(
      input,
      numberOfWindSpeedGroups
    );
    const lengthOfWindInput = input.length;

    const map: Map<[number, number], Array<number>> = new Map(
      windSpeedGroups.map((x) => [
        x,
        new Array<number>(numberOfWindDirectionBins).fill(0),
      ])
    );

    input.forEach((wind: Wind) => {
      for (let [key, value] of map) {
        if (wind.speed <= key[1]) {
          const binIndex = this.findWindDirectionBinIndex(
            windDirectionBins,
            wind.direction
          );
          value[binIndex]++;
          break;
        }
      }
    });

    map.forEach((value: Array<number>) => {
      for (let index = 0; index < value.length; index++) {
        value[index] = value[index] / lengthOfWindInput;
      }
    });
  
    return map;
  }

  private findWindDirectionBinIndex(
    bins: Array<number>,
    windDirection: number
  ) {
    for (let index = 0; index < bins.length; index++) {
      if (windDirection < bins[index]) {
        return index;
      }
    }
    return 0;
  }

  private generateWindDirectionBins(count: number): Array<number> {
    const windDirectionBins: Array<number> = [];
    const windDirectionAngle = 360 / count;
    for (
      let angle = windDirectionAngle / 2;
      angle < 360;
      angle += windDirectionAngle
    ) {
      windDirectionBins.push(angle);
    }

    return windDirectionBins;
  }

  private generateWindSpeedGroups(
    input: Array<Wind>,
    count: number
  ): Array<[number, number]> {
    const minWindSpeed = Math.min(...input.map((x) => x.speed));
    const maxWindSpeed = Math.max(...input.map((x) => x.speed));
    const windSpeedGroupStep = (maxWindSpeed - minWindSpeed) / count;
    const windSpeedGroups: Array<[number, number]> = [];

    for (let index = 0; index < count; index++) {
      windSpeedGroups.push([
        minWindSpeed + index * windSpeedGroupStep,
        minWindSpeed + (index + 1) * windSpeedGroupStep,
      ]);
    }

    return windSpeedGroups;
  }
}
