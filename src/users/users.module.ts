import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserSchema } from '../schemas/user.schema'

@Module({
    imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
})
export class UsersModule {}
