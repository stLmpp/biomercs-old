import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UserLink } from '../../../../model/user-link';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { User } from '../../../../model/user';
import { SiteService } from '../../../../state/site/site.service';
import { SiteQuery } from '../../../../state/site/site.query';
import { finalize } from 'rxjs/operators';
import { trackBySite } from '../../../../model/site';
import { UserLinkService } from '../../../../state/user-link/user-link.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserLinkData {
  user: User;
  userLink?: UserLink;
}

interface UserLinkForm {
  name: string;
  url: string;
  idSite: number;
}

@Component({
  selector: 'app-user-link',
  templateUrl: './user-link.component.html',
  styleUrls: ['./user-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserLinkComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UserLinkData,
    private matDialogRef: MatDialogRef<UserLinkComponent>,
    private siteService: SiteService,
    private siteQuery: SiteQuery,
    private userLinkService: UserLinkService,
    private changeDetectorRef: ChangeDetectorRef,
    private matSnackBar: MatSnackBar
  ) {}

  form: FormGroup<UserLinkForm>;

  saving = false;

  sites$ = this.siteQuery.all$;

  trackBySite = trackBySite;

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.saving = true;
    const userLink = this.form.value;
    this.form.disable();
    const http = this.data.userLink?.id
      ? this.userLinkService.update(this.data.userLink.id, userLink)
      : this.userLinkService.add({
          ...userLink,
          idUser: this.data.user.id,
        });
    http
      .pipe(
        finalize(() => {
          this.saving = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.matDialogRef.close();
        this.matSnackBar.open('Link saved', 'Close');
      });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.userLink?.name, [Validators.required]),
      url: new FormControl(this.data.userLink?.url, [Validators.required]),
      idSite: new FormControl(this.data.userLink?.idSite, [Validators.required]),
    });
    this.form.get('idSite').disable();
    this.siteService
      .findAll()
      .pipe(finalize(() => this.form.get('idSite').enable()))
      .subscribe();
  }
}
