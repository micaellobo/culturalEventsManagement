import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientListTicketsComponent } from './client-list-tickets.component';

describe('ClientListTicketsComponent', () => {
  let component: ClientListTicketsComponent;
  let fixture: ComponentFixture<ClientListTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientListTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientListTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
