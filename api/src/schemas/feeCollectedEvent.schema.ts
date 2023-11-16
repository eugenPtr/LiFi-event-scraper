import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type FeeCollectedEventDocument = HydratedDocument<FeeCollectedEvent>;

@Schema()
export class FeeCollectedEvent {
  @Prop({ required: true })
  public chainId!: string

  @Prop({ required: true })
  public token!: string

  @Prop({ required: true })
  public integrator!: string 

  @Prop({ required: true })
  public integratorFee!: string 

  @Prop({ required: true })
  public lifiFee!: string 
}

export const FeeCollectedEventSchema = SchemaFactory.createForClass(FeeCollectedEvent)