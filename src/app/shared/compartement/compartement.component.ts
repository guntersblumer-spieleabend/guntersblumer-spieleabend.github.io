import { Component, input } from '@angular/core';

@Component({
  selector: 'app-compartement',
  imports: [],
  templateUrl: './compartement.component.html',
  styleUrl: './compartement.component.scss',
})
export class CompartementComponent {

  title = input('title');


}
