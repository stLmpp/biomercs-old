import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-content: center;
        min-height: 130px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent implements OnInit, OnDestroy {
  constructor(public changeDetectorRef: ChangeDetectorRef) {}

  private _destroy$ = new Subject();

  @Input() src: number;
  @Input() alt: string;

  loading = false;

  onLoading(loading: boolean): void {
    this.loading = loading;
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
