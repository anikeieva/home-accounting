import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError} from "rxjs";
import { catchError, map } from "rxjs/operators";

import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // TODO: add catchError handeling
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users?email=${email}`)
      .pipe(
        map((user: User) => user[0] ? user[0] : null),
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          return throwError(error);
        })
      )
  }
}
