import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClientRestService } from 'src/app/services/client/client.rest.service';
import { TicketsRestService } from 'src/app/services/tickets/tickets.rest.service';
import { environment } from 'src/environments/environment';

import { Location } from '@angular/common';

@Component({
  selector: 'app-client-full-page',
  templateUrl: './client-full-page.component.html',
  styleUrls: ['./client-full-page.component.css']
})
export class ClientFullPageComponent implements OnInit {

  tabs = ['profile', 'tickets', 'covidTests'];

  promoterURL: string;
  aboutUsURL: string;
  homeURL: string;


  active: any;
  client: any;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,
    private clientRestService: ClientRestService, private ticketsRestService: TicketsRestService, private location: Location) {


    this.promoterURL = environment.promoterUrl;
    this.aboutUsURL = environment.aboutUs;
    this.homeURL = environment.endpoint;

    if (!(this.tabs.includes(this.location.path().substring(8)))) {
      this.active = this.tabs[0];
    } else {
      this.active = this.location.path().substring(8);
    }
  }

  ngOnInit(): void {
    // this.clientInfo();
  }

  clientInfo(): void {
    this.clientRestService.getClientInfo().subscribe((client) => {
      this.client = client;
    })
  }

  updateClient(client: any) {
    this.client = client;
  }

  logout(): void {
    this.authService.logout();
  }

  changeActivTab(active: any) {
    this.active = active;
  }

}


