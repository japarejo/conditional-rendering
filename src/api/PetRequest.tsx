
export interface PetRequest<T> {
    content: T;
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
    sort?: string;
    first: boolean;
    numberOfElements: number;
}