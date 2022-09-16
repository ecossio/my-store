import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  public form: FormGroup;
  public isLoading: Boolean = false;
  public btnText = 'Reset password';
  public formErrors = this.createServerErrorsObject();

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private frmValidators: CustomValidatorsService,
    private snackbarSrv: SnackbarService
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.frmValidators.emailPattern()),
        ]),
      ],
      redirect_url: [
        `${environment.APP_URL}/auth/recovery`,
        Validators.required,
      ],
    });
  }

  get frm() {
    return this.form.controls;
  }

  createServerErrorsObject() {
    return {
      email: [],
      password: [],
      password_confirmation: [],
      token: [],
      redirect_url: [],
    };
  }

  updateFormValidations(form: any): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });

    this.formErrors = this.createServerErrorsObject();
  }

  submit() {
    this.updateFormValidations(this.form);
    if (this.form.valid) {
      this.isLoading = true;
      const params = this.form.value;
      this.authSrv.forgotPassword(params).subscribe({
        next: (resp) => {
          this.snackbarSrv.showSuccessToast(
            `Instructions have been sent to ${params.email}`
          );
          this.form = this.createForm();
        },
        error: (e) => {
          this.isLoading = false;
          if (e.status === 422) {
            this.formErrors = e.error.message;
          }
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}
