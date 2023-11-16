import { Controller, Get, Param } from '@nestjs/common'
import { AppService } from './app.service'
import { FeeCollectedEvent } from './schemas/feeCollectedEvent.schema'

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/feeCollectedEvents/integrator/:integratorAddress')
  async getFeeCollectedEvents(@Param('integratorAddress') integratorAddress: string): Promise<FeeCollectedEvent[]> {
    return await this.appService.findAllFeeCollectedEvents(integratorAddress)
  }
}
