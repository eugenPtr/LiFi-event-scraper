# LiFi Event Scraper

This project is composed of two modules
- `scraper` - a cron job that fetches FeeCollected events from Lifi's contracts deployed on various chains, and then stores them in a Mongo database
- `api` - an API with a REST endpoint to retrieve all FeeCollected events for a given `integrator`

## Setting up

### Prerequisites
- Docker
- a Mongo database (I recommend the free version of Atlas to avoid installing Mongo locally)

### Setting up
- have a look `.env.template` and create your own `.env` file, filling in your mongo db connection string and the address of your favorite polygon provider. (I use Alchemy)
- to fetch events from additional chains, update `./scraper/utils/dbSeed.js` using the existing configuration as a template:
 
```
// ./scraper/utils/dbSeed.js

...
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
...
  ```

### Running

All you need to run both the scraper and the api is `docker-compose up`

### How the scraper works
- Upon start, it seeds the database with the configs necessary to fetch events from any chain where LiFi's FeeCollectore contract has been deployed. If the chain collection already exist, this step is skipped.
- Every once in a while, a cron job is being run, fetching the latest events for each chain config in our database, while recording the latest block scraped in the database in order to avoid duplication.
