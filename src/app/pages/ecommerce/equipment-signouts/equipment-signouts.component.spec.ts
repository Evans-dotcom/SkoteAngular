import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentSignoutsComponent } from './equipment-signouts.component';

describe('EquipmentSignoutsComponent', () => {
  let component: EquipmentSignoutsComponent;
  let fixture: ComponentFixture<EquipmentSignoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentSignoutsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentSignoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
