import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartementComponent } from './compartement.component';

describe('CompartementComponent', () => {
  let component: CompartementComponent;
  let fixture: ComponentFixture<CompartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompartementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompartementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
