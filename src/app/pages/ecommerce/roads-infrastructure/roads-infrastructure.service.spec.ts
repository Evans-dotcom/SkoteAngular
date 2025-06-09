import { TestBed } from '@angular/core/testing';

import { RoadsInfrastructureService } from './roads-infrastructure.service';

describe('RoadsInfrastructureService', () => {
  let service: RoadsInfrastructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoadsInfrastructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
