import { NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
  selector: 'nav.main-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    SvgIcon
  ],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
})
export class MainNavComponent {
  @ViewChild('menu') menu?: ElementRef<HTMLDialogElement>;

  close() {
    this.menu?.nativeElement?.hidePopover();
  }
}
