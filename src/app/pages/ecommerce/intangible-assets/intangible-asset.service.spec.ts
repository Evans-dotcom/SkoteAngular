import { TestBed } from '@angular/core/testing';

import { IntangibleAssetService } from './intangible-asset.service';

describe('IntangibleAssetService', () => {
  let service: IntangibleAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntangibleAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
