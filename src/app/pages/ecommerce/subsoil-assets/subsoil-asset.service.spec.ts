import { TestBed } from '@angular/core/testing';

import { SubsoilAssetService } from './subsoil-asset.service';

describe('SubsoilAssetService', () => {
  let service: SubsoilAssetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsoilAssetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
