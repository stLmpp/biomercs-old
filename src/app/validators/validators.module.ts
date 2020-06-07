import { NgModule } from '@angular/core';
import { UniqueEmailDirective } from './unique-email.directive';
import { UniqueUsernameDirective } from './unique-username.directive';
import { UrlDirective } from './url.directive';

const DECLARATIONS = [UniqueEmailDirective, UniqueUsernameDirective, UrlDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class ValidatorsModule {}
