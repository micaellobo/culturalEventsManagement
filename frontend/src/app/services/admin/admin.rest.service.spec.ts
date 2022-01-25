import { TestBed } from '@angular/core/testing';

import { AdminRestService } from './admin.rest.service';

describe('AdminRestService', () => {
  let service: AdminRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
