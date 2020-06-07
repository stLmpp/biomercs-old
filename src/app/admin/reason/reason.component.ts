import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReasonQuery } from '../../state/reason/reason.query';
import { ReasonService } from '../../state/reason/reason.service';

@Component({
  selector: 'app-reason',
  templateUrl: './reason.component.html',
  styleUrls: ['./reason.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonComponent implements OnInit {
  constructor(public reasonQuery: ReasonQuery, public reasonService: ReasonService) {}

  ngOnInit(): void {}
}
