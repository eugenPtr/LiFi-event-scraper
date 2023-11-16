import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('getFeeCollectedEvents', () => {
    it('should call getFeeCollectedEvents with arbitrary value', () => {
      const mockIntegratorAddress = 'arbitrary_value'
      const spy = jest.spyOn(appController, 'getFeeCollectedEvents')
      appController.getFeeCollectedEvents(mockIntegratorAddress)
      expect(spy).toHaveBeenCalledWith(mockIntegratorAddress)
    })
  })
})
