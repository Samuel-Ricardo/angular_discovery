import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  getRestaurants(): any {
    throw new Error('Method not implemented.');
  }
  constructor() {}
}
