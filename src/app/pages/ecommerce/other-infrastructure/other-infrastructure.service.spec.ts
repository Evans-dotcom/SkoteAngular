import { TestBed } from '@angular/core/testing';

import { OtherInfrastructureService } from './other-infrastructure.service';

describe('OtherInfrastructureService', () => {
  let service: OtherInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
