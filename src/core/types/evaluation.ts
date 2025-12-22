import type { BaseResponseSchema, ISODateTimeString } from './base';
import type { Test } from './test';
import type { UserRef } from './refs';

export interface Evaluation extends BaseResponseSchema {
    date: ISODateTimeString;
    time: string;
    location?: string | null;
    name: string;
    observations?: string | null;
    user_id: number;

    user?: UserRef | null;
    tests?: Test[];
}
