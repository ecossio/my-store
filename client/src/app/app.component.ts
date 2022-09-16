import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Credentials, User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { SnackbarService } from './services/snackbar.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';
import { WishlistService } from './services/wishlist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  imgParent = 'https://www.w3schools.com/howto/img_avatar.png';
  profile: User = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'customer',
  };
  imgUploaded = '';

  constructor(
    private authSrv: AuthService,
    private tokenSrv: TokenService,
    private userSrv: UserService,
    private wishlistSrv: WishlistService,
    private fileSrv: FilesService
  ) {}

  ngOnInit(): void {
    if (this.authSrv.isAuth()) {
      this.authSrv.getProfile().subscribe((resp) => {
        const wishlist = resp.data.wishlist?.items
          ? resp.data.wishlist.items
          : [];
        this.wishlistSrv.init(wishlist);
      });
    }
  }

  onLoaded(img: string) {
    console.log('Loaded Padre', img);
  }

  createUser() {
    // this.userSrv
    //   .create({
    //     first_name: 'José',
    //     last_name: 'Lopez',
    //     email: 'jose@mail.com',
    //     password: '12345',
    //     role: 'customer',
    //   })
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
  }

  login() {
    const credentials: Credentials = {
      email: 'beatty.rossie@example.com',
      password: 'password',
    };
    this.authSrv.loginAndGet(credentials).subscribe((resp) => {
      this.profile = resp.data;
    });
  }

  loginAdmin() {
    const credentials: Credentials = {
      email: 'admin@mail.com',
      password: 'admin123',
    };
    this.authSrv.loginAndGet(credentials).subscribe((resp) => {
      this.profile = resp.data;
    });
  }

  downloadPDF() {
    this.fileSrv
      .getFile(
        'my.pdf',
        'https://young-sands-07814.herokuapp.com/api/files/dummy.pdf',
        'application/pdf'
      )
      .subscribe();
  }

  onUploadFile(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);

    if (file) {
      this.fileSrv.uploadFile(file).subscribe((response) => {
        this.imgUploaded = response.location;
      });
    }
  }
}
