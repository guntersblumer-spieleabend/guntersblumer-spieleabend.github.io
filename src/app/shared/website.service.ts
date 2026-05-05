import { DOCUMENT, inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {

  private styleNum = 0;
  private documentObject = inject(DOCUMENT);

  addStyle(text: string, id?: string) {

    id ||= ('WebsiteServiceStyle_' + ++this.styleNum);

    const found = this.documentObject.head.querySelector('#' + id) as HTMLStyleElement;

    if (!found) {

      const styleEl = this.documentObject.createElement('style');
      styleEl.setAttribute('id', id);

      styleEl.innerText = text;

      this.documentObject.head.appendChild(styleEl);

    }

    return !!found;

  }

}
