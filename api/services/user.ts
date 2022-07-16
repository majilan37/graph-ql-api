import { ApolloError } from "apollo-server";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user";
import { Context } from "../types";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserService {
  async createUser(input: CreateUserInput) {
    // * Call our User model
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const err = "Invalid email or password";
    // * Get our user by email
    const user = await UserModel.find().findByEmail(input.email).lean();
    if (!user) {
      throw new ApolloError(err);
    }

    // * Validate a password
    const isValid = await bcrypt.compare(input.password, user.password);
    if (!isValid) {
      throw new ApolloError(err);
    }

    // * Sign JWT
    const token = jwt.sign(user, process.env.PRIVATE_KEY || "");

    // * Set a cookie for jwt
    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // * return jwt
    return token;
  }
}

export default UserService;
