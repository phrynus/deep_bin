import db from "./lib";
import { Schema } from "mongoose";

const schema = new Schema({
  user_id: { type: Schema.Types.UUID },
  type: { type: String },
  event: { type: String },
  json: {
    type: String,
  },
});
export default db.model("records", schema);
// 账户记录