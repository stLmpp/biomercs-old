import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Score, trackByScore } from '../../../model/score';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { TypeEnum } from '../../../model/type';
import { TooltipPosition } from '@angular/material/tooltip';
import { ScoreStatusEnum } from '../../../model/score-status';

interface ClickEvent {
  $event: MouseEvent;
  colDef: ColDef;
  rowDef: Score;
}

interface SelectionEvent {
  isSelected: boolean;
  colDef: ColDef;
  rowDef: Score;
}

interface ColDef {
  field: string;
  headerName: string;
  type?: 'number' | 'text' | 'date' | 'score';
  digitsInfo?: string;
  sort?: string;
  tooltip?: string;
  tooltipType?: 'string' | 'row';
  tooltipPosition?: TooltipPosition;
  template?: TemplateRef<any>;
  templateResolver?: (colDef: ColDef) => TemplateRef<any>;
  width?: number;
  cellVerticalAlign?: 'start' | 'end' | 'center';
  cellHorizontalAlign?: 'start' | 'end' | 'center';
  headerVerticalAlign?: 'start' | 'end' | 'center';
  headerHorizontalAlign?: 'start' | 'end' | 'center';
  hideWhen?: (colDef: ColDef) => boolean;
  onClick?: (clickEvent: ClickEvent) => void;
  cellClasses?: string | string[];
}

export interface ScoreApprovalTableSelectionChangeEvent {
  isSelected: boolean;
  score: Score;
}

@Component({
  selector: 'app-score-approval-table',
  templateUrl: './score-approval-table.component.html',
  styleUrls: ['./score-approval-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreApprovalTableComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  private _destroy$ = new Subject();

  scoreStatusEnum = ScoreStatusEnum;
  typeEnum = TypeEnum;

  @ViewChild(MatSort) matSortRef: MatSort;

  @Output() sortChange = new EventEmitter<Sort>();

  @Input() loading: boolean;

  @Input() selected: number[] = [];
  @Output() selectedChange = new EventEmitter<number[]>();
  @Output() selectionChange = new EventEmitter<ScoreApprovalTableSelectionChangeEvent>();

  @Output() approve = new EventEmitter<Score>();
  @Output() reject = new EventEmitter<Score>();

  @Input() idScoreStatus: number;
  @Input() userMode: boolean;

  @Input()
  set scores(scores: Score[]) {
    this.dataSource.data = scores;
  }

  @Input()
  get idType(): number {
    return this._idType;
  }
  set idType(idType: number) {
    this._idType = idType;
    if (idType === TypeEnum.duo) {
      this.columns.splice(8, 0, 'player2Username', 'player2Character', 'player2Proofs');
    } else if (this.columns.includes('player2Username')) {
      this.columns.splice(8, 3);
    }
  }
  private _idType: number;

  dataSource = new MatTableDataSource<Score>([]);
  columns: string[] = [
    'id',
    'stage',
    'score',
    'maxCombo',
    'time',
    'player1Username',
    'player1Character',
    'player1Proofs',
    'dateAchieved',
    'creationDate',
    'wr',
    'action',
  ];
  sort = {
    id: 'score.id',
    stage: 'gms.idStage',
    score: 'score.score',
    dateAchieved: 'score.dateAchieved',
    creationDate: 'score.id',
  };

  trackByScore = trackByScore;

  onSelection(isSelected: boolean, score: Score): void {
    if (isSelected) {
      this.selected = [...this.selected, score.id];
    } else {
      this.selected = this.selected.filter(id => id !== score.id);
    }
    this.selectionChange.emit({ isSelected, score });
  }

  onSortChange(sort: Sort): void {
    if (sort.direction === '') {
      sort.direction = 'asc';
    }
    sort.active = this.sort[sort.active];
    this.sortChange.emit(sort);
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
