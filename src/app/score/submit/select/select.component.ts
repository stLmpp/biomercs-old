import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonColumns } from '../../../model/common-history';
import { trackByFactory } from '@stlmpp/utils';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, delay, take } from 'rxjs/operators';
import { ScrollBoosterDirective } from '../../../shared/scroll/scroll-booster/scroll-booster.directive';
import { isEmpty } from '../../../util/util';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @ViewChild('itemsRef') itemsRef: ElementRef<HTMLDivElement>;
  @ViewChild('scrollBooster') scrollBoosterRef: ScrollBoosterDirective;

  @Input() values: CommonColumns[] = [];
  @Input() disabled: boolean;
  @Input() imageKey: string;
  @Input() label: string;
  @Input() labelKey: string;
  @Input() position: 'top' | 'bottom' = 'top';

  @Input() searchBy: string | string[];
  @Input() clearOnSelection = true;

  value: number;

  private _search$ = new BehaviorSubject<string>('');
  searchNoDelay$ = this._search$.asObservable();
  search$ = this.searchNoDelay$.pipe(debounceTime(400));

  trackBy = trackByFactory<CommonColumns>('id');

  onSelect(item: CommonColumns): void {
    this.value = item.id;
    if (this._search$.value) {
      this._search$.next('');
      this.search$.pipe(take(1), delay(100)).subscribe(value => {
        if (isEmpty(value)) {
          this.scrollBoosterRef.scrollToItem(item.id);
        }
      });
    }
    this.onChange(item.id);
    this.onTouched();
  }

  onSearch($event: KeyboardEvent): void {
    if ($event.key.length === 1 && /^([a-zA-Z]| )$/.test($event.key)) {
      $event.preventDefault();
      this._search$.next(this._search$.value + $event.key);
      this.itemsRef.nativeElement.focus();
    } else if ($event.key === 'Backspace') {
      $event.preventDefault();
      this._search$.next(this._search$.value.substring(0, this._search$.value.length - 1));
      this.itemsRef.nativeElement.focus();
    }
  }

  onChange: (id: number) => void = (id: number) => {};
  onTouched: () => void = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: number): void {
    this.value = value;
  }

  ngOnInit(): void {}
}
