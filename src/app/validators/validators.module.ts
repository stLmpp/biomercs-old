import { NgModule } from '@angular/core';
import { UniqueEmailDirective } from './unique-email.directive';
import { UniqueUsernameDirective } from './unique-username.directive';

const DECLARATIONS = [UniqueEmailDirective, UniqueUsernameDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class ValidatorsModule {}
