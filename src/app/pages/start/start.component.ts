import { Component, inject } from '@angular/core';
import { InfoService } from '../../shared/info.service';
import { CommonModule } from '@angular/common';
import { CompartementComponent } from '../../shared/compartement/compartement.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-start',
  imports: [CommonModule, CompartementComponent],

  templateUrl: './start.component.html',
  styleUrl: './start.component.scss',
})
export class StartComponent {

  infoService = inject(InfoService);

}
