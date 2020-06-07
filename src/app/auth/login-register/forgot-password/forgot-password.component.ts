import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@ng-stack/forms';
import { AuthService } from '../../state/auth.service';
import { finalize } from 'rxjs/operators';

interface ForgotPasswordForm {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  constructor(private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) {}

  responseMessage: string;
  sending = false;

  form = new FormGroup<ForgotPasswordForm>({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  submit(): void {
    if (this.form.invalid) return;
    this.sending = true;
    const dto = this.form.value;
    this.form.disable();
    this.authService
      .forgotPassword(dto)
      .pipe(
        finalize(() => {
          this.sending = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(msg => {
        this.responseMessage = msg;
      });
  }

  ngOnInit(): void {}
}
