import { Pipe, PipeTransform } from '@angular/core';
import { ScoreTable } from '../../../model/score';

export function bestScore(table: ScoreTable[][], colIndex: number): ScoreTable {
  return table
    .map(tab => tab[colIndex])
    .reduce(
      (acc, score) =>
        (score?.score?.score ?? 0) > (acc?.score?.score ?? 0) ? score : acc,
      null
    );
}

@Pipe({ name: 'bestScore' })
export class BestScorePipe implements PipeTransform {
  transform(table: ScoreTable[][], colIndex: number): ScoreTable {
    return bestScore(table, colIndex);
  }
}
