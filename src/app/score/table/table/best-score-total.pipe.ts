import { Pipe, PipeTransform } from '@angular/core';
import { ScoreTable } from '../../../model/score';
import { bestScore } from './best-score.pipe';

@Pipe({
  name: 'bestScoreTotal',
})
export class BestScoreTotalPipe implements PipeTransform {
  transform(table: ScoreTable[][], columns: number): number {
    return Array.from({ length: columns }).reduce<number>((acc, __, index) => {
      return acc + (bestScore(table, index)?.score?.score ?? 0);
    }, 0);
  }
}
