import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientViewProfileComponent } from './client-view-profile.component';

describe('ClientViewProfileComponent', () => {
  let component: ClientViewProfileComponent;
  let fixture: ComponentFixture<ClientViewProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientViewProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientViewProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
