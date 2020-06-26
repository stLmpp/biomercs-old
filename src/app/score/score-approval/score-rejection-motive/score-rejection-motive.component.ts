import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import {
  rejectionMotives,
  ScoreApprovalAddDto,
  ScoreApprovalRejectionMotiveEnum,
} from '../../../model/score-approval';
import { MatDialogRef } from '@angular/material/dialog';
import { trackByFactory } from '@stlmpp/utils';
import { LabelValue } from '../../../model/label-value';

export type RejectionMotive = Pick<ScoreApprovalAddDto, 'rejectionMotive' | 'description'>;

@Component({
  selector: 'app-score-rejection-motive',
  templateUrl: './score-rejection-motive.component.html',
  styleUrls: ['./score-rejection-motive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreRejectionMotiveComponent implements OnInit {
  constructor(private matDialogRef: MatDialogRef<ScoreRejectionMotiveComponent, RejectionMotive>) {}

  form = new FormGroup<RejectionMotive>({
    description: new FormControl(null, [Validators.required]),
    rejectionMotive: new FormControl(null, [Validators.required]),
  });

  rejectionMotives = rejectionMotives();

  trackBy = trackByFactory<LabelValue<ScoreApprovalRejectionMotiveEnum>>('value');

  onConfirm(): void {
    this.matDialogRef.close(this.form.value);
  }

  ngOnInit(): void {}
}
