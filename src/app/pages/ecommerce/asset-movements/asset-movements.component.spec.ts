import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMovementsComponent } from './asset-movements.component';

describe('AssetMovementsComponent', () => {
  let component: AssetMovementsComponent;
  let fixture: ComponentFixture<AssetMovementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetMovementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
