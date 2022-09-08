import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateUserProfileDTO, User } from 'src/app/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public form: FormGroup;
  user: User | null = null;
  @ViewChild('firstnameInput') firstnameInput: ElementRef<HTMLInputElement> =
    {} as ElementRef;
  @ViewChild('lastnameInput') lastnameInput: ElementRef<HTMLInputElement> =
    {} as ElementRef;
  isUpdating: boolean = false;

  constructor(
    private authSrv: AuthService,
    private userSrv: UserService,
    private formBuilder: FormBuilder,
    private snackbarSrv: SnackbarService
  ) {
    this.form = this.createForm();
  }

  ngOnInit(): void {
    this.authSrv.user$.subscribe((data) => {
      this.user = data;

      this.form.get('first_name')?.setValue(this.user?.first_name);
      this.form.get('last_name')?.setValue(this.user?.last_name);
      this.form.get('email')?.setValue(this.user?.email);
    });
  }

  get frm() {
    return this.form.controls;
  }

  createForm() {
    return this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
    });
  }

  updateProfile() {
    if (!this.form.invalid) {
      this.isUpdating = true;
      const params: UpdateUserProfileDTO = this.form.value;
      const user_id = this.user?.id ? this.user?.id : 0;
      this.userSrv.updateProfile(user_id, params).subscribe({
        error: (e) => {
          if (e.status == 500) {
            this.snackbarSrv.showErrorToast('Unexpected error');
          }
        },
        complete: () => {
          this.isUpdating = false;
        },
      });
    } else {
      if (this.form.value.first_name === '') {
        this.firstnameInput.nativeElement.focus();
      } else if (this.form.value.last_name === '') {
        this.lastnameInput.nativeElement.focus();
      }
    }
  }
}
