import { TestBed } from '@angular/core/testing';

import { ClientRestService } from './client.rest.service';

describe('Client.RestService', () => {
  let service: ClientRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
