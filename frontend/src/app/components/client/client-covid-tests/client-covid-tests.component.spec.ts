import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCovidTestsComponent } from './client-covid-tests.component';

describe('ClientCovidTestsComponent', () => {
  let component: ClientCovidTestsComponent;
  let fixture: ComponentFixture<ClientCovidTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCovidTestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCovidTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
