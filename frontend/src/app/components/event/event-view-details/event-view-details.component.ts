import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { EventRestService } from '../../../services/event/event-rest-.service';
import { BuyTicketComponent } from '../dialogs/buy-ticket/buy-ticket.component';
import { ChangeDetectorRef } from '@angular/core';
import { SessionService } from 'src/app/services/auth/session.service';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-event-view-details',
  templateUrl: './event-view-details.component.html',
  styleUrls: ['./event-view-details.component.css']
})
export class EventViewDetailsComponent implements OnInit {
  promoterURL: string;
  aboutUsURL: string;
  homeURL: string;
  event: any;
  user: any;

  constructor(private router: Router, private route: ActivatedRoute, private restEvent: EventRestService,
    public dialog: MatDialog, private cd: ChangeDetectorRef, private sessionService: SessionService, private authService: AuthService) {
    this.promoterURL = environment.promoterUrl;
    this.aboutUsURL = environment.aboutUs;
    this.homeURL = environment.endpoint;
  }

  ngOnInit(): void {

    var idTemp = this.route.snapshot.params['id'];
    this.restEvent.getEvent(idTemp).subscribe((data: any) => {
      this.event = data;
      this.user = this.sessionService.getCurrentUser();
    })
  }

  openDialog(indexLocal: number, indexDate: number) {
    //Falta deixar comprar apenas se tiver login
    const dialogRef = this.dialog.open(BuyTicketComponent, {
      data: { event: this.event, indexLocal, indexDate }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  isLoggedIn() {
    return this.sessionService.isClient();
  }

  logout() {
    this.authService.logout();
  }

  //To no throw a error Expression Changed After it was Checked Error
  ngAfterContentChecked() {
    this.cd.detectChanges();
  }
}
