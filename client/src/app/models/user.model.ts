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
  name: string;
  email: string;
  role: 'customer' | 'admin';
  password: string;
  wishlist?: Wishlist;
}

export interface CreateUserDTO extends Omit<User, 'id'> {}
