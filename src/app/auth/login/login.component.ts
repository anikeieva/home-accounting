import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";

import { UserService } from "../../shared/services/user.service";
import { User } from "../../shared/models/user.model";
import { Message } from "../../shared/models/message.model";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'acc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  message: Message;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit() {
    console.log(this.loginForm);

    this.userService.getUserByEmail(this.email.value)
      .subscribe((user: User) => {
        if (user) {
          console.log(user);
          if (user.password === this.password.value) {
            this.resetMessageText();
            LoginComponent.setUserToLocalStorage(user);

            this.authService.login();
            // this.router.navigate('');
          } else {
            this.getMessage('Wrong password');
          }
        } else {
          this.getMessage('There is no user with that email');
        }
      });
  }

  private getMessage(text: string, type: string = 'danger') {
    this.message = new Message(type, text);

    setTimeout(() => {
      this.resetMessageText();
    }, 5000);
  }

  private resetMessageText() {
    if (this.message.text) {
      this.message.text = '';
    }
  }

  private static setUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }
}
