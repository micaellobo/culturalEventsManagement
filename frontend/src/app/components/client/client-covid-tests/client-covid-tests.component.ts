import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientRestService } from 'src/app/services/client/client.rest.service';
import { SubmitCovidTestComponent } from '../dialogs/submit-covid-test/submit-covid-test.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-client-covid-tests',
  templateUrl: './client-covid-tests.component.html',
  styleUrls: ['./client-covid-tests.component.css']
})
export class ClientCovidTestsComponent implements OnInit {


  @Input() client: any;
  // @Input() active: any;
  @Output() clientOutput = new EventEmitter<any>();
  // @Output() active = new EventEmitter<any>();

  constructor(public dialog: MatDialog, private clientRestService: ClientRestService, private route: ActivatedRoute, private location: Location) {
    this.location.go('client/covidTests');
    // this.active.emit('covidTests');
  }

  ngOnInit(): void {

  }

  openDialog() {
    //Falta deixar comprar apenas se tiver login
    const dialogRef = this.dialog.open(SubmitCovidTestComponent);

    dialogRef.afterClosed().subscribe(result => {

      if (result) this.updateClient()

      console.log(`Dialog result: ${result}`);
    });
  }

  updateClient() {
    this.clientRestService.getClientInfo().subscribe((client) => {
      this.client = client;
      this.clientOutput.emit(client);
    })
  }
}
