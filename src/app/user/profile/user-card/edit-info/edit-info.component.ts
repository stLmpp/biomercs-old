import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { User } from '../../../../model/user';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UserEditInfo {
  user: User;
}

@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditInfoComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: UserEditInfo) {}

  // TODO EDIT INFO (PASSWORD, EMAIL, ETC)

  ngOnInit(): void {}
}
