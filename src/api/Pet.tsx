export interface Category {
    id: number;
    name: string;
}

export interface Pet {
    id: string;
    name: string;
    quantity: number;
    category: Category;
}