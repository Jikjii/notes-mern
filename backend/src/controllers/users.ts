import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  // get currently logged in user out of the session
  const authenticatedUserId = req.session.userId;

  try {
    if (!authenticatedUserId) {
      throw createHttpError(401, "User not authenticated");
    }

    const user = await UserModel.findById(authenticatedUserId)
      .select("+email")
      .exec();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

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
    req.session.userId = newUser._id;

    // sending the new user in json format to frontend
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

// USER LOGIN

interface LoginBody {
  username?: string;
  password?: string;
}
export const login: RequestHandler<
  unknown,
  unknown,
  LoginBody,
  unknown
> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    //input validation
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    // compare password given in the frontend to the password in the database - even though one is raw and one is hashed
    const passwordMatch = await bcrypt.compare(password, user.password);

    // if false - passwords dont match
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    // user exist - establish a session
    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};
