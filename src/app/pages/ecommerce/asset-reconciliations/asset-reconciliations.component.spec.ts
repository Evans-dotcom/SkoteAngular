import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetReconciliationsComponent } from './asset-reconciliations.component';

describe('AssetReconciliationsComponent', () => {
  let component: AssetReconciliationsComponent;
  let fixture: ComponentFixture<AssetReconciliationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetReconciliationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetReconciliationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
