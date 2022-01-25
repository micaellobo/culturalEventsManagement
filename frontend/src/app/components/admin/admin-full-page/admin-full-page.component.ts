import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminRestService } from 'src/app/services/admin/admin.rest.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-full-page',
  templateUrl: './admin-full-page.component.html',
  styleUrls: ['./admin-full-page.component.css']
})

export class AdminFullPageComponent implements OnInit {
  promoterURL: string;
  aboutUsURL: string;
  homeURL: string;

  promoters: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private adminRestServices: AdminRestService) {
    this.promoterURL = environment.promoterUrl;
    this.aboutUsURL = environment.aboutUs;
    this.homeURL = environment.endpoint;
  }

  ngOnInit(): void {
    this.getPromoters();
  }

  getPromoters(): void {
    this.adminRestServices.getAllPromoters().subscribe((promoters: any[]) => {
      this.promoters = promoters;
    })
  }

}
