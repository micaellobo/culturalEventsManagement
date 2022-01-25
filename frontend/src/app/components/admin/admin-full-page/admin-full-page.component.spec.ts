import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFullPageComponent } from './admin-full-page.component';

describe('AdminFullPageComponent', () => {
  let component: AdminFullPageComponent;
  let fixture: ComponentFixture<AdminFullPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFullPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFullPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
