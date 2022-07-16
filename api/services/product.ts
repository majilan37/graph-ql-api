import {
  CreateProductInput,
  GetProductInput,
  ProductModel,
} from "../schema/product";
import { User } from "../schema/user";

class ProductService {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return ProductModel.create(input);
  }

  async getProducts() {
    return ProductModel.find().lean();
  }

  async getProduct(input: GetProductInput) {
    return ProductModel.findOne(input).lean();
  }
}

export default ProductService;
