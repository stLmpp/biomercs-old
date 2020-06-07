import { Component, OnInit, ChangeDetectionStrategy, Input, ElementRef, Renderer2 } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bio-badge',
  },
})
export class BadgeComponent implements OnInit {
  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {}

  @Input()
  set color(color: ThemePalette) {
    this.setColor(color);
    this._color = color;
  }
  _color: ThemePalette = 'primary';

  setColor(color: ThemePalette): void {
    if (this._color) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this._color);
    }
    this.renderer2.addClass(this.elementRef.nativeElement, color);
  }

  ngOnInit(): void {
    this.setColor(this._color);
  }
}
