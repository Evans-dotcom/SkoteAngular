import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortableItemsComponent } from './portable-items.component';

describe('PortableItemsComponent', () => {
  let component: PortableItemsComponent;
  let fixture: ComponentFixture<PortableItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PortableItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PortableItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
