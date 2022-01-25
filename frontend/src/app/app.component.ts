import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  promoterURL = `${environment.endpoint}event/list`
  aboutUsURL = `${environment.endpoint}aboutUs`

  private observableSubscription: Subscription[] = [];

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.observableSubscription.forEach(subscription => {
      subscription.unsubscribe();
    })
  }


}
