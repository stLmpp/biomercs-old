import { CommonColumns } from './common-history';
import { User } from './user';
import { Character } from './character';
import { ScorePlayerProof, ScorePlayerProofAddDto } from './score-player-proof';

export interface ScorePlayer extends CommonColumns {
  idScore: number;
  idPlayer: number;
  player: User;
  idCharacter: number;
  character: Character;
  host: boolean;
  bulletKills: number;
  scorePlayerProofs?: ScorePlayerProof[];
  description?: string;
}

export interface ScorePlayerAddDto {
  idScore?: number;
  idPlayer: number;
  player?: User;
  idCharacter: number;
  host?: boolean;
  bulletKills?: number;
  description?: string;
  scorePlayerProofs?: ScorePlayerProofAddDto[];
}
