import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataGeneratorService, Wind } from './data-generator.service';
import { Series, WindRoseService } from './wind-rose/wind-rose.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public data$: Observable<Array<Wind>>;

  constructor(private service: DataGeneratorService) {
    this.data$ = this.service.generate();
  }
}
