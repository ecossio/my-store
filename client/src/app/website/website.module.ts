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
import { ProfileComponent } from './pages/account/settings/profile/profile.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { LayoutComponent } from './components/layout/layout.component';
import { WishlistComponent } from './pages/account/wishlist/wishlist.component';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { SettingsLayoutComponent } from './components/settings-layout/settings-layout.component';
import { EmailComponent } from './pages/account/settings/email/email.component';
import { PasswordComponent } from './pages/account/settings/password/password.component';

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
    WishlistComponent,
    AccountLayoutComponent,
    SettingsLayoutComponent,
    EmailComponent,
    PasswordComponent,
  ],
  imports: [CommonModule, WebsiteRoutingModule, SharedModule, SwiperModule],
})
export class WebsiteModule {}
