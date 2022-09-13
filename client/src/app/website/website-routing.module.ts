import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/account/settings/profile/profile.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

import { AuthGuard } from '../guards/auth.guard';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { SettingsLayoutComponent } from './components/settings-layout/settings-layout.component';
import { PasswordComponent } from './pages/account/settings/password/password.component';
import { EmailComponent } from './pages/account/settings/email/email.component';
import { WishlistComponent } from './pages/account/wishlist/wishlist.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./pages/category/category.module').then(
            (m) => m.CategoryModule
          ),
        data: {
          preload: true,
        },
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'account',
        component: AccountLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'settings',
            pathMatch: 'full',
          },
          {
            path: 'wishlist',
            component: WishlistComponent,
          },
          {
            path: 'settings',
            component: SettingsLayoutComponent,
            children: [
              {
                path: '',
                redirectTo: 'profile',
                pathMatch: 'full',
              },
              {
                path: 'profile',
                component: ProfileComponent,
              },
              {
                path: 'email',
                component: EmailComponent,
              },
              {
                path: 'password',
                component: PasswordComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
