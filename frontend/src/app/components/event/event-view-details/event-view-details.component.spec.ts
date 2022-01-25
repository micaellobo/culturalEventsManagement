import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventViewDetailsComponent } from './event-view-details.component';

describe('EventViewDetailsComponent', () => {
  let component: EventViewDetailsComponent;
  let fixture: ComponentFixture<EventViewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventViewDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventViewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
