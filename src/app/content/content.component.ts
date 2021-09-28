import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Location } from '../models/location';

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
    {name: 'Cavite'},
    {name: 'PITX'},
    {name: 'Pasay Rotunda'},
  ];
  destinationList: Location[] = [
    {name: 'MOA'},
    {name: 'Lawton'},
  ]

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

    this.filteredDestination = this.form.controls[Field.DESTINATION].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name, this.destinationList) : this.destinationList.slice())
      );
  }

  displayFn(loc: Location): string {
    return loc && loc.name ? loc.name : '';
  }

  private _filter(name: string, list: Location[]): Location[] {
    return list.filter(option => option.name.toLowerCase().includes(name.toLowerCase()));
  }
}
