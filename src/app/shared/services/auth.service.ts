import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.isAuthenticated = !!(user && user.email && user.password && user.name && user.id);
  }

  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.clear();
  }

  isUserAuthorized(): boolean {
   return this.isAuthenticated;
  }
}
