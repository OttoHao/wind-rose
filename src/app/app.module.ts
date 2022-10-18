import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Chart } from 'chart.js';

import { AppComponent } from './app.component';
import { WindRoseModule } from './wind-rose/wind-rose.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    WindRoseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
