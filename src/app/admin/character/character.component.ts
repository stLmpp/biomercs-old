import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CharacterService } from '../../state/character/character.service';
import { CharacterQuery } from '../../state/character/character.query';
import { FieldsConfig } from '../base/base.component';
import { Game } from '../../model/game';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterComponent implements OnInit {
  constructor(
    public characterService: CharacterService,
    public characterQuery: CharacterQuery
  ) {}

  fieldsConfig: FieldsConfig<Game> = {
    name: {
      validators: [Validators.required],
    },
    shortName: {
      validators: [Validators.required],
    },
  };

  ngOnInit(): void {}
}
