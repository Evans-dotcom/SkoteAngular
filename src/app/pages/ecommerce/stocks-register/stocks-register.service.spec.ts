import { TestBed } from '@angular/core/testing';

import { StocksRegisterService } from './stocks-register.service';

describe('StocksRegisterService', () => {
  let service: StocksRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StocksRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
