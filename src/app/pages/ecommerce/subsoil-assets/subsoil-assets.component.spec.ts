import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsoilAssetsComponent } from './subsoil-assets.component';

describe('SubsoilAssetsComponent', () => {
  let component: SubsoilAssetsComponent;
  let fixture: ComponentFixture<SubsoilAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubsoilAssetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsoilAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
