import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminRestService {

  constructor(private http: HttpClient) { }

  //Get all promoters
  getAllPromoters() {
    return this.http.get<any>(`${environment.endpoint}admin/promoters`);
  }

  getPromotersByStatus(status: string) {
    return this.http.get<any>(`${environment.endpoint}admin/promotersByStatus/${status}`);
  }

  //Accept an promoter
  acceptPromoter(id: string, status: string) {
    return this.http.put<any>(`${environment.endpoint}admin/changePromoterStatus/${id}`, { status });
  }
}

