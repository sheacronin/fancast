export interface Book {
  id: string;
  title: string;
  authors?: string[];
  imageLink?: string;
  description?: string;
}

export interface Character {
  id: number;
  name: string;
  actorIds: number[];
  bookId: string;
  castings?: Casting[];
}

export interface Casting {
  id: number;
  createdAt: Date;
  characterId: number;
  character?: Character;
  actorId: number;
  actor: Actor;
  users?: User[];
  book?: Book;
}

export interface Actor {
  id: number;
  name: string;
  gender: 'male' | 'female' | 'nonbinary';
  imageLink: string;
}

export interface User {
  id: number;
  username: string;
  castings: Casting[]
}