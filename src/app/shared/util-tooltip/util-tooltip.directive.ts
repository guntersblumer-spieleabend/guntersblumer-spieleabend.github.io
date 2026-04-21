import { ApplicationRef, createComponent, Directive, DOCUMENT, ElementRef, EmbeddedViewRef, inject, Injector, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, delay, filter, Subscription } from 'rxjs';
import { UTIL_TOOLTIP_COMPONENT_DATA_INJECTION_TOKEN, UtilTooltipCause, UtilTooltipData } from './util-default-tooltip.component';
import { getPathToBody } from '../functions';


@Directive({
  selector: '[utilTooltip]',
  standalone: false
})
export class UtilTooltipDirective implements OnInit, OnDestroy {

  private static counter = 1;

  private elementRef = inject(ElementRef);
  private renderer2 = inject(Renderer2);
  private viewContainerRef = inject(ViewContainerRef);
  private injector = inject(Injector);
  private applicationRef = inject(ApplicationRef);
  private documentRef = inject(DOCUMENT);

  private uid = 'UtilTooltipDirective__instance_' + (UtilTooltipDirective.counter++);

  private tooltipEl: HTMLDivElement = null!;

  private _data$ = new BehaviorSubject<UtilTooltipData>({
    text: '',
    templateRef: null!,
    componentData: null!
  });

  private dataSub: Subscription = null!;
  private triggerSub: Subscription = null!;

  @Input('utilTooltip')
  set tooltipText(value: string) {
    if (typeof value === 'string') {
      this._data$.next({text: value, templateRef: null!});
    }
  }

  @Input()
  set utilTooltipTemplate(value: TemplateRef<any>) {
    if (value instanceof TemplateRef) {
      const data = this._data$.value;
      data.templateRef = value;
      this._data$.next(data);
    }
  }

  @Input()
  set utilTooltipComponentData(value: UtilTooltipData['componentData']) {
    const _data = this._data$.value;
    _data.componentData = value;
    _data.text = value?.data?.text || _data.text;
    this._data$.next(_data);
  }

  @Input()
  set utilTooltipTriggerCauses(value: UtilTooltipData['triggerCauses']) {
    const _data = this._data$.value;
    _data.triggerCauses = value || [];
    this._data$.next(_data);
  }

  @Input()
  set utilTooltipData(value: UtilTooltipData) {
    this._data$.next(value);
  }

  constructor() {

    let defaultStyleEl: HTMLStyleElement = this.documentRef.head.querySelector('#UtilTooltipStyle')!;

    if (!defaultStyleEl) {
      const defaultStyle = `
        .util-tooltip {
          background-color: transparent;
          border: 0px solid transparent;
          padding: 0;
          margin: 0;
        }

        .util-tooltip.util-tooltip-default {
          background-color: black;
          color: white;
          padding: .5ch 1ch;
          border-radius: .5ch;
          box-shadow: 1px 1px 4px 1px #333;
        }

        @position-try --ut-below-right {
          top: anchor(bottom);
          right: auto;
          bottom: auto;
          left: anchor(center);
        }

        @position-try --ut-below-left {
          top: anchor(bottom);
          right: anchor(center);
          bottom: auto;
          left: auto;
        }

        @position-try --ut-above-right {
          top: auto;
          right: auto;
          bottom: anchor(top);
          left: anchor(center);
        }

        @position-try --ut-above-left {
          top: auto;
          right: anchor(center);
          bottom: anchor(top);
          left: auto;
        }
      `;
      defaultStyleEl = this.documentRef.createElement('style');
      defaultStyleEl.setAttribute('id', 'UtilTooltipStyle');
      defaultStyleEl.innerText = defaultStyle;
      this.documentRef.head.appendChild(defaultStyleEl);
    }

  }

  ngOnInit(): void {

    this.dataSub = this._data$.pipe(
      filter(data => (!!data.text)),
      delay(10)
    ).subscribe(() =>{
      this.createPopoverElement();
    });

  }

  ngOnDestroy(): void {
    this.dataSub?.unsubscribe();
    this.triggerSub?.unsubscribe();

  }

  private isCause(cause: UtilTooltipCause) {
    return this._data$.value?.triggerCauses?.includes(cause);
  }

  private createPopoverElement() {

    const anchorEl = this.elementRef.nativeElement as HTMLElement;


    // does it already has an anchor name
    const existingAnchorName = anchorEl.style.getPropertyValue('anchor-name');

    const anchorName = existingAnchorName || '--tooltipHostAnchorVar_' + this.uid;

    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null!;
    }

    if (this._data$.value) {
      // default values
      this._data$.value.triggerCauses ||= ['focus', 'mouseOver'];
    }

    anchorEl.removeEventListener('mouseenter', this.mouseenterEventListener);
    anchorEl.removeEventListener('mouseleave', this.mouseleaveEventListener);
    anchorEl.removeEventListener('click', this.clickEventListener);
    anchorEl.removeEventListener('focus', this.focusEventListener);

    if (this.isCause('click')) {
      anchorEl.addEventListener('click', this.clickEventListener);
    }

    if (this.isCause('focus')) {
      anchorEl.addEventListener('focus', this.focusEventListener);
    }

    if (this.isCause('mouseOver')) {
      anchorEl.addEventListener('mouseenter', this.mouseenterEventListener);
      anchorEl.addEventListener('mouseleave', this.mouseleaveEventListener);
    }

    // host css anchor-name: ;
    anchorEl.style.setProperty('anchor-name', anchorName);

    // creating the tooltip element
    const tooltipEl = this.renderer2.createElement('div') as HTMLDivElement;
    this.renderer2.addClass(tooltipEl, 'util-tooltip');

    this.renderer2.setAttribute(tooltipEl, 'id', this.uid);
    this.renderer2.setAttribute(tooltipEl, 'popover', 'manual');

