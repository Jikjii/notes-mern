import { InferSchemaType, model, Schema } from "mongoose";

// select allows for the password and email not to be shown on the frontend when the data is sent just the username

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, select: false },
  password: { type: String, required: true, select: false },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
