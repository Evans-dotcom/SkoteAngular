import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandRegisterComponent } from './land-register.component';

describe('LandRegisterComponent', () => {
  let component: LandRegisterComponent;
  let fixture: ComponentFixture<LandRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
