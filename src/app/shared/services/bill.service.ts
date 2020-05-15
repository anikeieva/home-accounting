import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Bill } from '../models/bill.model';
import { CurrencyInfoMonobank } from '../models/currencyInfoMonobank';
import { catchError } from 'rxjs/operators';
import {BaseApiService} from '../core/base-api.service';

@Injectable({
  providedIn: 'root'
})
export class BillService extends BaseApiService {
  constructor(
    public http: HttpClient
  ) {
    super(http);
  }

  getBill(): Observable<Bill> {
   return this.get('bill');
  }

  getCurrency(): Observable<CurrencyInfoMonobank[]> {
    return this.http.get<CurrencyInfoMonobank[]>('https://api.monobank.ua/bank/currency')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          const errorMessage: string = (error && error.error && error.error.errorDescription) ||
          'Error with monobank API';
          console.log(errorMessage);

          return throwError(errorMessage);
        })
      );
  }

  updateBill(bill: Bill): Observable<Bill> {
    return this.put('bill', bill);
  }
}
