import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApiService } from '../core/base-api.service';
import { AccEvent } from '../models/event.model';

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

  getEvents(): Observable<AccEvent[]> {
    return  this.get('events');
  }

  getEventById(id: string): Observable<AccEvent> {
    return this.get(`events/${id}`);
  }
}
