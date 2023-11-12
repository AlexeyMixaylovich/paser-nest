import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
class Price {
  @Prop()
  regular: string;
  @Prop()
  actual: string;
}

export type GoldenAppleProductDocument = HydratedDocument<GoldenAppleProduct>;

@Schema({ timestamps: true })
export class GoldenAppleProduct {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: Price,
    required: true,
  })
  price: Price;

  @Prop({ required: true })
  itemId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  productType: string;

  @Prop({ required: true })
  type: string;
  @Prop({ required: true })
  brand: string;

  @Prop({ type: [String], required: true })
  imageUrls: string[];

  @Prop({ required: true })
  url: string;
}

export const GoldenAppleProductSchema =
  SchemaFactory.createForClass(GoldenAppleProduct);
