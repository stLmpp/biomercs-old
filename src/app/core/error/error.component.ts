import { Component, OnInit, ChangeDetectionStrategy, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpError } from '../../model/http-error';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent implements OnInit {
  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public err: HttpError,
    private matDialogRef: MatDialogRef<ErrorComponent>
  ) {}

  ngOnInit(): void {}
}
