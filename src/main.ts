import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableAkitaProdMode } from '@datorama/akita';
import { enableProd } from 'st-store';

if (environment.production) {
  enableProdMode();
  enableProd();
  enableAkitaProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // tslint:disable-next-line:no-console
  .catch(err => console.error(err));
