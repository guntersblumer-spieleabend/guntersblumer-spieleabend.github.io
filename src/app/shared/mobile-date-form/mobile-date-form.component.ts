import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, Subscription } from 'rxjs';
import { QrCodeEventPipe } from '../qr-code-event/qr-code-event.pipe';
import { QRCodeComponent } from 'angularx-qrcode';
import { EventsObject } from '../info.service';

@Component({
  selector: 'app-mobile-date-form',
  imports: [
    FormsModule,
    AsyncPipe,
    QrCodeEventPipe,
    QRCodeComponent
  ],
  templateUrl: './mobile-date-form.component.html',
  styleUrl: './mobile-date-form.component.scss',
})
export class MobileDateFormComponent implements OnDestroy {

  private _label = new BehaviorSubject('');
  private _location = new BehaviorSubject('');
  private _date = new BehaviorSubject('');
  private _time = new BehaviorSubject('');
  private _duration = new BehaviorSubject('');

  private createEventSub: Subscription;
  event$ = new BehaviorSubject<EventsObject>(null!);

  constructor() {

    const today = new Date();
    const p = (num: number) => {
      return (num + '').padStart(2, '0');
    };
    this._date.next(`${p(today.getDate())}.${p(today.getMonth() + 1)}.${p(today.getFullYear())}`);

    this.createEventSub = combineLatest([
      this._label,
      this._location,
      this._date,
      this._time,
      this._duration
    ])
    .pipe(
      debounceTime(1000)
    )
    .subscribe(([label, location, date, time, duration]) => {

      if (label && location && date && time && duration) {

        const [h, min] = (time || '').split(':');

        const ev: EventsObject = {
          label,
          location,
          number: 0,
          dateFrom: date,
          startTime: {
            hour: parseInt(h || '0', 10),
            minute: parseInt(min || '0', 10)
          },
          hourDuration: duration ? parseFloat(duration || '0') : 0,

        };

        this.event$.next(ev);

      } else {
        this.event$.next(null!);
      }


    });

  }

  ngOnDestroy(): void {
    this.createEventSub?.unsubscribe();
  }

  get label() {
    return this._label.value;
  }

  set label(value) {
    this._label.next(value);
  }

  get location() {
    return this._location.value;
  }

  set location(value) {
    this._location.next(value);
  }

  get date() {
    return this._date.value;
  }

  set date(value) {
    this._date.next(value);
  }

  get time() {
    return this._time.value;
  }

  set time(value) {
    this._time.next(value);
  }

  get duration() {
    return this._duration.value;
  }

  set duration(value) {
    this._duration.next(value);
  }

}
