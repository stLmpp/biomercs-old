import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthQuery } from '../../auth/state/auth.query';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(public authQuery: AuthQuery) {}

  ngOnInit(): void {}
}
