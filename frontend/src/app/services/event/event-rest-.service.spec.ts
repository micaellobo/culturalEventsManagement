import { TestBed } from '@angular/core/testing';

import { EventRestService } from './event-rest-.service';

describe('EventRestService', () => {
  let service: EventRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
