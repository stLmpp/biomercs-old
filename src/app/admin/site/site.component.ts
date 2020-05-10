import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SiteService } from '../../state/site/site.service';
import { SiteQuery } from '../../state/site/site.query';
import { FieldsConfig } from '../base/base.component';
import { Site } from '../../model/site';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteComponent implements OnInit {
  constructor(public siteService: SiteService, public siteQuery: SiteQuery) {}

  fieldsConfig: FieldsConfig<Site> = {
    name: {
      validators: [Validators.required],
    },
    url: {
      validators: [
        Validators.required,
        Validators.pattern(
          '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
        ),
      ],
      validatorsMessages: {
        pattern: '{field} needs to be a valid url',
      },
      placeholder: 'URL',
    },
  };

  ngOnInit(): void {}
}
