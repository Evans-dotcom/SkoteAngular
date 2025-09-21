import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImprestComponent } from './imprests.component';


describe('ImprestsComponent', () => {
  let component: ImprestComponent;
  let fixture: ComponentFixture<ImprestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
