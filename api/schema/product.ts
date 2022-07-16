import { getModelForClass, index, prop, Ref } from "@typegoose/typegoose";
import { ObjectType, Field, InputType } from "type-graphql";
// import { customAlphabet } from "nanoid";
import { User } from "./user";
import { IsNumber, MaxLength, Min, MinLength } from "class-validator";

// const nanoId = customAlphabet("abcefghijklmnopqrcuwxyz123456789", 10);

@ObjectType()
@index({ productId: 1 })
export class Product {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @Field(() => String)
  @prop({ required: true })
  name: string;

  @Field(() => String)
  @prop({ required: true })
  description: string;

  @Field(() => Number)
  @prop({ required: true })
  price: number;

  @Field(() => String)
  @prop({ required: true, default: `product_${Math.random()}`, unique: true })
  productId: string;
}

export const ProductModel = getModelForClass<typeof Product>(Product);

@InputType()
export class CreateProductInput {
  @Field()
  name: string;

  @MinLength(15, {
    message: "Description must be at least 15 characters",
  })
  @MaxLength(1000, {
    message: "Description must not exceed 1000 characters",
  })
  @Field()
  description: string;

  @IsNumber()
  @Min(1)
  @Field()
  price: number;
}

@InputType()
export class GetProductInput {
  @Field()
  productId: string;
}
