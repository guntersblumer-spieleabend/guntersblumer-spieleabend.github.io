import { Injectable } from '@angular/core';
import NewsJson from '../../public/news.json';
import EventsJson from '../../public/events.json';
import FaqsJson from '../../public/faqs.json';
import { BehaviorSubject, map } from 'rxjs';

type GermanDateRange = {
  dateFrom?: string;
  dateTo?: string;
  // calculated from the script
  dateFromRaw?: number;
  dateToRaw?: number;
  isCurrent?: boolean;
};

export type NewsObject = {
  html: string;
} & GermanDateRange;

export type EventsObject = {
  location: string;
  number: number;
} & GermanDateRange;

export type Faq = {
  questionHtml: string;
  answerHtml: string;
}


@Injectable({
  providedIn: 'root',
})
export class InfoService {

  newBehaviorSubject = new BehaviorSubject<NewsObject[]>([]);
  news$ = this.newBehaviorSubject.asObservable();

  eventsBehaviorSubject = new BehaviorSubject<EventsObject[]>([]);
  events$ = this.eventsBehaviorSubject.asObservable();

  faqsBehaviorSubject = new BehaviorSubject<Faq[]>([]);
  faqs$ = this.faqsBehaviorSubject.asObservable();

  constructor() {
    this.newBehaviorSubject.next(this.sortGermanDateRangeObjects(NewsJson.news, 'none'));
    this.eventsBehaviorSubject.next(this.sortGermanDateRangeObjects(EventsJson.events, 'asc'));
    this.faqsBehaviorSubject.next(FaqsJson.faqs);
  }

  sortGermanDateRangeObjects<T extends GermanDateRange>(arr: T[], sortType: 'asc' | 'desc' | 'none') {
    const now = Date.now();
    arr.forEach(obj => {
      if (obj.dateFrom) {
        obj.dateFromRaw = this.getDateFromString(obj.dateFrom).getTime();
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

    const now = Date.now();

    return this.events$.pipe(map(events => {
      const newArr = structuredClone(events);
      const nextEvent = newArr.filter(e => e.dateFromRaw! >= now).sort((a, b) => a.dateFromRaw! - b.dateFromRaw!)?.[0];
      return nextEvent;
    }));

  }

}
