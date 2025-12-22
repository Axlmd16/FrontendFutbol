import type { BaseResponseSchema } from './base';
import type { Role } from './enums';

export interface Account extends BaseResponseSchema {
    email: string;
    password_hash?: string;
    role: Role;
    user_id: number;
}
