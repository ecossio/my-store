import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit {
  public form: FormGroup;
  public isLoading: Boolean = false;
  public btnText: string = 'Reset password';
  public formErrors = this.createServerErrorsObject();

  constructor(
    private fb: FormBuilder,
    private frmValidators: CustomValidatorsService,
    private myValidators: CustomValidatorsService,
    private snackbarSrv: SnackbarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService
  ) {
    this.form = this.createForm('', '');
  }

  ngOnInit(): void {
    this.activatedRoute.parent?.url.subscribe((url: UrlSegment[]) => {
      // Obtener los parametros url
      const queryParams = { ...this.activatedRoute.snapshot.queryParams };

      if (
        queryParams.hasOwnProperty('email') &&
        queryParams.hasOwnProperty('token')
      ) {
        // Crear el formulario
        this.form = this.createForm(queryParams['email'], queryParams['token']);
      } else {
        // redireccionar al login
        this.router.navigate(['auth/login']);
      }
    });
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

  createForm(email: string, token: string) {
    return this.fb.group(
      {
        email: [
          email,
          Validators.compose([
            Validators.required,
            Validators.pattern(this.frmValidators.emailPattern()),
          ]),
        ],
        token: [token, Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password_confirmation: ['', Validators.required],
      },
      {
        validators: this.myValidators.matchValidator(
          'password',
          'password_confirmation'
        ),
      }
    );
  }

  submit() {
    this.updateFormValidations(this.form);
    if (this.form.valid) {
      this.isLoading = true;
      const params = this.form.value;
      this.authSrv.resetPassword(params).subscribe({
        next: () => {
          this.snackbarSrv.showSuccessToast(
            '<strong>Password updated</strong><br>You will be redirected to login in 5 seconds'
          );
          setTimeout(() => {
            this.router.navigate(['auth/login']);
          }, 5000);
        },
        error: (e) => {
          this.isLoading = false;
          let eMsg = 'Unexpected error, tray again later.';
          if (e.status == 403) {
            eMsg = `The password recovery link has expired, please <a href="${environment.APP_URL}/auth/forgot" class="text-gray-100 hover:text-white hover:bg-gray-900/60 rounded-md px-2 leading-tight bg-gray-900/50 font-bold pb-0.5 shadow-sm">request another</a>`;
          } else if (e.status === 422) {
            this.formErrors = e.error.message;
          }
          this.snackbarSrv.showErrorToast(eMsg);
        },
      });
    }
  }
}
