import { TestBed } from '@angular/core/testing';

import { MotorVehicleService } from './motor-vehicle.service';

describe('MotorVehicleService', () => {
  let service: MotorVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotorVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