    // default anchor for tooltip element
    tooltipEl.style.setProperty('position-anchor', anchorName);

    tooltipEl.style.setProperty('position-try-fallbacks', '--ut-below-right, --ut-above-right, --ut-below-left, --ut-above-left');

    tooltipEl.style.setProperty('inset', 'unset');
    tooltipEl.style.setProperty('top', 'anchor(bottom)');
    tooltipEl.style.setProperty('left', 'anchor(center)');
    tooltipEl.style.setProperty('position-visibility', 'anchors-visible');


    // adding only text to the tooltip element
    if (!this._data$.value.templateRef && !this._data$.value.componentData) {
      this.renderer2.addClass(tooltipEl, 'util-tooltip-default');
      const textNode = this.renderer2.createText(this._data$.value.text);
      this.renderer2.appendChild(tooltipEl, textNode);
    }

    if (this._data$.value.templateRef && !this._data$.value.componentData) {
      const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this._data$.value.templateRef, { $implicit: this._data$.value.text });
      embeddedViewRef.rootNodes.forEach(node => {
        this.renderer2.appendChild(tooltipEl, node);
      });
      embeddedViewRef.markForCheck();
    }

    if (!this._data$.value.templateRef && this._data$.value.componentData) {
      // create the specialized injector based on the injector of the directive
      const environmentInjector = this.applicationRef.injector;

      const componentInjector = Injector.create({
        providers: [
          {
            provide: UTIL_TOOLTIP_COMPONENT_DATA_INJECTION_TOKEN,
            useValue: this._data$.value
          },
        ],
        name: 'tooltip-component-injector',
        parent: this.injector
      });
      // create the component
      const createdComponentRef = createComponent(this._data$.value.componentData.cmp, {
        elementInjector: componentInjector,
        environmentInjector
      });

      this.applicationRef.attachView(createdComponentRef.hostView);
      const cmpEl = (createdComponentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      this.renderer2.appendChild(tooltipEl, cmpEl);
    }

    // if host element is last child of its parent, then next sibling will be null
    const nextSibling = this.renderer2.nextSibling(anchorEl) as Element;

    if (nextSibling) {
      // insert tooltip element between host and next sibling
      this.renderer2.insertBefore(nextSibling.parentElement, tooltipEl, nextSibling);
    } else {
      // append tooltip element on host parent -> its last child -> it is host element's next sibling now
      this.renderer2.appendChild(anchorEl.parentElement, tooltipEl);
    }

    // host element receives popovertarget
    this.renderer2.setAttribute(anchorEl, 'popovertarget', this.uid);

    this.tooltipEl = tooltipEl;

    this.triggerSub?.unsubscribe();

    if (this.isCause('trigger') && this._data$.value.showAndHideTrigger$) {
      this.triggerSub = this._data$.value.showAndHideTrigger$.subscribe(showIt => {
        if (showIt) {
          this.tooltipEl?.showPopover();
        } else {
          this.tooltipEl?.hidePopover();
        }

      });
    }
  }

  private mouseenterEventListener = (e: MouseEvent) => {
    this.tooltipEl?.showPopover();
  };

  private mouseleaveEventListener = (e: MouseEvent) => {
    this.tooltipEl?.hidePopover();
  };

  private isTargetInEvent(target: Element, ev: Event) {
    const eventPath = ev.composedPath();
    return eventPath.includes(target);
  }

  private clickEventListener = (e: PointerEvent) => {
    this.tooltipEl?.showPopover();
    // this pointer event would trigger clickOutsideDetectionHandler() while bubbling down to the document
    // -> we stop propagation
    e.stopPropagation();
    this.registerPopupCloseEventHandler();
  };

  private focusEventListener = (e: FocusEvent) => {
    this.tooltipEl?.showPopover();
    this.registerPopupCloseEventHandler();
  };

  private clickOutsideDetectionHandler = (e2: PointerEvent) => {
    if (!this.isTargetInEvent(this.tooltipEl, e2)) {
      this.tooltipEl?.hidePopover();
      this.unregisterPopupCloseEventHandler();
    }
  };

  private focusOutsideDetectionHandler = (e2: FocusEvent) => {
    const blurredEl = e2.target as HTMLElement;
    const focussedEl = e2.relatedTarget as HTMLElement;

    const blurredElPath = getPathToBody(blurredEl);
    const focussedElPath = getPathToBody(focussedEl);

    const isBlurredElInPopup = blurredElPath.includes(this.tooltipEl);
    const isFocussedElInPopup = focussedElPath.includes(this.tooltipEl);

    const shouldCloseIt = isBlurredElInPopup && !isFocussedElInPopup;

    if (shouldCloseIt) {
      this.tooltipEl?.hidePopover();
      this.unregisterPopupCloseEventHandler();
    }

  };

  private escapeDetectionHandler = (e2: KeyboardEvent) => {
    if (e2.key === 'Escape') {
      this.tooltipEl?.hidePopover();
      this.unregisterPopupCloseEventHandler();
      e2.stopPropagation();
      e2.preventDefault();
    }
  };

  private registerPopupCloseEventHandler() {
    this.documentRef.body.addEventListener('click', this.clickOutsideDetectionHandler);
    this.tooltipEl.addEventListener('focusout', this.focusOutsideDetectionHandler);
    this.documentRef.body.addEventListener('keyup', this.escapeDetectionHandler);
  }

  private unregisterPopupCloseEventHandler() {
    this.documentRef.body.removeEventListener('click', this.clickOutsideDetectionHandler);
    this.tooltipEl.removeEventListener('focusout', this.focusOutsideDetectionHandler);
    this.documentRef.body.removeEventListener('keyup', this.escapeDetectionHandler);
  }

}
