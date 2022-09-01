import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { GridComponent } from './pages/grid/grid.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { LayoutComponent } from './components/layout/layout.component';
import { QuicklinkModule } from 'ngx-quicklink';



@NgModule({
  declarations: [
    TasksComponent,
    LayoutComponent,
    GridComponent
  ],
  imports: [
    CommonModule,
    CmsRoutingModule,
    QuicklinkModule
  ]
})
export class CmsModule { }
