import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UpdateUserEmailDTO, User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  form: FormGroup;
  private user: User | null = null;
  isUpdating: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private userSrv: UserService,
    private snackbarSrv: SnackbarService,
    private myValidators: CustomValidatorsService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  createForm() {
    return this.fb.group(
      {
        email: [
          '',
          [
            Validators.compose([
              Validators.required,
              Validators.pattern(this.myValidators.emailPattern()),
            ]),
          ],
        ],
        email_confirmation: [
          '',
          [
            Validators.compose([
              Validators.required,
              Validators.pattern(this.myValidators.emailPattern()),
            ]),
          ],
        ],
        password: ['', Validators.required],
      },
      {
        validators: this.myValidators.matchValidator(
          'email',
          'email_confirmation'
        ),
      }
    );
  }

  get frm() {
    return this.form.controls;
  }

  get emailMatchError() {
    return (
      this.form.getError('mismatch') &&
      !this.form.get('email_confirmation')?.hasError('required') &&
      this.form.get('email_confirmation')?.touched
    );
  }

  updateEmail() {
    if (!this.form.invalid) {
      this.isUpdating = true;
      const params: UpdateUserEmailDTO = this.form.value;
      const user_id = this.user?.id ? this.user?.id : 0;

      this.userSrv.updateEmail(user_id, params).subscribe({
        next: () => {
          this.snackbarSrv.showSuccessToast(
            '<strong>Email updated</strong><br><p>Use your new email address at your next login.</p>'
          );
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
          this.form = this.createForm();
        },
      });
    }
  }
}
