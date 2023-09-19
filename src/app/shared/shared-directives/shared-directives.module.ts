import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDebounceDirective } from '../directives/on-debounce.directive';
import { NumericDirective } from '../directives/decimal-numbers.directive';
import { HasClaimDirective } from '../directives/has-claim.directive';
import { DebounceClickDirective } from 'src/app/debounce-click.directive';
import { IsOutsideDirective } from '../is-outside.directive';
import { IsDevelopmentDirective } from '../directives/is-development.directive';

@NgModule({
  declarations: [OnDebounceDirective, NumericDirective, HasClaimDirective, IsDevelopmentDirective, DebounceClickDirective, IsOutsideDirective],
  imports: [
    CommonModule,
  ],
  exports: [
    OnDebounceDirective,
    NumericDirective,
    HasClaimDirective, IsDevelopmentDirective,
    DebounceClickDirective,
    IsOutsideDirective
  ]
})
export class SharedDirectivesModule { }
