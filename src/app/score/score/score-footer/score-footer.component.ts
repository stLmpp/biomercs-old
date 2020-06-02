import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Score } from '../../../model/score';
import { ReferenceTypeEnum } from '../../../model/reference-type.enum';

@Component({
  selector: 'app-score-footer',
  templateUrl: './score-footer.component.html',
  styleUrls: ['./score-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreFooterComponent implements OnInit {
  constructor() {}

  referenceTypeEnum = ReferenceTypeEnum;

  @Input() score: Score;

  ngOnInit(): void {}
}
