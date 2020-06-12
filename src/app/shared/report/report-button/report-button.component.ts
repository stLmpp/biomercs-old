import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ReportService } from '../report.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReferenceTypeEnum } from '../../../model/reference-type.enum';
import { Control, FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { Reason, trackByReason } from '../../../model/reason';
import { finalize, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ReportForm {
  description: string;
  reasons: Control<Reason[]>;
}

@Component({
  selector: 'app-report-button',
  templateUrl: './report-button.component.html',
  styleUrls: ['./report-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportButtonComponent implements OnInit {
  constructor(
    private reportService: ReportService,
    private matDialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar
  ) {}

  @ViewChild('reportModalRef', { read: TemplateRef }) modalTemplateRef: TemplateRef<any>;

  @Input() type: ReferenceTypeEnum;
  @Input() idReference: number;
  @Input() reasons: Reason[];
  @Input() disabled: boolean;

  modalRef: MatDialogRef<any>;

  form = new FormGroup<ReportForm>({
    description: new FormControl(),
    reasons: new FormControl([], [Validators.required]),
  });

  trackByReason = trackByReason;

  onSubmit(): void {
    if (this.form.invalid) return;
    const formValue = this.form.value;
    this.form.disable();
    this.modalRef.disableClose = true;
    this.reportService
      .add({
        ...formValue,
        idReference: this.idReference,
        type: this.type,
      })
      .pipe(
        finalize(() => {
          this.modalRef.close();
          this.form.enable();
        })
      )
      .subscribe(() => {
        this.matSnackBar.open('Report submitted', 'Close');
      });
  }

  openReport(): void {
    this.modalRef = this.matDialog.open(this.modalTemplateRef);
    this.modalRef
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.form.reset();
      });
  }

  ngOnInit(): void {}
}
