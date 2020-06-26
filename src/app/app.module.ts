import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { MainModule } from './main/main.module';
import { MatIconRegistry } from '@angular/material/icon';
import { StUtilsModule } from '@stlmpp/utils';
import { StRouterModule } from '@stlmpp/router';
import { NgxMaskModule } from 'ngx-mask';

import { registerLocaleData } from '@angular/common';
import localeBr from '@angular/common/locales/pt';
import localeBrExtra from '@angular/common/locales/extra/pt';
import { flagIcons } from '../assets/flags/config.js';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';
import { MatNativeDateModule } from '@angular/material/core';

registerLocaleData(localeBr, localeBrExtra);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    StUtilsModule.forRoot(),
    StRouterModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule.forRoot(),
    AuthModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxCurrencyModule.forRoot({
      align: 'left',
      allowNegative: true,
      decimal: '.',
      precision: 2,
      prefix: '',
      suffix: '',
      thousands: ',',
      nullable: true,
      allowZero: true,
      inputMode: CurrencyMaskInputMode.NATURAL,
    }),
    MainModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
    matIconRegistry.addSvgIcon(
      'flag-unknown',
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/flag-unknown.svg')
    );
    for (const { name, path } of flagIcons) {
      matIconRegistry.addSvgIcon(name, domSanitizer.bypassSecurityTrustResourceUrl(path));
    }
  }
}
