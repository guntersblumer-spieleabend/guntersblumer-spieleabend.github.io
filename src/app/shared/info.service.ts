import { DOCUMENT, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type GermanDateRange = {
  dateObjectFrom?: Date;
  dateFrom?: string;
  dateTo?: string;
  // calculated from the script
  hourDuration?: number;
  dateFromRaw?: number;
  dateFromWeekDay?: string;
  dateToRaw?: number;
  isCurrent?: boolean;
};

export type NewsObject = {
  html: string;
} & GermanDateRange;

export type EventsObject = {
  label?: string;
  location: string;
  number: number;
  startTime: {hour: number; minute: number;};
} & GermanDateRange;

export type Faq = {
  questionHtml: string;
  answerHtml: string;
}


@Injectable({
  providedIn: 'root',
})
export class InfoService {

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private httpClient = inject(HttpClient);
  private documentObject = inject(DOCUMENT);

  private newsBehaviorSubject = new BehaviorSubject<NewsObject[]>([]);
  news$ = this.newsBehaviorSubject.asObservable();

  private eventsBehaviorSubject = new BehaviorSubject<EventsObject[]>([]);
  events$ = this.eventsBehaviorSubject.asObservable();

  private faqsBehaviorSubject = new BehaviorSubject<Faq[]>([]);
  faqs$ = this.faqsBehaviorSubject.asObservable();

  constructor() {

    if (this.isBrowser) {

      this.httpClient.get<{events: EventsObject[];}>('events.json').subscribe(res => {
        this.eventsBehaviorSubject.next(this.sortGermanDateRangeObjects(res.events, 'asc'));
      });

      this.httpClient.get<{faqs: Faq[];}>('faqs.json').subscribe(res => {
        this.faqsBehaviorSubject.next(res.faqs);
      });

      this.httpClient.get<{news: NewsObject[]}>('news.json').subscribe(res => {
        this.newsBehaviorSubject.next(this.sortGermanDateRangeObjects(res.news, 'asc'));
      });

    } else {
      this.newsBehaviorSubject.next([]);
      this.eventsBehaviorSubject.next([]);
      this.faqsBehaviorSubject.next([]);
    }

  }

  sortGermanDateRangeObjects<T extends GermanDateRange>(arr: T[], sortType: 'asc' | 'desc' | 'none') {
    const now = Date.now();
    arr.forEach(obj => {
      if (obj.dateFrom) {
        obj.dateObjectFrom = this.getDateFromString(obj.dateFrom);
        obj.dateFromRaw = obj.dateObjectFrom.getTime();
        obj.dateFromWeekDay = new Intl.DateTimeFormat('de', {weekday: 'short'}).format(obj.dateObjectFrom);
      } else {
        obj.dateFromRaw = now;
      }
      if (obj.dateTo) {
        obj.dateToRaw = this.getDateFromString(obj.dateTo).getTime();
      } else {
        obj.dateToRaw = Number.MAX_SAFE_INTEGER;
      }
      obj.isCurrent = obj.dateFromRaw <= now && now <= obj.dateToRaw;
    });

    if (sortType === 'asc') {
      arr = arr.sort((a, b) => b.dateFromRaw! - a.dateFromRaw!);
    }
    if (sortType === 'desc') {
      arr = arr.sort((a, b) => a.dateFromRaw! - b.dateFromRaw!);
    }

    return arr as T[];
  }

  getDateFromString(str: string) {
    const [day, month, fullYear] = str.split('.').map(str => parseInt(str, 10));

    return new Date(fullYear, month - 1, day, 0, 0, 0);
  }

  nextEvent() {
    return this.futureEvents().pipe(map(fEvents => fEvents?.[0]));
  }

  futureEvents() {
    const offsetDelta = 1000 * 60 * 60 * 24; // ms of 1 day
    // ms of yesterday
    const now = Date.now() - offsetDelta;

    return this.events$.pipe(map(events => {
      const newArr = structuredClone(events);
      const futureEvents = newArr.filter(e => e.dateFromRaw! >= now).sort((a, b) => a.dateFromRaw! - b.dateFromRaw!) || [];
      return futureEvents;
    }));
  }

  sendContact() {

    // uses https://formspree.io - NOT DSGVO / GDPR save
    const formSpreeId = 'xbdqaepv';
    const url = 'https://formspree.io/f/' + formSpreeId;

    const formData = new FormData();
    formData.append('email', 'test@mock.de');
    formData.append('name', 'Test');

    this.httpClient.post(url, formData, {}).subscribe(res => {
      console.log('Formdata send to ', {url, formData, result: res});
    });
  }

  downloadEvents(events: EventsObject[], fileName = 'calendar-event') {

    const iCalData = this.getICalendarFileText(events);

    const data = new Blob([iCalData], {type: 'text/calendar', endings: 'native'});
    const a = this.documentObject.createElement('a');
    a.download = fileName + '.ics';
    a.href = URL.createObjectURL(data);
    a.click();
    URL.revokeObjectURL(a.href);

  }

  getICalendarFileText(events: EventsObject[]): string {

    const now = new Date();

    function paddNum(num: string | number) {
      if (typeof num === 'number') {
        num = num + '';
      }
      if (typeof num === 'string') {
        num = num.padStart(2, '0');
      }
      return num;
    }

    const hOffset = paddNum(Math.round(now.getTimezoneOffset() / 60));
    const minOffset = paddNum(Math.round(now.getTimezoneOffset() % 60));
    const offset = hOffset + minOffset;

    const t1 = (now.getFullYear() + '') + paddNum(now.getMonth() + 1) + paddNum(now.getDate()) + 'T';
    const t2 = paddNum(now.getHours()) + paddNum(now.getMinutes()) + paddNum(now.getSeconds());
    const todayStr = t1 + t2;

    const orginizer = 'Daniel Meurer';
    const orginzerEmail = 'guntersblumer_spieleabend@proton.me';

    let lines: string[] = [];

    lines.push('BEGIN:VCALENDAR');
    lines.push('VERSION:2.0');

    lines.push('PRODID:DanielMeurerJavaScript');
    lines.push('CALSCALE:GREGORIAN');

    events.forEach((event, i) => {

      const [date, month, year] = event.dateFrom!.split('.');

      const startStr = year + month + date + 'T' + paddNum(event.startTime.hour + '') + paddNum(event.startTime.minute) + '00' + offset;

      const hDuration = 4;
      // const end = new Date(parseInt(year, 10), parseInt(month) - 1, parseInt(date, 10), event.startTime.hour + duration, mins);
      // const endStr = formatICalDate(end);

      const label = event.number +  '. Guntersblumer Spieleabend';

      lines.push('BEGIN:VEVENT');

      lines.push('UID:uid_' + event.number + 'guntersblumerspieleabend');

      lines.push('SUMMARY:' + label);
      lines.push('LOCATION:' + event.location);
      lines.push('ORGANIZER;CN=' + orginizer + ':MAILTO:' + orginzerEmail);
      lines.push('DTSTAMP:' + todayStr);

      lines.push('DTSTART:' + startStr);
      lines.push('DURATION:PT' + hDuration + 'H');

      lines.push('END:VEVENT');

    });

    lines.push('END:VCALENDAR');

    // The iCalendar standard requires CRLF (Carriage Return + Line Feed) line endings
    return lines.join('\r\n');


  }

  getICalendarQRCodeText(event: EventsObject) {

    function formatICalDate(date: Date) {
      const iso = date.toISOString();
      const res = iso.replace(/[-:]/g, '').split('.')[0] + '';
      return res;
    }

    const now = new Date();

    const lines: string[] = [];

    const [date, month, year] = event.dateFrom!.split('.');

    const mins = event.startTime.minute - now.getTimezoneOffset();
    const start = new Date(parseInt(year, 10), parseInt(month) - 1, parseInt(date, 10), event.startTime.hour, mins);
    const startStr = formatICalDate(start);

    const durationH = event.hourDuration || 4;
    let durationSec = Math.round(60 * 60 * durationH);

    const end = new Date(parseInt(year, 10), parseInt(month) - 1, parseInt(date, 10), event.startTime.hour, mins, durationSec);
    const endStr = formatICalDate(end);

    const label = event.label || event.number +  '. Guntersblumer Spieleabend';

    lines.push('BEGIN:VEVENT');

    lines.push('SUMMARY:' + label);
    lines.push('LOCATION:' + event.location);
    lines.push('DTSTART:' + startStr);
    lines.push('DTEND:' + endStr);

    lines.push('END:VEVENT');

    // The iCalendar standard requires CRLF (Carriage Return + Line Feed) line endings
    return lines.join('\r\n');

  }

}
