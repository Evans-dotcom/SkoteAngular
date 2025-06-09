import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInfrastructureComponent } from './other-infrastructure.component';

describe('OtherInfrastructureComponent', () => {
  let component: OtherInfrastructureComponent;
  let fixture: ComponentFixture<OtherInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
