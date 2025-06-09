import { TestBed } from '@angular/core/testing';

import { ImprestService } from './imprests.service';

describe('ImprestService', () => {
  let service: ImprestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImprestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
