import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginRegisterComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
