import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { FeeCollectedEvent } from './schemas/feeCollectedEvent.schema'

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/feeCollectedEvents')
  async getFeeCollectedEvents(): Promise<FeeCollectedEvent[]> {
    return await this.appService.findAllFeeCollectedEvents()
  }
}
