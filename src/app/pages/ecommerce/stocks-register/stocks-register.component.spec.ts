import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StocksRegisterComponent } from './stocks-register.component';

describe('StocksRegisterComponent', () => {
  let component: StocksRegisterComponent;
  let fixture: ComponentFixture<StocksRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StocksRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
