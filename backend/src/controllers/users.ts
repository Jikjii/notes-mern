import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
}

// SIGN UP
export const signUp: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  // get data from sign up body
  const username = req.body.username;
  const email = req.body.email;
  const passwordRaw = req.body.password;

  try {
    if (!username || !email || !passwordRaw) {
      throw createHttpError(400, "Parameters Missing");
    }

    // Check for existing username
    const existingUsername = await UserModel.findOne({
      username: username,
    }).exec();

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username alreadt taken. Please choose a different one or log in instead."
      );
    }

    // Check for existing email
    const existingEmail = await UserModel.findOne({ email: email }).exec();

    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with the this email adress already exist. Please log in instead."
      );
    }

    // Hash Password - Save User
    const passwordHashed = await bcrypt.hash(passwordRaw, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    // holds the new users id in the session params letting them know they are currenly logged in
    req.session.userId = newUser._id

    // sending the new user in json format to frontend
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};
