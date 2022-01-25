import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/app/services/auth/session.service';
import { TicketsRestService } from 'src/app/services/tickets/tickets.rest.service';
import { SubmitCovidTestComponent } from '../../dialogs/submit-covid-test/submit-covid-test.component';

@Component({
  selector: 'app-client-list-tickets',
  templateUrl: './client-list-tickets.component.html',
  styleUrls: ['./client-list-tickets.component.css']
})
export class ClientListTicketsComponent implements OnInit {

  @Input() status: any;

  tickets: any[] = [];
  ticketTemp: any[] = [];

  page = 1;
  pageSize = 10;
  collectionSize: any;
  @Input() client: any;

  constructor(private ticketsRestService: TicketsRestService, private router: Router, private route: ActivatedRoute,
    public dialog: MatDialog, private sessionService: SessionService) {
  }

  ngOnInit(): void {
    this.getTickets();
  }

  getTickets(): void {
    this.ticketsRestService.getByClientAndStatus(this.status).subscribe((tickets: any[]) => {
      this.tickets = tickets;
      this.collectionSize = tickets.length;
      // console.log(tickets);

      this.refreshTickets();
    })
  }

  refreshTickets() {
    this.ticketTemp = this.tickets
      .map((ticket, i) => ({ index: i + 1, ...ticket }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  openDialog() {
    //Falta deixar comprar apenas se tiver login
    const dialogRef = this.dialog.open(SubmitCovidTestComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getTickets();
      console.log(`Dialog result: ${result}`);
    });
  }

  cancelTicket(id: string): void {
    this.ticketsRestService.cancelTicket(id).subscribe((ticket: any) => {
      var indexTicket = this.tickets.map((ticket) => ticket._id).indexOf(id);
      this.tickets.splice(indexTicket, 1);
      this.refreshTickets();
    })
  }
}
