export type ApiErrorResponse = {
    success: false;
    code: string;
    message: string;
    fieldErrors?: Record<string, string[]>;
};

export class ApiError extends Error {
    code: string;
    fieldErrors: Record<string, string[]>;

    constructor(error: ApiErrorResponse) {
        super(error.message);

        this.name = 'ApiError';
        this.code = error.code;
        this.fieldErrors = error.fieldErrors ?? {};
    }
}
