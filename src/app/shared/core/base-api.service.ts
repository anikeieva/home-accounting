import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  baseUrl = 'http://localhost:3000/';

  constructor(
    public http: HttpClient
  ) { }

  get(url: string = ''): Observable<any> {
    return this.http.get(this.getUrl(url))
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  post(url: string = '', data: any = {}): Observable<any> {
    return this.http.post(this.getUrl(url), data)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  put(url: string = '', data: any = {}): Observable<any> {
    return this.http.put(this.getUrl(url), data)
      .pipe(
        catchError((error: HttpErrorResponse) => throwError(error))
      );
  }

  private getUrl(url: string = ''): string {
    return this.baseUrl + url;
  }
}
