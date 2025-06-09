import { TestBed } from '@angular/core/testing';

import { PlantMachineryService } from './plant-machinery.service';

describe('PlantMachineryService', () => {
  let service: PlantMachineryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantMachineryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
