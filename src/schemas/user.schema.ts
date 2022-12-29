import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, collection: 'users' })
export class User {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    hash: string

    @Prop()
    hashedRt?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
