import { Document } from 'mongoose';

export interface CategoriesInterface extends Document {
  category: string;
  description: string;
  events: Array<Event>;
}

export interface Event {
  name: string;
  operetion: string;
  value: string;
}
