import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventRestService {

  constructor(private http:HttpClient) { }

  getEvent(id:string): Observable<any>{
    return this.http.get<any>(`${environment.endpoint}event/event-view-details/${id}`);
  }
}
