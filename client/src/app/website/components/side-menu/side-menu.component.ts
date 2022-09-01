import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('active') sideMenuActive: boolean = false;

  constructor() {}

  OpenMobileMenu() {
    this.sideMenuActive = !this.sideMenuActive;
  }
}
