import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { UpdateUserPasswordDTO, User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  public form: FormGroup;
  public isUpdating: boolean = false;
  private user: User | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private myValidators: CustomValidatorsService,
    private userSrv: UserService,
    private authSrv: AuthService,
    private snackbarSrv: SnackbarService
  ) {
    this.form = this.createPasswordForm();
  }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  private createPasswordForm() {
    return this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
        current_password: ['', Validators.required],
      },
      {
        validators: this.myValidators.passwordMatchValidator(
          'password',
          'password_confirmation'
        ),
      }
    );
  }

  get frm() {
    return this.form.controls;
  }

  get passwordMatchError() {
    return (
      this.form.getError('mismatch') &&
      this.form.get('password_confirmation')?.touched
    );
  }

  updatePassword() {
    if (!this.form.invalid) {
      this.isUpdating = true;
      const params: UpdateUserPasswordDTO = this.form.value;
      const user_id = this.user?.id ? this.user?.id : 0;

      this.userSrv.updatePassword(user_id, params).subscribe({
        next: () => {
          this.snackbarSrv.showSuccessToast('Password updated.');
        },
        error: (e) => {
          this.isUpdating = false;
          if (e.status == 500) {
            this.snackbarSrv.showErrorToast(e.error.message);
          } else if (e.status == 401) {
            this.snackbarSrv.showErrorToast(e.error.message);
          }
        },
        complete: () => {
          this.isUpdating = false;
          this.form = this.createPasswordForm();
        },
      });
    }
  }
}
