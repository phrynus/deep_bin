import db from './lib';
import { Schema } from 'mongoose';

const schema = new Schema({
  user_id: { type: Schema.Types.UUID },
  type: { type: String },
  tag: { type: String },
  msg: {
    type: String,
  },
  created_at: { type: Date, default: Number(new Date()) + 8 * 60 * 60 * 1000 },
});
export default db.model('log', schema);
