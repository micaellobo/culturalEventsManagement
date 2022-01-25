import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { LoginModel } from '../../models/login.model';
import { RegisterModel } from '../../models/register.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AuthService {


  constructor(private http: HttpClient) { }


  login(email: string, password: string, role: string): Observable<LoginModel> {
    return this.http.post<LoginModel>(`${environment.endpoint}login`, new LoginModel(email, password, role));
  }

  register(name: string, email: string, password: string, password2: string, role: string): Observable<RegisterModel> {
    return this.http.post<RegisterModel>(`${environment.endpoint}register`, new RegisterModel(name, email, password, password2, role));
  }

  logout() {
    localStorage.removeItem('user');
    for (let i = 0; i < 2; i++) {
      document.cookie = `x-access-token=`
    }
  }
}
