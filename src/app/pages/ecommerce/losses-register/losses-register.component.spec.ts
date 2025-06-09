import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossesRegisterComponent } from './losses-register.component';

describe('LossesRegisterComponent', () => {
  let component: LossesRegisterComponent;
  let fixture: ComponentFixture<LossesRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossesRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossesRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
