import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileDateFormComponent } from './mobile-date-form.component';

describe('MobileDateFormComponent', () => {
  let component: MobileDateFormComponent;
  let fixture: ComponentFixture<MobileDateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileDateFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileDateFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
