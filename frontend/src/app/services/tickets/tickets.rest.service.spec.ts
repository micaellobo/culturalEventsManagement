import { TestBed } from '@angular/core/testing';

import { TicketsRestService } from './tickets.rest.service';

describe('Tickets.Rest.Service', () => {
  let service: TicketsRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
