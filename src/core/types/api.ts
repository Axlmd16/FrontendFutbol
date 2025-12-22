export type ApiStatus = 'success' | 'error';

export interface ResponseSchema<TData = unknown> {
    status: ApiStatus;
    message: string;
    data?: TData | null;
    errors?: Record<string, unknown> | null;
}
