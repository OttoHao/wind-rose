import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, Color } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Wind } from '../data-generator.service';
import { Series, WindRoseService } from './wind-rose.service';

@Component({
  selector: 'app-wind-rose',
  templateUrl: './wind-rose.component.html',
  styleUrls: ['./wind-rose.component.less']
})
export class WindRoseComponent implements OnChanges {

  @Input() public data: Array<Wind> = [];

  private polarAreaChartLabels: string[] = [
    'N',
    '',
    'NE',
    '',
    'E',
    '',
    'SE',
    '',
    'S',
    '',
    'SW',
    '',
    'W',
    '',
    'NW',
    '',
  ];

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: this.polarAreaChartLabels,
    datasets: [],
  };

  public polarAreaChartOptions: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: true,
    animation: false,
    plugins: {
      legend: {
        display: false,
        position: 'left',
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            return chart.getSortedVisibleDatasetMetas().map((meta) => {
              return {
                text: meta.label,
                fillStyle: <string>meta.controller.getDataset().backgroundColor,
                hidden: !meta.visible,
                lineWidth: <number>meta.controller.getDataset().borderWidth,
                strokeStyle: <Color>meta.controller.getDataset().borderColor,
                datasetIndex: meta.index,
              };
            });
          },
        },
      },
      tooltip: {
        mode: 'point',
        callbacks: {
          label: (context) => {
            let valueFromLastDataset =
              context.datasetIndex > 0
                ? this.polarAreaChartData.datasets[context.datasetIndex - 1]
                    .data[context.dataIndex]
                : 0;
            let value =
              100 *
              (context.dataset.data[context.dataIndex] - valueFromLastDataset);

            return `${context.dataset.label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        pointLabels: {
          display: true,         
        },
        ticks: {
          callback: function (value) {
            return `${(100 * Number(value)).toFixed(0)}%`;
          },
          maxTicksLimit: 8,
        },
      },
    },
  };

  public polarAreaChartType: any = 'windRose';

  private colors: string[] = ['#012169', '#009988', '#26D07C', '#C5E86C', '#2196F3', '#FBE64D', ' #D47500', '#8D7D67'];
  @ViewChild(BaseChartDirective) private chart: BaseChartDirective | undefined;

  constructor(private windRoseService: WindRoseService) {}


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      const series: Array<Series> = this.windRoseService.convertToSeries(this.data);

      this.polarAreaChartData.datasets = series.map((item, index) => {
        const color = this.colors[index % this.colors.length];

        return {
          ...item,
          backgroundColor: color,
          borderWidth: 0,
          borderColor: color,
          hoverBorderWidth: 0,
          hoverBackgroundColor: color,
          hoverBorderColor: color,
          angle: 15,
          spacing: 7.5,
        }
      })
    }
  }
}
