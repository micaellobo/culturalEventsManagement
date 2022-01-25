import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitCovidTestComponent } from './submit-covid-test.component';

describe('SubmitCovidTestComponent', () => {
  let component: SubmitCovidTestComponent;
  let fixture: ComponentFixture<SubmitCovidTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitCovidTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitCovidTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
