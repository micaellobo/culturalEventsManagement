import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private user: any;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
  }

  getCurrentUser() {
    return this.user;
  }

  isClient(): boolean {
    return this.user != {} && this.user.role === 'CLIENT' && new Date() < new Date(this.user.expiresAt)

  }
  isAdmin(): boolean {
    return this.user != {} && this.user.role === 'ADMIN' && new Date() < new Date(this.user.expiresAt)
  }


}
