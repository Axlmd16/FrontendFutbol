import type { BaseResponseSchema } from './base';
import type { AthleteRef } from './refs';

export interface Representative extends BaseResponseSchema {
    external_person_id: string;
    full_name: string;
    dni: string;
    phone?: string | null;
    relationship_type: string;

    athletes?: AthleteRef[];
}
