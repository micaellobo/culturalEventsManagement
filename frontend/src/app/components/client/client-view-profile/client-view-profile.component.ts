import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { ClientRestService } from 'src/app/services/client/client.rest.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-client-view-profile',
  templateUrl: './client-view-profile.component.html',
  styleUrls: ['./client-view-profile.component.css'],
  // add NgbModalConfig and NgbModal to the component providers
  providers: [NgbModalConfig, NgbModal]
})
export class ClientViewProfileComponent implements OnInit {

  @Input() client: any;
  // @Input() active: any;
  @Output() clientOutput = new EventEmitter<any>();
  // @Output() active = new EventEmitter<any>();
  password1: any;
  password2: any;

  canceledTickets: [] = [];

  constructor(config: NgbModalConfig, private modalService: NgbModal, private location: Location,
    private router: Router, private route: ActivatedRoute, private clientRestService: ClientRestService) {
    this.location.go('client/profile');
    // this.active.emit('profile');

    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }


  ngOnInit(): void {
    this.clientInfo();
  }

  update(): void {
    this.clientRestService.update(this.client).subscribe((client) => {
      if (client.errors) {
        this.clientOutput.emit(client);
        this.canceledTickets = [].constructor(client.numberCanceledTickets)
        console.log(this.canceledTickets.length);

        this.client = client;
      }
    })
  }

  clientInfo(): void {
    this.clientRestService.getClientInfo().subscribe((client) => {
      this.clientOutput.emit(client);
      this.canceledTickets = [].constructor(client.numberCanceledTickets)
      this.client = client;
    })
  }

  updatePassword(): void {
    if (this.password1 == this.password2) {
      this.clientRestService.updatePassword(this.password1).subscribe((client) => {
        this.client = client;
        this.password1 = '';
        this.password2 = '';
      })
    }
  }
}

