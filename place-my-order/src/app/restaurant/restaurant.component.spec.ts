import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { RestaurantComponent } from './restaurant.component';

describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should not show any restaurants markup if no restaurants', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.restaurant')).toBe(null);
  });

  it('should have two .restaurant divs', fakeAsync((): void => {
    fixture.detectChanges();
    tick(501);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const restaurantDivs = compiled.getElementsByClassName('restaurant');
    const hoursDivs = compiled.getElementsByClassName('hours-price');
    expect(restaurantDivs.length).toEqual(2);
    expect(hoursDivs.length).toEqual(2);
  }));

  it('should display restaurant information', fakeAsync((): void => {
    fixture.detectChanges();
    tick(501);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.restaurant h3')?.textContent).toContain(
      'Poutine Palace',
    );
  }));
});
