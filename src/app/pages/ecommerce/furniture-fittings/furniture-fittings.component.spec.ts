import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureFittingsComponent } from './furniture-fittings.component';

describe('FurnitureFittingsComponent', () => {
  let component: FurnitureFittingsComponent;
  let fixture: ComponentFixture<FurnitureFittingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FurnitureFittingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FurnitureFittingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
