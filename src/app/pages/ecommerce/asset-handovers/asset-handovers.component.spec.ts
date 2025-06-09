import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetHandoversComponent } from './asset-handovers.component';

describe('AssetHandoversComponent', () => {
  let component: AssetHandoversComponent;
  let fixture: ComponentFixture<AssetHandoversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetHandoversComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetHandoversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
