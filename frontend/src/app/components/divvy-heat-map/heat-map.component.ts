import { AfterViewInit, Component, Input, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as heatmap from 'heatmap.js'
import { google } from 'google-maps';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';
import { Observable } from "rxjs";
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';

interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}

@Component({
  selector: 'heatmap',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.scss']
})


export class HeatMapComponent implements OnInit {

  // The following are tunable parameters that are used to display n samples
  // of divvy data on the heatMap

  FRAMES_PER_HOUR = 30;
  FRAMES_PER_DAY = 24;
  FRAMES_PER_WEEK = 7;

  PAST_HOUR = 'Past Hour';
  PAST_24_HOURS = 'Last 24 Hours';
  PAST_7_DAYS = 'Last 7 Days';

  newTimeRangeSelection = true;
  notNewTimeRangeSelection = false;

  timeRangeSelected = this.PAST_HOUR;

  google: google;
  gradient;
  gradientStep = -1;
  newGradient;
  distinct = [];
  stations: Station[];
  heatMapData: any[];
  timeArray: any;
  timeOffset = 0;
  timer;

  noOfDivvyDataSamplesRequested: number;
  noOfDivvyDataSamplesProcessed: number;

  currentChicagoTime;

  timeStamp;
  currentTime;

  timeValues = [
    { id: this.PAST_HOUR, value: this.PAST_HOUR },
    { id: this.PAST_24_HOURS, value: this.PAST_24_HOURS },
    { id: this.PAST_7_DAYS, value: this.PAST_7_DAYS }
  ];

  private map: google.maps.Map = null;
  heatmap: google.maps.visualization.HeatmapLayer = null;


  constructor(private placesService: PlacesService) {

  }


  ngOnInit() {
    this.timeRangeSelected = this.PAST_HOUR;
    this.noOfDivvyDataSamplesProcessed = 2;
  }








  changeTimeRangeSelected(data) {
    //console.log('this.timeRangeSelected', this.timeRangeSelected);
    this.clearHeatMap();
    this.noOfDivvyDataSamplesProcessed = 0;
    clearTimeout(this.timer);
    this.getDivvyStationsStatus(this.newTimeRangeSelection);



  }




  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////


  checkForSingleDigitAndPrefixZeroIfNeeded(digitValue) {

    if (digitValue < 10)
      digitValue = "0" + digitValue;

    return digitValue;
  }



  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  getDivvyStationsStatus(timeRangeSelection) {



    var simulatedClockTime;
    var currentTime = new Date();

    var startTimeForDataCollection;
    var currentTimeForDataCollection;



    if (this.timeRangeSelected == this.PAST_HOUR) {
      this.noOfDivvyDataSamplesRequested = this.FRAMES_PER_HOUR;
      startTimeForDataCollection = new Date(currentTime.getTime() - (60 * 60 * 1000));
      currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
    }






    /////////////////////////////////////////////////////
    else if (this.timeRangeSelected == this.PAST_24_HOURS) {
      this.noOfDivvyDataSamplesRequested = this.FRAMES_PER_DAY;
      startTimeForDataCollection = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000));
      currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
    }

    ///// my code for 7 days
    else if (this.timeRangeSelected == this.PAST_7_DAYS) {
      this.noOfDivvyDataSamplesRequested = this.FRAMES_PER_WEEK;
      startTimeForDataCollection = new Date(currentTime.getTime() - (7 * 24 * 60 * 60 * 1000));
      currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
    }


   


    if (this.noOfDivvyDataSamplesProcessed < this.noOfDivvyDataSamplesRequested) {
      this.placesService.get_all_divvy_stations_data(this.timeRangeSelected, timeRangeSelection).subscribe((data: Station[]) => {
        //console.log('getDivvyStationsStatus -- noOfDivvyDataSamplesProcessed=', this.noOfDivvyDataSamplesProcessed);
        this.noOfDivvyDataSamplesProcessed = this.noOfDivvyDataSamplesProcessed + 1;


       
        if (this.timeRangeSelected == this.PAST_HOUR) {
          this.timeOffset = (this.noOfDivvyDataSamplesProcessed) * (60 * 1000 * 2);
        } else
          if (this.timeRangeSelected == this.PAST_24_HOURS) {
            this.timeOffset = (this.noOfDivvyDataSamplesProcessed) * (60 * 60 * 1000);
          } else
            if (this.timeRangeSelected == this.PAST_7_DAYS) {
              this.timeOffset = (this.noOfDivvyDataSamplesProcessed) * (24 * 60 * 60 * 1000);
            }

       
        currentTimeForDataCollection = new Date(startTimeForDataCollection.getTime() + this.timeOffset);
        let monthNumber = this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getMonth() + 1);
        simulatedClockTime = currentTimeForDataCollection.getFullYear() + '-' +
          monthNumber + '-' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getDate()) + '\t' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getHours()) + ':' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getMinutes()) + ':' +
          this.checkForSingleDigitAndPrefixZeroIfNeeded(currentTimeForDataCollection.getSeconds());

        this.timeStamp = simulatedClockTime;



        this.clearHeatMap();
        this.plot_availableDocksInDivvyStations_on_heatMap(data);


      
        this.timer = setTimeout(() => this.getDivvyStationsStatus(this.notNewTimeRangeSelection), 300);
      });
    }

    // we are done ... reset time offset to zero
    this.timeOffset = 0;
  }

  ///////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////

  plot_availableDocksInDivvyStations_on_heatMap(availableDocksInDivvyStations) {

    let locationsOfAvailableDocksInDivvyStations = [];

    this.stations = availableDocksInDivvyStations;
    //console.log("data",this.stations.length);

    for (let i = 0; i < this.stations.length; i++) {
      let divvy_dock_station_location = {
        location: new google.maps.LatLng(this.stations[i].latitude, this.stations[i].longitude),
        weight: this.stations[i].availableDocks
      }
      locationsOfAvailableDocksInDivvyStations.push(divvy_dock_station_location);
    }

    this.heatMapData = locationsOfAvailableDocksInDivvyStations;

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatMapData
    });

    this.heatmap.setMap(this.map);
  }





  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  public location: Location = {
    lat: 41.882607,
    lng: -87.643548,
    label: 'You are Here',
    zoom: 10
  };


  /////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  onMapLoad(mapInstance: google.maps.Map) {
    // default display is Past Hour data
    this.timeRangeSelected = this.PAST_HOUR;

    this.map = mapInstance;

    this.getDivvyStationsStatus(true);

  }


  clearHeatMap() {
    if (this.heatmap) {
      this.heatmap.setMap(null);
      this.heatMapData = [];
    }

  }


  ngOnDestroy() {

    this.map = null;
    this.heatmap = null;

  }

}
