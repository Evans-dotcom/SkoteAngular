import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherReceivablesComponent } from './other-receivables.component';

describe('OtherReceivablesComponent', () => {
  let component: OtherReceivablesComponent;
  let fixture: ComponentFixture<OtherReceivablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherReceivablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
