import db from './lib';
import { Schema } from 'mongoose';

const schema = new Schema({
  uuid: { type: Schema.Types.UUID },
  user: {
    type: String,
    match: /^\w{1,32}$|^\w{1,32}@\w{1,9}\.\w{1,9}$/,
  },
  password: {
    type: String,
    match: /^\w{1,100}$/,
  },
  vip: { type: Date },
  fen: { type: Number },
  data: { type: String },
});
export default db.model('user', schema);
