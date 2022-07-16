import UserResolver from "./user";
import ProductResolver from "./product";

export const resolvers = [UserResolver, ProductResolver] as const;
