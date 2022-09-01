import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from '../shared/shared.module';
import { WebsiteRoutingModule } from './website-routing.module';

import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { HomeComponent } from './pages/home/home.component';
import { MyCartComponent } from './pages/my-cart/my-cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LayoutComponent } from './components/layout/layout.component';

@NgModule({
  declarations: [    
    NavbarComponent,
    ProfileMenuComponent,
    SideMenuComponent,    
    HomeComponent,
    MyCartComponent,
    ProfileComponent,
    ProductDetailComponent,
    LayoutComponent,
  ],
  imports: [CommonModule, WebsiteRoutingModule, SharedModule, SwiperModule],
})
export class WebsiteModule {}
