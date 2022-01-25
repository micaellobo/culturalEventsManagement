import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from '../auth/session.service';

@Injectable({
  providedIn: 'root'
})

export class ClientRestService {

  user: any;

  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.user = this.sessionService.getCurrentUser();
  }

  getClientInfo(): Observable<any> {
    return this.http.get<any>(`${environment.endpoint}client`);
  }

  update(client: any): Observable<any> {
    return this.http.put<any>(`${environment.endpoint}client`, client);
  }

  submitCovidTest(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post<any>(`${environment.endpoint}client/submitCovidTest`, formData);
  }

  updatePassword(password: string): Observable<any> {
    return this.http.put<any>(`${environment.endpoint}client/pwd`, { password });
  }
}
