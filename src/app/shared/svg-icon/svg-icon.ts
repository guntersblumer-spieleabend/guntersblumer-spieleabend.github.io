import { Component, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.html',
  styleUrl: './svg-icon.scss',
})
export class SvgIcon {

  type  = input.required<string>();

}
