import { Injectable } from '@angular/core';
import {BaseApiService} from '../core/base-api.service';
import {HttpClient} from '@angular/common/http';
import {Category} from '../models/category';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseApiService {

  constructor(
    public http: HttpClient
  ) {
    super(http);
  }

  addCategory(category: Category): Observable<Category> {
    return this.post('categories', category);
  }
}
