import { InjectionToken, Component, inject, TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export type UtilTooltipComponentData = {text: string;};

export const UTIL_TOOLTIP_COMPONENT_DATA_INJECTION_TOKEN = new InjectionToken<UtilTooltipComponentData>('UTIL_TOOLTIP_COMPONENT_DATA_INJECTION_TOKEN');

@Component({
  selector: 'util-default-tooltip-component',
  template: '<div>{{ text }}</div>',
  styles: [],
  standalone: false
})
export class UtilDefaultTooltipComponent<T extends any = any> {
  _ = inject(UTIL_TOOLTIP_COMPONENT_DATA_INJECTION_TOKEN) as UtilTooltipData<T>;
  text = this._?.text || '';
  data = this._.componentData?.data;
}

export type UtilTooltipComponentType<T extends any = any> = new (...args: any[]) => UtilDefaultTooltipComponent<T>;

export type UtilTooltipCause = 'mouseOver' | 'focus' | 'click' | 'trigger' ;

export type UtilTooltipData<T extends any = any> = {
  text: string;
  templateRef?: TemplateRef<any>;
  componentData?: {
    cmp: UtilTooltipComponentType<T>;
    data?: T;
  };
  triggerCauses?: UtilTooltipCause[];
  /**
   * opens tooltip if next = true, hides it if next = false
   * note: do not forget to add trigger to trigger causes
   */
  showAndHideTrigger$?: Observable<boolean>;
};
