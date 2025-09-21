import { TestBed } from '@angular/core/testing';

import { BuildingRegisterService } from './building-register.service';

describe('BuildingRegisterService', () => {
  let service: BuildingRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
