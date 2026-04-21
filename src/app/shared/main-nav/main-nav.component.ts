import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIcon } from '../svg-icon/svg-icon';

@Component({
  selector: 'nav.main-nav',
  imports: [
    RouterLink,
    RouterLinkActive,
    // AsyncPipe,
    NgTemplateOutlet,
    SvgIcon
  ],
  templateUrl: './main-nav.component.html',
  styleUrl: './main-nav.component.scss',
})
export class MainNavComponent {}
