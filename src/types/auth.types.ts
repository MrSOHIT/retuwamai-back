export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email?: string;
    role: 'ADMIN' | 'WORKER';
    fullName?: string;
  };
  token: string;
  expiresIn: string;
}

export interface CreateUserRequest {
  username: string;
  email?: string;
  password: string;
  role: 'ADMIN' | 'WORKER';
  fullName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}