import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindRoseComponent } from './wind-rose.component';
import { NgChartsModule } from 'ng2-charts';
import { WindRoseController } from './wind-rose-controller';
import { Chart } from 'chart.js';



@NgModule({
  declarations: [WindRoseComponent],
  imports: [
    CommonModule, NgChartsModule
  ],
  exports: [WindRoseComponent]
})
export class WindRoseModule { 
  constructor() {
    WindRoseController.id = 'windRose';
    Chart.register(WindRoseController);
  }
}

Chart.register(WindRoseController);
export default Chart;
