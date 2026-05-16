import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrCodeEventComponent } from './qr-code-event.component';

describe('QrCodeEventComponent', () => {
  let component: QrCodeEventComponent;
  let fixture: ComponentFixture<QrCodeEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrCodeEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeEventComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
