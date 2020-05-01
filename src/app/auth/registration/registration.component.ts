import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import { Router } from "@angular/router";
import {Observable, throwError} from "rxjs";

import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.model";
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'acc-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get agree() {
    return this.registrationForm.get('agree');
  }

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email], this.forbiddenEmail.bind(this)),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      name: new FormControl('', [Validators.required]),
      agree: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  onSubmit() {
    const { email, password, name } = this.registrationForm.value;
    const user: User = new User(email, password, name);

    this.userService.createUser(user)
      .subscribe((user: User) => {
        if (user) {
          this.router.navigate(['/login'], {
            queryParams: {
              canLoginNow: true
            }
          }).then(() => {});
        }
      });
  }

  forbiddenEmail(control: FormControl): Observable<ValidationErrors | null> {
    return this.userService.getUserByEmail(control.value)
      .pipe(
        map((user: User) => user ? { forbiddenEmail: true } : null),
        catchError((error: Error) => throwError(error))
      )
  }

}
