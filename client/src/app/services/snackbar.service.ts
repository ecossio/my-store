import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventTypes, SnackbarEvent } from '../models/toast-event.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public showSnackbar$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public sbData$: BehaviorSubject<SnackbarEvent> =
    new BehaviorSubject<SnackbarEvent>({
      type: EventTypes.Success,
      message: '',
    });
  constructor() {}

  private show(type: EventTypes, message: string) {
    if (!this.showSnackbar$.value) {
      this.showSnackbar$.next(true);

      const data: SnackbarEvent = {
        type,
        message,
      };
      this.sbData$.next(data);

      setTimeout(() => {
        this.dismissToast();
      }, 5000);
    }
  }

  /**
   * Show success toast notification.
   * @param message Toast message
   */
  showSuccessToast(message: string) {
    this.show(EventTypes.Success, message);
  }

  /**
   * Show info toast notification.
   * @param message Toast message
   */
  showInfoToast(message: string) {
    this.show(EventTypes.Info, message);
  }

  /**
   * Show warning toast notification.
   * @param message Toast message
   */
  showWarningToast(message: string) {
    this.show(EventTypes.Warning, message);
  }

  /**
   * Show error toast notification.
   * @param message Toast message
   */
  showErrorToast(message: string) {
    this.show(EventTypes.Error, message);
  }

  dismissToast(): void {
    this.showSnackbar$.next(false);
  }
}
