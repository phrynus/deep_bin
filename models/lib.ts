import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}
mongoose
  // @ts-ignore
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("[mongoose] 数据库连接成功");
  })
  .catch((err) => {
    console.log(`[mongoose] 数据库连接失败: ${err}`);
  });

export default mongoose;
