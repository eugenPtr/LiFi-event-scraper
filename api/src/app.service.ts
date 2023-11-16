import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FeeCollectedEvent } from './schemas/feeCollectedEvent.schema'

@Injectable()
export class AppService {
  constructor(@InjectModel(FeeCollectedEvent.name) private feeCollectedEventModel: Model<FeeCollectedEvent>) {}
  
  async findAllFeeCollectedEvents(integratorAddress: string): Promise<FeeCollectedEvent[]> {
    return this.feeCollectedEventModel.find({ integrator: integratorAddress }).exec()
  }
}
