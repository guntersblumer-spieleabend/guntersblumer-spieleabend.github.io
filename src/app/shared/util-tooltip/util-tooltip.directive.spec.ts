/* eslint-disable @angular-eslint/component-max-inline-declarations */
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UtilTooltipDirective } from './util-tooltip.directive';
import { UtilTooltipModule } from './util-tooltip.module';
import { UtilDefaultTooltipComponent, UtilTooltipData } from './util-default-tooltip.component';


@Component({
  selector: 'util-mock-tooltip-component',
  template: '<div>{{ text }}</div>',
  styles: [],
  standalone: false
})
export class UtilMockTooltipComponent extends UtilDefaultTooltipComponent {
}


@Component({
  template: `
    <div [utilTooltip]=" 'Test Mock Text' ">MOCK 1</div>

    <ng-template #mockTemplate>Test Mock Template</ng-template>

    <div utilTooltip [utilTooltipTemplate]="mockTemplate">MOCK 2</div>

    <div utilTooltip [utilTooltipComponentData]="tooltipComponentData">MOCK 3</div>

  `,
  styles: [`
    :host {
      .mock {
        width: 200px;
        height: 200px;
      }
    }
    `],
  standalone: false
})
class MockForUtilTooltipDirectiveComponent implements OnInit {

  elementRef = inject(ElementRef);

  @ViewChild(UtilTooltipDirective)
  directive: UtilTooltipDirective = null!;

  ngOnInit(): void {}

  protected tooltipComponentData: UtilTooltipData['componentData'] = {
    cmp: UtilMockTooltipComponent,
    data: {text: 'Mock Text'}
  };

}

describe('UtilTooltipDirective', () => {
  let directive: UtilTooltipDirective;
  let component: MockForUtilTooltipDirectiveComponent;
  let host: HTMLElement;
  let fixture: ComponentFixture<MockForUtilTooltipDirectiveComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [ MockForUtilTooltipDirectiveComponent, UtilTooltipDirective ],
      imports: [UtilTooltipModule],
      providers: []
    });

    fixture = TestBed.createComponent(MockForUtilTooltipDirectiveComponent);

    component = fixture.componentInstance;
    host = fixture.nativeElement;

    fixture.detectChanges();
    directive = component.directive;

  });

  it('UtilTooltipDirective should be created', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
    expect(host).toBeTruthy();
  });

});
