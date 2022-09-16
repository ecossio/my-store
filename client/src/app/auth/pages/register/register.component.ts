import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUserDTO } from 'src/app/models/user.model';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  public form: FormGroup;
  public isLoading = false;
  public btnText = 'Create an account';
  public formErrors = this.createServerErrorsObject();

  constructor(
    private fb: FormBuilder,
    private frmValidators: CustomValidatorsService,
    private userSrv: UserService,
    private snackbarSrv: SnackbarService,
    private router: Router
  ) {
    this.form = this.createForm();
  }

  createForm() {
    return this.fb.group(
      {
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(this.frmValidators.emailPattern()),
          ]),
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
      },
      {
        validators: this.frmValidators.matchValidator(
          'password',
          'password_confirmation'
        ),
      }
    );
  }

  createServerErrorsObject() {
    return {
      first_name: [],
      last_name: [],
      password: [],
      password_confirmation: [],
      email: [],
    };
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
      this.btnText = 'Creating account...';
      const params: CreateUserDTO = this.form.value;
      this.userSrv.create(params).subscribe({
        next: () => {
          this.btnText = 'Redirecting...';
          this.snackbarSrv.showSuccessToast(
            '<strong>Account created</strong><br>You will be redirected to login in 5 seconds'
          );
          setTimeout(() => {
            this.router.navigate(['auth/login']);
          }, 5000);
        },
        error: (e) => {
          this.isLoading = false;
          if (e.status === 422) {
            this.formErrors = e.error.message;
          }
        },
        complete: () => {
          this.isLoading = true;
        },
      });
    }
  }
}
