import type { BaseResponseSchema, ISODateTimeString } from './base';
import type { Scale } from './enums';

export interface TestBase extends BaseResponseSchema {
    type: string;
    date: ISODateTimeString;
    observations?: string | null;
    evaluation_id: number;
    athlete_id: number;
}

export interface SprintTest extends TestBase {
    type: 'sprint_test';
    distance_meters: number;
    time_0_10_s: number;
    time_0_30_s: number;
    time_10_30_s?: number | null;
    avg_speed_ms?: number | null;
    estimated_max_speed?: number | null;
}

export interface EnduranceTest extends TestBase {
    type: 'endurance_test';
    min_duration: number;
    total_distance_m: number;
    pace_min_per_km?: number | null;
    estimated_vo2max?: number | null;
}

export interface YoyoTest extends TestBase {
    type: 'yoyo_test';
    shuttle_count: number;
    final_level: string;
    failures: number;
    total_distance?: number | null;
    vo2_max?: number | null;
}

export interface TechnicalAssessment extends TestBase {
    type: 'technical_assessment';
    ball_control?: Scale | null;
    short_pass?: Scale | null;
    long_pass?: Scale | null;
    shooting?: Scale | null;
    dribbling?: Scale | null;
}

export type Test = SprintTest | EnduranceTest | YoyoTest | TechnicalAssessment | TestBase;
