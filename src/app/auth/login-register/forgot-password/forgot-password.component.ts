import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../state/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  responseMessage: string;
  sending = false;

  form = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  get emailControl(): FormControl {
    return this.form.get('email') as FormControl;
  }

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
