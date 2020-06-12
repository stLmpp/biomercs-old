import { Directive, HostBinding, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { convertToBoolProperty } from '../../util/util';

@Directive({
  selector: '[imgBackground]',
})
export class ImgBackgroundDirective {
  constructor(private domSanitizer: DomSanitizer) {}

  @Input() imgBackground: number;
  @Input() options: string;
  @Input()
  set bypassSecurity(value: '' | boolean) {
    this._bypassSecurity = convertToBoolProperty(value);
  }
  private _bypassSecurity: boolean;

  @HostBinding('style.background')
  get background(): string | SafeStyle {
    const url = `url(${environment.api + environment.uploadId}/${this.imgBackground}) ${
      this.options ? this.options : ''
    }`;
    return this._bypassSecurity ? this.domSanitizer.bypassSecurityTrustStyle(url) : url;
  }
}
