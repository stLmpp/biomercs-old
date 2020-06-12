import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  forwardRef,
  ViewChild,
  ElementRef,
  HostListener,
  HostBinding,
  ChangeDetectorRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { convertToBoolProperty, getFileExtesion } from '../../../util/util';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mat-file-upload',
  templateUrl: './mat-file-upload.component.html',
  styleUrls: ['./mat-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatFileUploadComponent),
      multi: true,
    },
  ],
})
export class MatFileUploadComponent implements ControlValueAccessor, OnInit {
  constructor(private matSnackBar: MatSnackBar, private changeDetectorRef: ChangeDetectorRef) {}

  @ViewChild('inputRef') inputRef: ElementRef<HTMLInputElement>;

  @Input() color: ThemePalette;
  @Input() disabled: boolean;
  @Input() accept: string;
  @Input() extensionErrorMsg: string;
  @Input()
  set extensions(extensions: string[]) {
    this._extensions = extensions;
    this.accept = extensions.map(o => `.${o}`).join(', ');
  }
  _extensions: string[];
  @Input()
  set multiple(value: '' | boolean) {
    this._multiple = convertToBoolProperty(value);
  }
  _multiple: boolean;
  @Input() loading: boolean;
  @Input() showFilename = true;

  files: FileList;

  private _dragOverClass = false;

  onChange: (file: FileList) => void = () => {};
  onTouched: () => void = () => {};

  @HostListener('click')
  onClick(): void {
    if (this.disabled) return;
    this.inputRef.nativeElement.click();
  }

  @HostBinding('class.dragover')
  get dragoverClass(): boolean {
    return this._dragOverClass;
  }

  @HostListener('drop', ['$event'])
  onDrop($event: DragEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this._dragOverClass = false;
    if (this.disabled || this.loading) {
      return;
    }
    this.emitFiles($event.dataTransfer.files);
  }

  @HostListener('dragover', ['$event'])
  onDragover($event: DragEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this._dragOverClass = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragleave($event: DragEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this._dragOverClass = false;
  }

  onSelect($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
    const files = ($event.target as HTMLInputElement).files;
    this.emitFiles(files);
  }

  private checkFileExtensions(files: FileList): string[] {
    if (!this._extensions?.length || !files?.length) return [];
    return Array.from(files)
      .filter(file => !this._extensions.includes(getFileExtesion(file.name)))
      .map(file => file.name);
  }

  private emitFiles(files: FileList): void {
    if (files?.length) {
      if (this.checkFileExtensions(files).length) {
        this.matSnackBar.open(this.extensionErrorMsg, 'Close');
        this.inputRef.nativeElement.value = null;
        files = null;
      }
      this.files = files;
      this.onChange(files);
      this.onTouched();
      this.changeDetectorRef.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(files: FileList): void {
    if (this.checkFileExtensions(files).length) {
      this.matSnackBar.open(this.extensionErrorMsg, 'Close');
      files = null;
    }
    if (!files?.length && this.inputRef) {
      this.inputRef.nativeElement.value = null;
    }
    this.files = files;
    this.changeDetectorRef.markForCheck();
  }

  ngOnInit(): void {}
}
