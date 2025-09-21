import { TestBed } from '@angular/core/testing';

import { AssetHandoverService } from './asset-handover.service';

describe('AssetHandoverService', () => {
  let service: AssetHandoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetHandoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
