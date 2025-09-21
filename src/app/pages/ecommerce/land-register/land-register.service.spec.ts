import { TestBed } from '@angular/core/testing';

import { LandRegisterService } from './land-register.service';

describe('LandRegisterService', () => {
  let service: LandRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
