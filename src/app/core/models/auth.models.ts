// export class User {
//     id: number;
//     username?: string;
//     password?: string;
//     firstName?: string;
//     lastName?: string;
//     token?: string;
//     email?: string;
// }

export interface User {
  id: number;
  username?: string;
  email: string;
  token: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  username: string;
  role: string;
  id: number;
}