import { TestBed } from '@angular/core/testing';

import { JwtClientGuard } from './jwtClient.guard';

describe('JwtGuard', () => {
  let guard: JwtClientGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JwtClientGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
