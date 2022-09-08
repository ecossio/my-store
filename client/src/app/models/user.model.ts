import { Product } from './product.model';

export interface Credentials {
  email: string;
  password: string;
}

export interface Wishlist {
  total_wishes: number;
  items: Product[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'customer' | 'admin';
  password: string;
  profile_picture?: string;
  wishlist?: Wishlist;
}

export interface CreateUserDTO extends Omit<User, 'id'> {}

export interface UpdateUserProfileDTO {
  first_name?: string;
  last_name?: string;
  profile_picture?: File;
}

export interface UpdateUserEmailDTO {
  email: string;
  email_confirmation: string;
  password: string;
}

export interface UpdateUserPasswordDTO {
  password: string;
  password_confirmation: string;
  current_password: string;
}
