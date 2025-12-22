import type { BaseResponseSchema, ISODateTimeString } from './base';
import type { AthleteRef } from './refs';

export interface Attendance extends BaseResponseSchema {
    date: ISODateTimeString;
    time: string;
    is_present: boolean;
    justification?: string | null;
    user_dni: string;
    athlete_id: number;

    athlete?: AthleteRef | null;
}
