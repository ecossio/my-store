import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import {
  User,
  CreateUserDTO,
  UpdateUserProfileDTO,
  UpdateUserPasswordDTO,
  UpdateUserEmailDTO,
} from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.API_URL}/api/users`;

  constructor(private http: HttpClient, private authSrv: AuthService) {}

  create(dto: CreateUserDTO) {
    return this.http.post<User>(this.apiUrl, dto);
  }

  getAll() {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateProfile(user_id: number, dto: UpdateUserProfileDTO) {
    return this.http
      .put<ApiResponse<User>>(`${this.apiUrl}/${user_id}/update_profile`, dto)
      .pipe(tap((resp) => {
        this.authSrv.updateUserProfileLS(resp.data);
      }));
  }

  updateEmail(user_id: number, dto: UpdateUserEmailDTO) {
    return this.http.put<ApiResponse<User>>(
      `${this.apiUrl}/${user_id}/update_email`,
      dto
    ).pipe(tap((resp) => {
      this.authSrv.updateUserProfileLS(resp.data);
    }))
  }

  updatePassword(user_id: number, dto: UpdateUserPasswordDTO) {
    return this.http.put<ApiResponse<User>>(
      `${this.apiUrl}/${user_id}/update_password`,
      dto
    );
  }
}
