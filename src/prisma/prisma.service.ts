import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: 'mongodb://localhost:27017/test',
                },
            },
        })
    }
    async onModuleInit() {
        await this.$connect()
    }
    async onModuleDestroy() {
        await this.$disconnect()
    }
}
