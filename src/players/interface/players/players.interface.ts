import { Document } from 'mongoose';
import { CategoriesInterface } from '../../../categories/interfaces/categories/categories.interface';

export interface PlayerInterface extends Document {
  phoneNumber: string;
  email: string;
  category: CategoriesInterface;
  name: string;
  ranking: string;
  position: number;
  urlPicPlayer: string;
}
