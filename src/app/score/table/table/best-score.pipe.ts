import { Pipe, PipeTransform } from '@angular/core';
import { Score, ScoreTable } from '../../../model/score';

export function bestScore(table: ScoreTable[][], colIndex: number): Score {
  return table
    .map(tab => tab.find((_, index) => index === colIndex))
    .map(o => o.score)
    .reduce(
      (acc, score) => ((score?.score ?? 0) > (acc?.score ?? 0) ? score : acc),
      null
    );
}

@Pipe({ name: 'bestScore' })
export class BestScorePipe implements PipeTransform {
  transform(table: ScoreTable[][], colIndex: number): Score {
    return bestScore(table, colIndex);
  }
}
