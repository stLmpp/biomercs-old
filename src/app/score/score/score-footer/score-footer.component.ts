import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Score } from '../../../model/score';
import { ReferenceTypeEnum } from '../../../model/reference-type.enum';
import { ReasonQuery } from '../../../state/reason/reason.query';
import { ScoreStatusEnum } from '../../../model/score-status';

@Component({
  selector: 'app-score-footer',
  templateUrl: './score-footer.component.html',
  styleUrls: ['./score-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreFooterComponent implements OnInit {
  constructor(public reasonQuery: ReasonQuery) {}

  referenceTypeEnum = ReferenceTypeEnum;

  @Input() score: Score;

  scoreStatusEnum = ScoreStatusEnum;

  ngOnInit(): void {}
}
