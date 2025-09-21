import { TestBed } from '@angular/core/testing';

import { AssetMovementService } from './asset-movement.service';

describe('AssetMovementService', () => {
  let service: AssetMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
