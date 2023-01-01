import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AtGuard } from './auth/common/guards'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    const reflector = new Reflector()
    app.useGlobalGuards(new AtGuard(reflector))
    app.setGlobalPrefix('api')
    await app.listen(3333)
}
bootstrap()
