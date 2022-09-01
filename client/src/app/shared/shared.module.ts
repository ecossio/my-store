import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'swiper/angular';

import { ImgComponent } from './components/img/img.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { QuicklinkModule } from 'ngx-quicklink';

@NgModule({
  declarations: [
    ImgComponent,
    ProductComponent,
    ProductsComponent,
    ReversePipe,
    TimeAgoPipe,
    ClickOutsideDirective,
  ],
  imports: [CommonModule, RouterModule, SwiperModule, QuicklinkModule],
  exports: [
    ImgComponent,
    ProductComponent,
    ProductsComponent,
    ReversePipe,
    TimeAgoPipe,
    ClickOutsideDirective,
    QuicklinkModule
  ],
})
export class SharedModule {}
