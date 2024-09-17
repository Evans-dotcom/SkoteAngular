import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CyptolandingComponent } from './cyptolanding.component';
import '@types/jest';

describe('CyptolandingComponent', () => {
  let component: CyptolandingComponent;
  let fixture: ComponentFixture<CyptolandingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CyptolandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CyptolandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
function beforeEach(arg0: (done: any) => any) {
  throw new Error('Function not implemented.');
}

