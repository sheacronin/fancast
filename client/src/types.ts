export interface Book {
  id: string;
  title: string;
  authors?: string[];
  imageLink?: string;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  castIds?: string[];
  bookId: string;
}
