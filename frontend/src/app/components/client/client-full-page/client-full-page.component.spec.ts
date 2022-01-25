import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFullPageComponent } from './client-full-page.component';

describe('ClientFullPageComponent', () => {
  let component: ClientFullPageComponent;
  let fixture: ComponentFixture<ClientFullPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFullPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
