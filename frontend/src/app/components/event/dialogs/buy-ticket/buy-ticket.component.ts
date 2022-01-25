import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketsRestService } from 'src/app/services/tickets/tickets.rest.service';
import { EventViewDetailsComponent } from '../../event-view-details/event-view-details.component';
import { FormControl, FormGroup } from '@angular/forms';
import { SessionService } from 'src/app/services/auth/session.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {

  event: any;
  indexLocal: number;
  indexDate: number;
  fileGroup: FormGroup;
  errors: any


  constructor(public dialogRef: MatDialogRef<EventViewDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private restTicket: TicketsRestService,
    private sessionService: SessionService, private router: Router, private route: ActivatedRoute) {

    this.event = data.event;
    this.indexDate = data.indexDate;
    this.indexLocal = data.indexLocal;
    this.fileGroup = new FormGroup({ file: new FormControl('') })
  }

  ngOnInit(): void {

  }

  buyTicket(): void {

    if (this.sessionService.isClient()) {
      const eventID = this.event._id;
      const locationID = this.event.locations[this.indexLocal]._id;
      const date = this.event.locations[this.indexLocal].dates[this.indexDate].date;

      let file: File = new File([''], '');

      try {
        file = this.fileGroup?.controls['file']?.value?.files[0];
      } catch (error) { }

      this.restTicket.addTicket(eventID, locationID, date, file).subscribe((ticket) => {
        if (ticket.errors) {
          
        }
        //Decrease available quantities of tickets
        this.event.locations[this.indexLocal].dates[this.indexDate].availableTickets--;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

}

