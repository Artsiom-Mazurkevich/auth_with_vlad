import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
    providers: [PrismaService],
})
export class AppModule {}
