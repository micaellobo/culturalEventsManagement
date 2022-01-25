import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SessionService } from '../auth/session.service';

@Injectable({
  providedIn: 'root'
})
export class TicketsRestService {


  user: any;

  constructor(private http: HttpClient, private sessionService: SessionService) {
    this.user = this.sessionService.getCurrentUser();
  }

  //Creat new ticket
  addTicket(eventID: string, locationID: string, date: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("eventID", eventID);
    formData.append("locationID", locationID);
    formData.append("date", date);
    return this.http.post<any>(`${environment.endpoint}ticket`, formData);
  }

  //Update an ticket
  cancelTicket(id: string) {
    return this.http.put<any>(`${environment.endpoint}ticket/cancel/${id}`, {});
  }

  //Get one especific ticket
  getOne(id: string) {
    return this.http.get<any>(`${environment.endpoint}ticket/${id}`);
  }

  //Get all tickets
  getAll() {
    return this.http.get<any>(`${environment.endpoint}ticket`);
  }

  //Get tickets by  Client
  getByClient() {
    return this.http.get<any>(`${environment.endpoint}ticket/byClient/${this.user.id}`);
  }

  //Get tickets by  Client and ticket status
  getByClientAndStatus(status: string) {
    return this.http.get<any>(`${environment.endpoint}ticket/byClientAndStatus/${status}`);
  }
}
