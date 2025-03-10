import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  combineLatest,
  map,
  mergeMap,
  Observable,
  of,
  pairwise,
  shareReplay,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { Restaurant } from './restaurant';
import {
  City,
  ResponseData,
  RestaurantService,
  State,
} from './restaurant.service';

export interface Data<T> {
  value: T[];
  isPending: boolean;
}

const toData = map(
  <T>(response: ResponseData<T>): Data<T> => ({
    value: response.data,
    isPending: false,
  }),
);

@Component({
  selector: 'pmo-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css',
})
export class RestaurantComponent implements OnInit, OnDestroy {
  form: FormGroup<{
    state: FormControl<string>;
    city: FormControl<string>;
  }> = this.createForm();

  states$: Observable<Data<State>>;
  cities$: Observable<Data<City>>;
  restaurants$: Observable<Data<Restaurant>>;
  selectedState$: Observable<string>;
  selectedCity$: Observable<string>;
  enableStateSelect$: Observable<Data<State>>;
  toggleCitySelect$: Observable<Data<City>>;
  clearCityWhenStateChanges$: Observable<[string, string]>;

  private onDestroy$ = new Subject<void>();

  constructor(
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
  ) {
    this.selectedState$ = this.form.controls.state.valueChanges.pipe(
      startWith(''),
    );

    this.selectedCity$ = this.form.controls.city.valueChanges.pipe(
      startWith(''),
    );

    this.states$ = this.restaurantService
      .getStates()
      .pipe(
        toData,
        startWith({ isPending: true, value: [] }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );

    this.enableStateSelect$ = this.states$.pipe(
      takeUntil(this.onDestroy$),
      tap((states) => {
        if (states.value.length > 0) {
          this.form.controls.state.enable();
        }
      }),
    );

    this.cities$ = this.selectedState$.pipe(
      mergeMap((state) => {
        if (state) {
          return this.restaurantService
            .getCities(state)
            .pipe(toData, startWith({ isPending: true, value: [] }));
        } else {
          return of({ isPending: false, value: [] });
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.toggleCitySelect$ = this.cities$.pipe(
      takeUntil(this.onDestroy$),
      tap((cities) => {
        if (cities.value.length === 0) {
          this.form.controls.city.disable({
            onlySelf: true,
            emitEvent: false,
          });
        } else {
          this.form.controls.city.enable({
            onlySelf: true,
            emitEvent: false,
          });
        }
      }),
    );

    this.clearCityWhenStateChanges$ = this.selectedState$.pipe(
      takeUntil(this.onDestroy$),
      pairwise(),
      tap(([previous, current]) => {
        if (current && current !== previous) {
          this.form.controls.city.setValue('');
        }
      }),
    );

    this.restaurants$ = combineLatest([
      this.selectedCity$,
      this.selectedState$,
    ]).pipe(
      mergeMap(([city, state]) => {
        if (city && state) {
          return this.restaurantService
            .getRestaurants(state, city)
            .pipe(toData, startWith({ isPending: true, value: [] }));
        } else {
          return of({ isPending: false, value: [] });
        }
      }),
    );
  }

  ngOnInit(): void {
    this.enableStateSelect$.subscribe();
    this.toggleCitySelect$.subscribe();
    this.clearCityWhenStateChanges$.subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  createForm(): FormGroup<{
    state: FormControl<string>;
    city: FormControl<string>;
  }> {
    return this.fb.nonNullable.group({
      state: { value: '', disabled: true },
      city: { value: '', disabled: true },
    });
  }
}
