import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Character } from '../../model/character';
import { CharacterService } from './character.service';

@Injectable({ providedIn: 'root' })
export class CharacterResolver implements Resolve<Character[]> {
  constructor(private characterService: CharacterService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Character[]> | Promise<Character[]> | Character[] {
    return this.characterService.findAll();
  }
}
