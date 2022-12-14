import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          visibility: 'visible',
          transform: 'scale(1)',
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
          visibility: 'hidden',
          transform: 'scale(0.8)',
        })
      ),
      transition('open => closed', [animate('100ms ease-out')]),
      transition('closed => open', [animate('75ms ease-out')]),
    ]),
  ],
})
export class ProfileMenuComponent {
  userMenuActive: boolean = false;
  constructor() {}

  toggleUserMenu() {
    this.userMenuActive = !this.userMenuActive;
  }

  clickOutsideUserMenuButton() {
    if (this.userMenuActive) {
      this.userMenuActive = false;
    }
  }
}
