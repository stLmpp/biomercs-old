import { NgModule } from '@angular/core';
import { UniqueEmailDirective } from './unique-email.directive';
import { UniqueUsernameDirective } from './unique-username.directive';
import { UrlDirective } from './url.directive';
import { SiblingValidatorDirective } from './sibling-validator.directive';

const DECLARATIONS = [UniqueEmailDirective, UniqueUsernameDirective, UrlDirective, SiblingValidatorDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class ValidatorsModule {}
