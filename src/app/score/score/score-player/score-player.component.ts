import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ScorePlayer } from '../../../model/score-player';

@Component({
  selector: 'app-score-player',
  templateUrl: './score-player.component.html',
  styleUrls: ['./score-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScorePlayerComponent implements OnInit {
  constructor() {}

  @Input() player: ScorePlayer;
  @Input() playerNumber: number;

  ngOnInit(): void {}
}
