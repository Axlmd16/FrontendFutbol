import type { BaseResponseSchema } from './base';
import type { Account } from './account';
import type { Role } from './enums';
import type { Evaluation } from './evaluation';

export interface User extends BaseResponseSchema {
  full_name: string;
  dni: string;

  account?: Account | null;
  evaluations?: Evaluation[];
  role?: Role | null;
}

export interface AdminCreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  password: string;
  role: Role;

  direction?: string;
  phone?: string;
  type_identification?: string;
  type_stament?: string;
}

export interface AdminCreateUserResponse {
  user_id: number;
  account_id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface CreatePersonInMSRequest {
  first_name: string;
  last_name: string;
  dni: string;
  direction?: string;
  phone?: string;
  type_identification?: string;
  type_stament?: string;
}

export interface CreateLocalUserAccountRequest {
  full_name: string;
  dni: string;
  email: string;
  password: string;
  role: Role;
}
