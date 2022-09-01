import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from 'src/app/models/user.model';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public btnSubmitOpts = { loading: false, text: 'Sign in' };
  @ViewChild('emailLoginInput', { static: true })
  emailLoginInput!: ElementRef;
  @ViewChild('passwordLoginInput', { static: true })
  passwordLoginInput!: ElementRef;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private frmValidators: CustomValidatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authSrv: AuthService,
    private snackbarSrv: SnackbarService
  ) {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.pattern(this.frmValidators.emailPattern()),
          ]),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.get('email')?.setValue('mkirlin@example.net');
    this.form.get('password')?.setValue('password');
  }

  get frm() {
    return this.form.controls;
  }

  login() {
    if (!this.form.invalid && !this.btnSubmitOpts.loading) {
      this.btnSubmitOpts.loading = true;
      this.btnSubmitOpts.text = 'Logging in...';
      const params: Credentials = this.form.value;

      this.authSrv
        .loginAndGet(params)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (user) => {
            // console.log('data login', user);
            this.router.navigate(['/home']);
          },
          error: (eMsg) => {
            this.btnSubmitOpts.loading = false;
            this.btnSubmitOpts.text = 'Sign in';
            // this.form.get('password')?.setValue('');
            // this.passwordLoginInput.nativeElement.focus();
            this.snackbarSrv.showErrorToast(eMsg);
          },
          complete: () => {},
        });
    } else {
      this.updateFormValidations(this.form);
      if (this.form.value.email === '' || this.form?.controls['email'].errors) {
        this.emailLoginInput.nativeElement.focus();
      } else if (this.form.value.password === '') {
        this.passwordLoginInput.nativeElement.focus();
      }
    }
  }

  updateFormValidations(form: any): void {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
