import { Component, inject } from '@angular/core';
import { InfoService } from '../../shared/info.service';
import { CommonModule } from '@angular/common';
import { CompartementComponent } from '../../shared/compartement/compartement.component';
import { UtilTooltipModule } from '../../shared/util-tooltip/util-tooltip.module';
import { take } from 'rxjs';


@Component({
  selector: 'app-start',
  imports: [CommonModule, CompartementComponent, UtilTooltipModule],

  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {

  infoService = inject(InfoService);

  downloadNextEvent(nextEvent: Parameters<(typeof this.infoService.downloadEvents)>[0][number]) {
    this.infoService.downloadEvents([nextEvent], 'naechter-spieleabend');
  }

  downloadAllFutureEvents() {
    this.infoService.futureEvents().pipe(take(1)).subscribe(futureEvents => {
      this.infoService.downloadEvents(futureEvents, 'alle-weitere-spieleabende');
    });
  }

  getDayTimeLabel(event: Parameters<(typeof this.infoService.downloadEvents)>[0][number]) {
    const h = event.startTime.hour;
    const m = event.startTime.minute;
    const mStr = matchMedia.toString().padStart(2, '0');
    return 'Ab ' + h + (m > 0 ? (':' + mStr) : '') + ' Uhr';
  }

}
