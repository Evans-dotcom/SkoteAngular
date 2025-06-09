import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevaluationsComponent } from './revaluations.component';

describe('RevaluationsComponent', () => {
  let component: RevaluationsComponent;
  let fixture: ComponentFixture<RevaluationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevaluationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevaluationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
