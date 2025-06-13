import mongoose from "mongoose";
import 'dotenv/config'
// @ts-ignore
let cached = global.mongoose || { conn: null, promise: null };
export default async function ConnectDb() {
  if(cached.conn) return cached.conn;
  if(!cached.promise){
    // @ts-ignore
    cached.promise = await  mongoose.connect(process.env.MONGODB_URI)
  }
  try {
    cached.conn = await cached.promise
  } catch (error) {
    console.error("Error Connecting To MongoDB",error);
  }
  return cached.conn
}
