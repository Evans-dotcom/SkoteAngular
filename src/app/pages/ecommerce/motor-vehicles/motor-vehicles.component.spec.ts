import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorVehiclesComponent } from './motor-vehicles.component';

describe('MotorVehiclesComponent', () => {
  let component: MotorVehiclesComponent;
  let fixture: ComponentFixture<MotorVehiclesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorVehiclesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
