import { Directive, HostBinding, Input } from '@angular/core';

@Directive({ selector: 'mat-icon[size], [mat-icon-button][size]' })
export class MatIconSizeDirective {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  @HostBinding('class.xs') get xs(): boolean {
    return this.size === 'xs';
  }
  @HostBinding('class.sm') get sm(): boolean {
    return this.size === 'sm';
  }
  @HostBinding('class.md') get md(): boolean {
    return this.size === 'md';
  }
  @HostBinding('class.lg') get lg(): boolean {
    return this.size === 'lg';
  }
  @HostBinding('class.xl') get xl(): boolean {
    return this.size === 'xl';
  }
}
