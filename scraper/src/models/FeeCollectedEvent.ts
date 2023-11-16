import { getModelForClass, prop } from '@typegoose/typegoose'

class FeeCollectedEvent {
  @prop({ required: true })
	public chainId!: string

  @prop({ required: true })
  public token!: string

  @prop({ required: true })
  public integrator!: string 

  @prop({ required: true })
  public integratorFee!: bigint 

  @prop({ required: true })
  public lifiFee!: bigint 
}

const FeeCollectedEventModel = getModelForClass(FeeCollectedEvent)
export default FeeCollectedEventModel