import { Element, PolarAreaController } from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';
import { toRadians } from 'chart.js/helpers';

export class WindRoseController extends PolarAreaController {
  override updateElements(
    elements: Element<AnyObject, AnyObject>[],
    start: number,
    count: number,
    mode: 'resize' | 'reset' | 'none' | 'hide' | 'show' | 'normal' | 'active'
  ): void {
    const reset = mode === 'reset';
    const chart = this.chart;
    const opts = chart.options;
    const animationOpts: any = opts.animation;
    const scale: any = this._cachedMeta.rScale;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;
    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * Math.PI;
    let angle = datasetStartAngle;
    let i;

    const defaultAngle = 360 / this.countVisibleElements();

    for (i = 0; i <= start; ++i) {
      angle -= this._computeAngle(i, mode, defaultAngle);
    }
    for (i = start; i < start + count; i++) {
      const arc = elements[i];
      let startAngle = angle + this._computeSpacing(i, mode, 0);
      let endAngle = startAngle + this._computeAngle(i, mode, defaultAngle);
      let parsed : any = this.getParsed(i)
      let outerRadius = chart.getDataVisibility(i)
        ? scale.getDistanceFromCenterForValue(parsed.r)
        : 0;
      angle = endAngle;

      if (reset) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }
        if (animationOpts.animateRotate) {
          startAngle = endAngle = datasetStartAngle;
        }
      }

      const properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: this.resolveDataElementOptions(
          i,
          arc.active ? 'active' : mode
        ),
      };

      this.updateElement(arc, i, properties, mode);
    }
  }

  _computeAngle(
    index: number,
    mode: 'resize' | 'reset' | 'none' | 'hide' | 'show' | 'normal' | 'active',
    defaultAngle: number
  ) {
    return this.chart.getDataVisibility(index)
      ? toRadians(
          Number(this.resolveDataElementOptions(index, mode)['angle']) ||
            defaultAngle
        )
      : 0;
  }

  _computeSpacing(
    index: number,
    mode: 'resize' | 'reset' | 'none' | 'hide' | 'show' | 'normal' | 'active',
    defaultSpacing: number
  ) {
    return this.chart.getDataVisibility(index)
      ? toRadians(
          Number(this.resolveDataElementOptions(index, mode)['spacing']) ||
          defaultSpacing
        )
      : 0;
  }
}

