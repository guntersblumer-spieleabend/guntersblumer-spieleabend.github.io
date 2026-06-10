import { AfterViewInit, Component, DOCUMENT, ElementRef, inject, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WebsiteService } from '../../shared/website.service';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MobileDateFormComponent } from '../../shared/mobile-date-form/mobile-date-form.component';

@Component({
  selector: 'app-contact',
  imports: [
    FormsModule,
    AsyncPipe,
    MobileDateFormComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements AfterViewInit {

  renderer2 = inject(Renderer2);
  elementRef = inject(ElementRef);
  documentObj = inject(DOCUMENT);
  websiteService = inject(WebsiteService);

  num = 1;
  removable$ = new BehaviorSubject(true);

  ngAfterViewInit(): void {
    setTimeout(() => {

      this.websiteService.addStyle(`

        ::view-transition-old(li-fade-out) {
          animation: fade-out 1000ms ease-in forwards;
          z-index: 10000000000;
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            translate: 0;
          }
          to {
            opacity: 0;
            translate: 100px;
          }
        }
      `);

      this.addEl();
    }, 100);

  }

  toggle(e: PointerEvent) {

    const target = e.target as HTMLElement;
    if (target.tagName === 'LI') {
      this.documentObj.startViewTransition(() => {
        target.classList.toggle('clicked');
      });
    }

  }

  addEl() {
    const host = this.elementRef.nativeElement as HTMLElement;
    const ulEl = host.querySelector('ul');

    const liEl = this.renderer2.createElement('li') as HTMLLIElement;
    liEl.textContent = 'Element ' + this.num;
    liEl.style.viewTransitionName = 'li-element-' + this.num;
    this.num++;

    this.renderer2.appendChild(ulEl, liEl);
  }

  removeEl() {

    const host = this.elementRef.nativeElement as HTMLElement;
    const lis = Array.from(host.querySelectorAll('li'));

    if (lis.length > 0) {
      const rndEl = lis.at(this.getRandomInt(0, lis.length - 1));

      if (rndEl) {
        rndEl.style.viewTransitionName = 'li-fade-out';

        // This code runs inside the transition.
        // The browser takes a snapshot BEFORE this runs,
        // and another snapshot AFTER it finishes.
        const transition = this.documentObj.startViewTransition(() => {
          rndEl.remove();
        });

        let timeStart = 0;

        transition.ready.then(() => {
          this.removable$.next(false);
          console.log('transition is ready');
          timeStart = Date.now();
        });

        transition.finished.then(() => {
          const delta = Date.now() - timeStart;
          this.removable$.next(true);
          console.log('transition is finished, delta =', delta);
        });
      }


    }

  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
