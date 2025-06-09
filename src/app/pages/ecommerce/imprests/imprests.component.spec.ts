import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprestsComponent } from './imprests.component';

describe('ImprestsComponent', () => {
  let component: ImprestsComponent;
  let fixture: ComponentFixture<ImprestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
