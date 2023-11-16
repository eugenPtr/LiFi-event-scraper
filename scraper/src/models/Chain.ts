import { getModelForClass, prop } from '@typegoose/typegoose'

class Chain {
  @prop({ required: true })
  public name!: string

  @prop({ required: true })
  public chainId!: string

  @prop({ required: true })
  public contractAddress!: string

  @prop({ required: true })
  public providerUri!: string

  @prop({ required: true })
  public latestBlockScraped!: number
}

const ChainModel = getModelForClass(Chain)
export default ChainModel