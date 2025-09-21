import { TestBed } from '@angular/core/testing';

import { AssetReconciliationService } from './asset-reconciliation.service';

describe('AssetReconciliationService', () => {
  let service: AssetReconciliationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetReconciliationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
