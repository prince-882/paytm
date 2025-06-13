import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import { number } from "zod";
const UserSchema = new Schema({
  firstname: { type: String, required: true, trim: true, maxLength: 30 },
  lastname: { type: String, required: true, trim: true, maxLength: 30 },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: String, required: true, minLength: 6 },
});
UserSchema.methods.createHash = async function (plainTextPassword : string) {
  return await bcrypt.hash(plainTextPassword, 10);
};

UserSchema.methods.validatePassword = async function (candidatePassword : string) {
  return await bcrypt.compare(candidatePassword, this.password);
};


export const User = mongoose.models.User || mongoose.model("User", UserSchema);

const AccountSchema = new Schema({
  balance:{type:Number,required:true},
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
})
export const Account = mongoose.models.Account || mongoose.model("Account", AccountSchema);
