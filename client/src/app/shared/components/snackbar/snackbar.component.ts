import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { EventTypes, SnackbarEvent } from '../../../models/toast-event.model';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  animations: [
    trigger('sbTrigger', [
      // This refers to the @trigger we created in the template
      state(
        'open-bottom',
        style({ visibility: 'visible', transform: 'translateY(0%)' })
      ), // This is how the 'open' state is styled
      state(
        'close-bottom',
        style({ visibility: 'hidden', transform: 'translateY(200%)' })
      ), // This is how the 'close' state is styled
      transition('open-bottom <=> close-bottom', [
        // This is how they're expected to transition from one to the other
        animate('300ms ease-in-out'),
      ]),
      state(
        'open-top',
        style({ visibility: 'visible', transform: 'translateY(12%)' })
      ),
      state(
        'close-top',
        style({ visibility: 'hidden', transform: 'translateY(-200%)' })
      ),
      transition('open-top <=> close-top', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class SnackbarComponent implements OnInit {
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' =
    'bottom-left';
  visible = false;
  type: EventTypes = EventTypes.Success;
  message: string = '';
  openAnimation: string = 'open-bottom';
  closeAnimation: string = 'close-bottom';

  constructor(private snackbarSrv: SnackbarService) {}

  ngOnInit(): void {
    this.snackbarSrv.showSnackbar$.subscribe((visible) => {
      this.visible = visible;
    });

    this.snackbarSrv.sbData$.subscribe((data: SnackbarEvent) => {
      this.type = data.type;
      this.message = data.message;
    });

    if (this.position.includes('top')) {
      this.openAnimation = 'open-top';
      this.closeAnimation = 'close-top';
    }
  }

  dismiss(): void {
    this.snackbarSrv.dismissToast();
  }
}
