import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '../models/location';
import { Details } from '../models/details';

enum Field {
  CURRENT = 'currentLoc',
  DESTINATION = 'destination',
}

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  readonly field = Field
  currentLocationsList: Location[] = [
    {name: 'Cavite', marker: new google.maps.LatLng(14.4028135,120.5812478)},
    {name: 'PITX', marker: new google.maps.LatLng(14.510491, 120.9891043)},
    {name: 'Pasay Rotunda', marker: new google.maps.LatLng(14.5355417, 120.9818241)},
  ];
  destinationList: Location[] = [
    {name: 'MOA', marker: new google.maps.LatLng(14.531180, 120.9769466)},
    {name: 'Lawton', marker: new google.maps.LatLng(14.593258, 120.9780023)},
  ]
  details: Details[] = [
    {message: 'Go to blah bla'},
    {message: 'Go to blah bla'},
    {message: 'Go to blah bla'},
  ];
  // details: Details[] = [];

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
  };
  center = {lat: 12, lng: 121};
  zoom = 6;

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng.toJSON());
  }

  form = new FormGroup({});
  filteredCurrentLocation: Observable<Location[]> = of([]);
  filteredDestination: Observable<Location[]> = of([]);

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      [Field.CURRENT]: [''],
      [Field.DESTINATION]: [''],
    })
  }

  ngOnInit() {
    this.filteredCurrentLocation = this.form.controls[Field.CURRENT].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.currentLocationsList) : this.currentLocationsList.slice())
      );

    this.form.controls[Field.CURRENT].valueChanges.subscribe((loc: Location) => {
      this.placeMarker(loc);
    });

    this.filteredDestination = this.form.controls[Field.DESTINATION].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.destinationList) : this.destinationList.slice())
      );

    this.form.controls[Field.DESTINATION].valueChanges.subscribe((loc: Location) => {
      this.placeMarker(loc);
    });
  }

  displayFn(loc: Location): string {
    return loc && loc.name ? loc.name : '';
  }

  private _filter(name: string, list: Location[]): Location[] {
    return list.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }

  private _getByName(name: string, list: Location[]): Location | undefined {
    return list.find((loc: Location) => loc.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
  }

  placeMarker(loc: Location) {
    if (loc.marker) {
      this.center = loc.marker.toJSON();
      this.zoom = 11;
      this.markerPositions.push(loc.marker.toJSON());
    }
  }
}
