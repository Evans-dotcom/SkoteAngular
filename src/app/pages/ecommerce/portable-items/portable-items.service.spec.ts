import { TestBed } from '@angular/core/testing';

import { PortableItemsService } from './portable-items.service';

describe('PortableItemsService', () => {
  let service: PortableItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortableItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
