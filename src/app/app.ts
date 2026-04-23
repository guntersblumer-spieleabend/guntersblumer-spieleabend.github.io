import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavComponent } from './shared/main-nav/main-nav.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, /*MainNavComponent*/],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
