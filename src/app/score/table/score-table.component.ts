import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ScoreTableParamsDto, ScoreTableType } from '../../model/score';
import { Platform } from '../../model/platform';
import { ScoreTableParamsForm } from './control-panel/table-control-panel.component';

@Component({
  selector: 'app-score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreTableComponent implements OnInit {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  @Input() platforms: Platform[];
  @Input() tableType: ScoreTableType;
  @Input() idPlayer: number;
  @Input() idCharacter: number;
  @Input() characterDisabled: boolean;
  @Input() idPlatform: number;
  @Input() idGame: number;
  @Input() idMode: number;
  @Input() idType: number;
  @Input() viewMode: boolean;
  @Input() executeWhen: (params: ScoreTableParamsForm) => boolean;

  @Output() loading = new EventEmitter<boolean>();

  params: ScoreTableParamsDto;
  _loading = false;

  onLoading(loading: boolean): void {
    this._loading = loading;
    this.loading.emit(loading);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}
}
