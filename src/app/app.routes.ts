import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { APP_BASE_HREF } from '@angular/common';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    component: StartComponent,
    path: 'start',
    providers: [
      {
        provide: APP_BASE_HREF,
        useValue: '../'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }

];
