
export interface UnitOfWork<T> {
    adds: T[];
    deletes: T[];
};

export interface ProcessorResult {
    isSuccessful: boolean;
    errorMessage?: string | undefined;
};