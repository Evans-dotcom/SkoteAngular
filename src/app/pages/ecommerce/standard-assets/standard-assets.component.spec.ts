import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAssetsComponent } from './standard-assets.component';

describe('StandardAssetsComponent', () => {
  let component: StandardAssetsComponent;
  let fixture: ComponentFixture<StandardAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
