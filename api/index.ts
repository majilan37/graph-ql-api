import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import { buildSchema } from "type-graphql";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { resolvers } from "./resolvers";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "./schema/user";
import { Context } from "./types";
import { authChecker } from "./resolvers/product";

(async () => {
  // * Build the schema
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  // * Init app
  const app = express();
  app.use(cookieParser());

  // * Create Apollo Server
  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => {
      if (ctx.req.cookies.accessToken) {
        const user = jwt.verify(
          ctx.req.cookies.accessToken,
          process.env.PRIVATE_KEY || ""
        ) as User;
        // console.log(user);
        ctx.user = user;
      }
      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault
        : ApolloServerPluginLandingPageGraphQLPlayground,
    ],
  });

  // * Start Server
  await server.start();

  // * middleware
  server.applyMiddleware({ app });

  // * listner
  app.listen(5000, () => console.log("Server runing on port 5000"));

  // * DB config
  mongoose.connect(process.env.MONGO_URI || "", () =>
    console.log("Mongo DB connected")
  );
})();
