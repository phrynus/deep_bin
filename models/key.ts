import db from "./lib";
import { Schema } from "mongoose";

const schema = new Schema({
  user_id: { type: Schema.Types.UUID },
  mark_id: { type: Schema.Types.UUID },
  name: {
    type: String,
    match: /^[\u4e00-\u9fa5\w]{1,16}$/,
  },
  key: {
    type: String,
    match: /^\w{20,100}$/,
  },
  secret: {
    type: String,
    match: /^\w{20,100}$/,
  },
  password: {
    type: String,
    match: /^\w{1,100}$/,
  },
  exchange: { type: String },
});
export default db.model("key", schema);
