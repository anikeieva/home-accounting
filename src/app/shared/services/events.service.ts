import { Injectable } from '@angular/core';
import {BaseApiService} from '../core/base-api.service';
import {HttpClient} from '@angular/common/http';
import {AccEvent} from '../models/event.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends BaseApiService {

  constructor(public http: HttpClient) {
    super(http);
  }

  addEvent(event: AccEvent): Observable<AccEvent> {
    return this.post('events', event);
  }
}
