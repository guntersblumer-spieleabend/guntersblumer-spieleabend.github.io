import { Routes } from '@angular/router';
import { StartComponent } from './pages/start/start.component';
import { APP_BASE_HREF } from '@angular/common';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    component: StartComponent,
    path: 'start',
    data: {
      pageName: 'Startseite'
    }
  },
  {
    component: ContactComponent,
    path: 'contact',
    data: {
      pageName: 'Kontakt'
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }

];
