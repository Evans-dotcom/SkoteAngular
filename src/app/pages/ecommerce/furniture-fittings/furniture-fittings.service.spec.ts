import { TestBed } from '@angular/core/testing';

import { FurnitureFittingsService } from './furniture-fittings.service';

describe('FurnitureFittingsService', () => {
  let service: FurnitureFittingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FurnitureFittingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
