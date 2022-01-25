import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllPromotersComponent } from './admin-all-promoters.component';

describe('AdminAllPromotersComponent', () => {
  let component: AdminAllPromotersComponent;
  let fixture: ComponentFixture<AdminAllPromotersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAllPromotersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAllPromotersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
