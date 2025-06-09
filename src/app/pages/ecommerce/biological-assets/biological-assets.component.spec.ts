import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiologicalAssetsComponent } from './biological-assets.component';

describe('BiologicalAssetsComponent', () => {
  let component: BiologicalAssetsComponent;
  let fixture: ComponentFixture<BiologicalAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiologicalAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiologicalAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
