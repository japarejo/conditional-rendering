export interface InputPet {
  name?: string;
  quantity?: number;
  category?: { name: string; id: number };
}

export type OutputPet = Omit<InputPet, "category"> & {
  category: { name: string };
};
