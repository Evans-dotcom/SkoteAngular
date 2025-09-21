import { TestBed } from '@angular/core/testing';

import { BiologicalAssetsService } from './biological-assets.service';

describe('BiologicalAssetsService', () => {
  let service: BiologicalAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiologicalAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
