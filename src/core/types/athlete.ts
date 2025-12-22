import type { BaseResponseSchema, ISODateString } from './base';
import type { Sex } from './enums';
import type { Attendance } from './attendance';
import type { Representative } from './representative';
import type { Statistic } from './statistic';
import type { Test } from './test';

export interface Athlete extends BaseResponseSchema {
    external_person_id: string;
    full_name: string;
    dni: string;

    type_athlete: string;
    date_of_birth?: ISODateString | null;
    height?: number | null;
    weight?: number | null;
    sex: Sex;

    representative_id?: number | null;

    representative?: Representative | null;
    tests?: Test[];
    attendances?: Attendance[];
    statistic?: Statistic | null;

    age?: number | null;
    is_adult?: boolean | null;
    representative_name?: string | null;
    representative_dni?: string | null;
}
