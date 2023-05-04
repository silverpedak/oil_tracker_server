import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';

import { Role } from 'src/common';

export type UserDocument = HydratedDocument<User>;

@Schema({ id: true })
export class User {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Exclude()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  roles: Role[];

  @Prop()
  refreshToken: string;

  // For serialization to work(removes password from response object)
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
