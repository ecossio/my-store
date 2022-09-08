import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorsService {
  constructor() {}

  /*
  passwordMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['NoPassswordMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ NoPassswordMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }*/

  matchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      const sourceValue = sourceCtrl ? sourceCtrl.value : null;
      const targetValue = targetCtrl ? targetCtrl.value : null;
      const result = sourceValue !== targetValue ? { mismatch: true } : null;

      return result;
    };
  }

  emailMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['NoEmailMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ NoEmailMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  emailPattern(): string {
    return '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}';
  }

  dateRangeValidator(startDateControlName: string, endDateControlName: string) {
    return (formGroup: FormGroup) => {
      const startDateControl = formGroup.controls[startDateControlName];
      const endDateControl = formGroup.controls[endDateControlName];

      if (new Date(endDateControl.value) < new Date(startDateControl.value)) {
        endDateControl.setErrors({ WrongEndDate: true });
      } else {
        endDateControl.setErrors(null);
      }
    };
  }

  dateTimeRangeValidator(
    startDateTimeControlName: string,
    endDateTimeControlName: string
  ) {
    return (formGroup: FormGroup) => {
      const startDateTimeControl = formGroup.controls[startDateTimeControlName];
      const endDateTimeControl = formGroup.controls[endDateTimeControlName];

      if (
        this.isEndDateTimeGt(
          endDateTimeControl.value,
          startDateTimeControl.value
        )
      ) {
        endDateTimeControl.setErrors({ WrongEndDate: true });
      } else {
        endDateTimeControl.setErrors(null);
      }
    };
  }

  isEndDateTimeGt(startDateTime: string, endDateTime: string): boolean {
    let wrongEndDate = false;
    if (new Date(startDateTime) > new Date(endDateTime)) {
      wrongEndDate = true;
    }
    return wrongEndDate;
  }
}
