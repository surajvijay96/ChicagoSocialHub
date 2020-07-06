
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';



import { MatToolbarModule, MatFormFieldModule, MatCheckboxModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatDividerModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';


import { PlacesService } from './places.service';

import { FindComponent } from './components/find/find.component';
import { ListOfPlacesComponent } from './components/list-of-places/list-of-places.component';
import { ListOfStationsComponent } from './components/list-of-stations/list-of-stations.component';
import { RealTimeLineComponent } from './components/real-time-line-chart/real-time-line-chart.component'

import { HeatMapComponent } from './components/divvy-heat-map/heat-map.component';

import { BarChartComponent } from './components/yelp-reviews-chart/yelp-reviews-bar-chart.component';
import { DivvyTripsChartComponent } from './components/divvy-trips-chart/divvy-trips-chart.component';

import { RealTimeSMALineComponent } from './components/real-time-sma-line-chart/real-time-sma-line-chart.component';



const routes: Routes = [
  { path: 'find', component: FindComponent },
  { path: 'list_of_places', component: ListOfPlacesComponent },
  { path: 'list_of_stations', component: ListOfStationsComponent },
  { path: 'realtime_line_chart', component: RealTimeLineComponent },
  { path: 'heat_map', component: HeatMapComponent },
  { path: 'yelp_reviews_chart', component: BarChartComponent },
  { path: 'divvy_trips_chart', component: DivvyTripsChartComponent },
  { path: 'sma_chart', component: RealTimeSMALineComponent },




  { path: '', redirectTo: 'find', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    FindComponent,
    ListOfPlacesComponent,
    ListOfStationsComponent,
    RealTimeLineComponent,
    HeatMapComponent,
    RealTimeSMALineComponent,
    BarChartComponent,
    DivvyTripsChartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    SatDatepickerModule,
    SatNativeDateModule,



    AgmCoreModule.forRoot({ apiKey: '' + '&libraries=visualization' }),
    FormsModule,
    NgbModule,
    MatCheckboxModule

  ],

  providers: [PlacesService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
