import { Component, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { EventsObject, InfoService } from '../info.service';

import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code-event',
  imports: [],
  templateUrl: './qr-code-event.component.html',
  styleUrl: './qr-code-event.component.scss',
  standalone: true
})
export class QrCodeEventComponent implements OnDestroy {

  infoService = inject(InfoService);
  elementRef = inject(ElementRef);

  event = input.required<EventsObject>();

  drawEffect = effect(() => {

    const event = this.event();
    const canvas = (this.elementRef.nativeElement as HTMLElement).querySelector('canvas');

    if (event && canvas) {
      const ev = this.infoService.getICalendarQRCodeText(event);
      QRCode.toCanvas(canvas, ev);
    }
  });

  ngOnDestroy(): void {
    this.drawEffect.destroy();
  }

}
