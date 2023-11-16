/* eslint-disable prefer-const */

import { ethers } from 'ethers'
import { FeeCollector__factory } from 'lifi-contract-typings'
import { BlockTag } from '@ethersproject/abstract-provider'
import mongoose from 'mongoose'
import FeeCollectedEventModel from './models/FeeCollectedEvent.js'
import ChainModel from './models/Chain.js'
import dotenv from 'dotenv'
import cron from 'node-cron'

dotenv.config()

type ParsedFeeCollectedEvents = {
  token: string; // the address of the token that was collected
  integrator: string; // the integrator that triggered the fee collection
  integratorFee: bigint; // the share collector for the integrator
  lifiFee: bigint; // the share collected for lifi
}

/**
 * For a given contract address and provider uri a contract is loaded
 * @param address
 * @param providerUri
 */
const loadFeeCollectorContract = (address: string, providerUri: string) => {
  const feeCollector = new ethers.Contract(
		address,
		FeeCollector__factory.createInterface(),
		new ethers.providers.JsonRpcProvider(providerUri)
	)

  return feeCollector
}

/**
 * For a given block range all `FeesCollected` events are loaded from the FeeCollector contract
 * @param feeCollectorContract
 * @param fromBlock
 * @param toBlock
 */
const loadFeeCollectorEvents = async (feeCollectorContract: ethers.Contract, fromBlock: BlockTag, toBlock: BlockTag): Promise<ethers.Event[]> => {
	const filter = feeCollectorContract.filters.FeesCollected()
	return feeCollectorContract.queryFilter(filter, fromBlock, toBlock)
}

/**
 * Takes a list of raw events and parses them into ParsedFeeCollectedEvents
 * @param feeCollectorContract
 * @param events
 */
const parseFeeCollectorEvents = (
  feeCollectorContract: ethers.Contract,
	events: ethers.Event[],
): ParsedFeeCollectedEvents[] => {

	return events.map(event => {
		const parsedEvent = feeCollectorContract.interface.parseLog(event)

		const feesCollected: ParsedFeeCollectedEvents = {
			token: parsedEvent.args[0],
			integrator: parsedEvent.args[1],
			integratorFee: BigInt(parsedEvent.args[2]),
			lifiFee: BigInt(parsedEvent.args[3]),
		}
		return feesCollected
	})
}

/**
 * Takes an rpc provider uri and returns the latest block number of that chain
 * @param providerUri
 */
const fetchLatestBlockNumber = async (providerUri: string) => {
  return (new ethers.providers.JsonRpcProvider(providerUri)).getBlockNumber()
}


const BATCH_SIZE = 10 ** 6

cron.schedule('* * * * *', async () => {
  let db

  try {
    // TODO: Extract this into a repository module and add error handling around it
    console.log('Connecting to the db...')
    db = await mongoose.connect(process.env.MONGO_URI as string)
    console.log('Connected')
    
    // TODO: Extract this into a repository module and add error handling around it
    const chains = await ChainModel.find()
  
    for (let chain of chains) {
      const latestBlockNumber = await fetchLatestBlockNumber(chain.providerUri)

      // If the latest block mined has alreaby been scraped there's no work to be done
      if (chain.latestBlockScraped == latestBlockNumber) continue

      const fromBlock = chain.latestBlockScraped + 1
      console.log(`[${chain.name}] Fetching events starting with block ${fromBlock}`)

      const feeCollectorContract = loadFeeCollectorContract(chain.contractAddress, chain.providerUri)
      const rawEvents = await loadFeeCollectorEvents(feeCollectorContract, fromBlock, fromBlock + BATCH_SIZE)
      const parsedEvents : ParsedFeeCollectedEvents[] = parseFeeCollectorEvents(feeCollectorContract, rawEvents)
    
      console.log(`[${chain.name}] Returned ${parsedEvents.length} parsed events`)
      if (parsedEvents.length == 0) continue

      const dbEntries = parsedEvents.map(event => {
        return new FeeCollectedEventModel({
          chainId: chain.chainId,
          token: event.token,
          integrator: event.integrator,
          integratorFee: event.integratorFee,
          lifiFee: event.lifiFee
        })
      })

      // Insert events into the DB
      // TODO: Extract this into a repository module and add error handling around it
      let result = await FeeCollectedEventModel.insertMany(dbEntries)
      console.log(`[${chain.name}] Inserted ${result.length} events`)

      // Update the latestBlockScraped on this chain 
      // TODO: Extract this into a repository module and add error handling around it
      const newLatestBlockScraped = (fromBlock + BATCH_SIZE) > latestBlockNumber ? latestBlockNumber : (fromBlock + BATCH_SIZE)
      await ChainModel.updateOne().where('chainId').equals(chain.chainId).set({ latestBlockScraped: newLatestBlockScraped})
      console.log(`[${chain.name}] Updated latest block scraped to ${newLatestBlockScraped}`)
    }
 
  } catch (e) {
    console.error('Something wrong happened', e)
  } finally {
    db?.disconnect()
    console.log('Db connection closed')
  }
})


