import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-tickets',
  templateUrl: './client-tickets.component.html',
  styleUrls: ['./client-tickets.component.css']
})
export class ClientTicketsComponent implements OnInit {

  statusPending = 'pending';
  statusAccepted = 'accepted';
  statusCanceled = 'canceled';

  activeTicket: any;
  @Input() client: any;

  constructor(private route: ActivatedRoute, private location: Location) {
    this.location.go('client/tickets');
    this.activeTicket = this.statusPending;
  }

  ngOnInit(): void {
  }

}
