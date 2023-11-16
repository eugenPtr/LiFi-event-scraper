import mongoose from 'mongoose'
import dotenv from 'dotenv'
import ChainModel from '../models/Chain.js'

dotenv.config()

let db

try {
    console.log('[SEED] Connecting to db..')
    db = await mongoose.connect(process.env.MONGO_URI as string)
    console.log('[SEED] Connected')

    const chains = await ChainModel.find()
    console.log(`[SEED] Returned ${chains.length} chain configs from the database`)

    if (chains.length == 0) {
        const result = await ChainModel.insertMany([
            // Add in here other chains you want to fetch events from
            {
                name: 'Polygon',
                chainId: '137',
                contractAddress: '0xbD6C7B0d2f68c2b7805d88388319cfB6EcB50eA9', // FeeCollector address
                providerUri: process.env.POLYGON_PROVIDER_URI,
                latestBlockScraped: 47961368
            }
        ])
            
        console.log(`[SEED] Inserted ${result.length} chain configs into the db`)
    } 
    

} catch (e) {
    console.log('[SEED] Something went wrong', e)
} finally {
    db?.disconnect()
    console.log('[SEED] Connection closed')
}