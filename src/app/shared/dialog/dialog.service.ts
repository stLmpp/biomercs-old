import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent, DialogOptions } from './dialog.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private matDialog: MatDialog) {}

  confirm(
    data: Partial<DialogOptions>,
    dialogOptions: MatDialogConfig = {}
  ): Observable<boolean> {
    return this.matDialog
      .open(DialogComponent, { ...dialogOptions, data })
      .afterClosed()
      .pipe(take(1));
  }
}
