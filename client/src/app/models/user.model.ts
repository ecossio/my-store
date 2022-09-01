export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  password?: string;
}

export interface CreateUserDTO extends Omit<User, 'id'> {}
