import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.model';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'acc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }
  loginForm: FormGroup;
  message: Message;

  private static setUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params: Params) => {
        if (params.canLoginNow) {
          this.getMessage('You can login now', 'success');
        } else if (params.accessDenied) {
          this.getMessage('You need to login to use a system ', 'warning');
        }
      })
    );

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    this.subscriptions.push(
      this.userService.getUserByEmail(this.email.value)
        .subscribe((user: User) => {
          if (user) {
            if (user.password === this.password.value) {
              this.resetMessageText();
              LoginComponent.setUserToLocalStorage(user);

              this.authService.login();
              this.router.navigate(['/system', 'bill']).then(() => {});
            } else {
              this.getMessage('Wrong password', 'danger');
            }
          } else {
            this.getMessage('There is no user with that email', 'danger');
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  private getMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);

    setTimeout(() => {
      this.resetMessageText();
    }, 5000);
  }

  private resetMessageText() {
    if (this.message && this.message.text) {
      this.message.text = '';
    }
  }
}
