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
  actorIds: number[];
  bookId: string;
}

export interface Actor {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'nonbinary';
  imageLink: string;
}
