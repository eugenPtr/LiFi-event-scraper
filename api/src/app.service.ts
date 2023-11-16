import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FeeCollectedEvent } from './schemas/feeCollectedEvent.schema'

@Injectable()
export class AppService {
  constructor(@InjectModel(FeeCollectedEvent.name) private catModel: Model<FeeCollectedEvent>) {}
  
  async findAllFeeCollectedEvents(): Promise<FeeCollectedEvent[]> {
    return this.catModel.find().exec()
  }
}
