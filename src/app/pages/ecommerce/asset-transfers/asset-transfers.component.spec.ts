import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTransfersComponent } from './asset-transfers.component';

describe('AssetTransfersComponent', () => {
  let component: AssetTransfersComponent;
  let fixture: ComponentFixture<AssetTransfersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetTransfersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTransfersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
