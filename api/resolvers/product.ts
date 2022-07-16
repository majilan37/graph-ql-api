import {
  Arg,
  AuthChecker,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import {
  Product,
  CreateProductInput,
  GetProductInput,
} from "../schema/product";
import ProductService from "../services/product";
import { Context } from "../types";

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return !!context.user;
};

@Resolver()
export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }

  @Authorized()
  @Mutation(() => Product)
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user;
    return this.productService.createProduct({ ...input, user: user._id });
  }

  @Query(() => [Product])
  getProducts() {
    return this.productService.getProducts();
  }

  @Query(() => Product)
  getProduct(@Arg("input") input: GetProductInput) {
    return this.productService.getProduct(input);
  }
}
