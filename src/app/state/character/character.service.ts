import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CharacterStore } from './character.store';
import { CharacterQuery } from './character.query';
import {
  Character,
  CharacterAddDto,
  CharacterExistsDto,
  CharacterParamsDto,
  CharacterUpdateDto,
} from '../../model/character';
import { SuperService } from '../../shared/super/super-service';

@Injectable({ providedIn: 'root' })
export class CharacterService extends SuperService<
  Character,
  CharacterAddDto,
  CharacterUpdateDto,
  CharacterExistsDto,
  CharacterParamsDto
> {
  constructor(
    private characterStore: CharacterStore,
    private http: HttpClient,
    private characterQuery: CharacterQuery
  ) {
    super(http, characterStore, characterQuery, {
      endPoint: 'character',
      file: {
        key: 'image',
        idKey: 'idImage',
      },
    });
  }
}
