import { Component, inject } from '@angular/core';
import { InfoService } from '../../info.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-start',
  imports: [CommonModule],

  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {

  infoService = inject(InfoService);

  constructor() {

  }

}
