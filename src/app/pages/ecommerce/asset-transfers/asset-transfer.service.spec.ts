import { TestBed } from '@angular/core/testing';

import { AssetTransferService } from './asset-transfer.service';

describe('AssetTransferService', () => {
  let service: AssetTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
