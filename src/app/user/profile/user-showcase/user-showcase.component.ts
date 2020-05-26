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

  onLoading(loading: boolean): void {
    this.loading$.next(loading);
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {}
}
