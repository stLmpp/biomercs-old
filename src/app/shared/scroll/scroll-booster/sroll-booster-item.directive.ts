import {
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({ selector: '[scrollBoosterItem]', exportAs: 'scrollBoosterItem' })
export class SrollBoosterItemDirective implements OnInit, OnDestroy {
  constructor(
    public elementRef: ElementRef<HTMLElement>,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  @HostBinding('attr.draggable') draggable = false;

  @Input() disabledDraggableForChildren = true;
  @Input() focusWhenAlone = true;

  @Input() id: number | string;

  get hasFocus(): boolean {
    return this.document.activeElement === this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    if (this.disabledDraggableForChildren) {
      this.elementRef.nativeElement.querySelectorAll('img, a[href]').forEach(element => {
        this.renderer2.setAttribute(element, 'draggable', 'false');
      });
    }
  }

  ngOnDestroy(): void {}
}
