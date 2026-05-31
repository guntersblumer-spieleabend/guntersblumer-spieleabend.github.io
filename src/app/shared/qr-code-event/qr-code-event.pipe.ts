import { inject, Pipe, PipeTransform } from '@angular/core';
import { EventsObject, InfoService } from '../info.service';

@Pipe({
  name: 'qrCodeEvent',
  pure: true,
  standalone: true
})
export class QrCodeEventPipe implements PipeTransform {

  infoService = inject(InfoService);

  transform(value: EventsObject, ...args: unknown[]): string {
    return value ? this.infoService.getICalendarQRCodeText(value) : '';
  }
}
