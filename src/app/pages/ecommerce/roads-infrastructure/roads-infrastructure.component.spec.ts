import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadsInfrastructureComponent } from './roads-infrastructure.component';

describe('RoadsInfrastructureComponent', () => {
  let component: RoadsInfrastructureComponent;
  let fixture: ComponentFixture<RoadsInfrastructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoadsInfrastructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadsInfrastructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
