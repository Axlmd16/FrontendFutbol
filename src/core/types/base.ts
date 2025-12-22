export type ISODateString = string;
export type ISODateTimeString = string;

export interface BaseResponseSchema {
    id: number;
    created_at: ISODateTimeString;
    updated_at?: ISODateTimeString | null;
    is_active: boolean;
}
