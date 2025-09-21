import { TestBed } from '@angular/core/testing';

import { EquipmentSignoutService } from './equipment-signout.service';

describe('EquipmentSignoutService', () => {
  let service: EquipmentSignoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentSignoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
