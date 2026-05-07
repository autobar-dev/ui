import { File } from "./file";

export type Product = {
  id: number,
  names: Map<string, string>,
  descriptions: Map<string, string>,
  cover: File,
  enabled: boolean,
  badges: any[],
  createdAt: Date,
  updatedAt: Date,
};
