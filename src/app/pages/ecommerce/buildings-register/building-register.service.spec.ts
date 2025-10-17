import { TestBed } from '@angular/core/testing';
import { BuildingsRegisterService } from './building-register.service';


describe('BuildingRegisterService', () => {
  let service: BuildingsRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildingsRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
