import * as mongoose from 'mongoose';

export const CategorySchema = new mongoose.Schema(
  {
    category: { type: String, unique: true },
    description: { type: String },
    events: [
      {
        name: { type: String },
        operetion: { type: String },
        value: { type: Number },
      },
    ],
  },
  { timestamps: true, collection: 'categories' },
);
