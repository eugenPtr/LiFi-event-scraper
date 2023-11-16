import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { FeeCollectedEvent, FeeCollectedEventSchema } from './schemas/feeCollectedEvent.schema'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: FeeCollectedEvent.name, schema: FeeCollectedEventSchema }])],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
