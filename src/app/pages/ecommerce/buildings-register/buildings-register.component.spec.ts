import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingsRegisterComponent } from './buildings-register.component';

describe('BuildingsRegisterComponent', () => {
  let component: BuildingsRegisterComponent;
  let fixture: ComponentFixture<BuildingsRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingsRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
