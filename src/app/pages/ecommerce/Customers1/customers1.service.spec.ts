import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customers1.service';

describe('Customers1Service', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
