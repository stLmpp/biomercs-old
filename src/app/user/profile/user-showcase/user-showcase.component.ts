import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ScoreTableType } from '../../../model/score';
import { BehaviorSubject } from 'rxjs';
import { PlatformQuery } from '../../../state/platform/platform.query';
import { User } from '../../../model/user';
import { ScoreTableParamsForm } from '../../../score/table/control-panel/table-control-panel.component';

@Component({
  selector: 'app-user-showcase',
  templateUrl: './user-showcase.component.html',
  styleUrls: ['./user-showcase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserShowcaseComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public platformQuery: PlatformQuery
  ) {}

  @Input() user: User;

  scoreTableType = ScoreTableType;

  loading$ = new BehaviorSubject<boolean>(false);

  executeWhen: (params: ScoreTableParamsForm) => boolean = ({
    idPlayer,
    idType,
    idPlatform,
    idMode,
    idGame,
  }) => !!(idPlayer && idType && idPlatform && idMode && idGame);

  onLoading(loading: boolean): void {
    this.loading$.next(loading);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}
}
