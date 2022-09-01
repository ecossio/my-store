import { Component, OnInit } from '@angular/core';
import { Credentials, User } from './models/user.model';
import { AuthService } from './services/auth.service';
import { FilesService } from './services/files.service';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  imgParent = 'https://www.w3schools.com/howto/img_avatar.png';
  profile: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role: 'customer',
  };
  imgUploaded = '';

  constructor(
    private authSrv: AuthService,
    private tokenSrv: TokenService,
    private userSrv: UserService,
    private fileSrv: FilesService
  ) {}

  ngOnInit(): void {
    const token = this.tokenSrv.getToken();
    if (token) {
      this.authSrv.getProfile().subscribe();
    }
  }

  onLoaded(img: string) {
    console.log('Loaded Padre', img);
  }

  createUser() {
    this.userSrv
      .create({
        name: 'José',
        email: 'jose@mail.com',
        password: '12345',
        role: 'customer',
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  login() {
    const credentials: Credentials = {
      email: 'maria@mail.com',
      password: '12345',
    };
    this.authSrv.loginAndGet(credentials).subscribe((user) => {
      this.profile = user;
    });
  }

  loginAdmin() {
    const credentials: Credentials = {
      email: 'admin@mail.com',
      password: 'admin123',
    };
    this.authSrv.loginAndGet(credentials).subscribe((user) => {
      this.profile = user;
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
