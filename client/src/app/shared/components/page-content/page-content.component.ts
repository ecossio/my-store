import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-content',
  styleUrls: ['./page-content.component.scss'],
  template: `
    <div class="page-container">
      <h1 class="page-title">{{ pageTitle }}</h1>
      <ng-content></ng-content>
    </div>
  `,
})
export class PageContentComponent {
  @Input() pageTitle: string = 'My Title';
  constructor() {}
}
