import { NgModule } from '@angular/core';
import { UtilTooltipDirective } from './util-tooltip.directive';
import { UtilDefaultTooltipComponent } from './util-default-tooltip.component';



@NgModule({
  declarations: [
    UtilTooltipDirective,
    UtilDefaultTooltipComponent
  ],
  exports: [
    UtilTooltipDirective
  ]
})
export class UtilTooltipModule { }
