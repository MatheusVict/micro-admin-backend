import * as mongosse from 'mongoose';

export const PlayerSchema = new mongosse.Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: String,
    category: { type: mongosse.Schema.Types.ObjectId, ref: 'categories' }, // O populate é o nome do atributo
    ranking: String,
    position: Number,
    urlPicPlayer: String,
  },
  { timestamps: true, collection: 'players' },
);
