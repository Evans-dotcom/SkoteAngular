import { TestBed } from '@angular/core/testing';

import { StandardassetsService } from './standardassets.service';

describe('StandardassetsService', () => {
  let service: StandardassetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StandardassetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
