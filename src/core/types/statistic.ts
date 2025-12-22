import type { BaseResponseSchema } from './base';
import type { AthleteRef } from './refs';

export interface Statistic extends BaseResponseSchema {
    speed?: number | null;
    stamina?: number | null;
    strength?: number | null;
    agility?: number | null;

    matches_played: number;
    goals: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;

    athlete_id: number;

    athlete?: AthleteRef | null;
}
