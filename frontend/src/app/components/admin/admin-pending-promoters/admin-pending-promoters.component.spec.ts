import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPendingPromotersComponent } from './admin-pending-promoters.component';

describe('AdminPendingPromotersComponent', () => {
  let component: AdminPendingPromotersComponent;
  let fixture: ComponentFixture<AdminPendingPromotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPendingPromotersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPendingPromotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
