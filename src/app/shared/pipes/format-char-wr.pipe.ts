import { Pipe, PipeTransform } from '@angular/core';
import { Score } from '../../model/score';

@Pipe({ name: 'formatCharWr' })
export class FormatCharWrPipe implements PipeTransform {
  transform(score: Score): string {
    return [
      ...new Set(
        score.characterWorldRecords
          .filter(cwr => !!score.isCharacterWorldRecord[cwr.scorePlayers[0].idCharacter])
          .map(cwr => cwr.scorePlayers[0].character.name)
      ),
    ].join(' and ');
  }
}
