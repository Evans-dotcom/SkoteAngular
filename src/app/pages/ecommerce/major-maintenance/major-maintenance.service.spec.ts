import { TestBed } from '@angular/core/testing';

import { MajorMaintenanceService } from './major-maintenance.service';

describe('MajorMaintenanceService', () => {
  let service: MajorMaintenanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MajorMaintenanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
