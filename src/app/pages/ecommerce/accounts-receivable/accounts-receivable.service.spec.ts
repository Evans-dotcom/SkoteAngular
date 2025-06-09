import { TestBed } from '@angular/core/testing';

import { AccountsReceivableService } from './accounts-receivable.service';

describe('AccountsReceivableService', () => {
  let service: AccountsReceivableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountsReceivableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
