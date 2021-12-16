const cheerio = require('cheerio')
const axios = require('axios')
const tweet = require('./tweet')
const interval = 62000
const dotenv = require('dotenv')
const dates = []
dotenv.config()
const RSS_URL = 'https://seeder.mutant.garden/feed'

let populated = false
function pollRss() {
  axios
    .get(RSS_URL)
    .then((response) => {
      const $ = cheerio.load(response.data, {
        xml: true,
      })
      $('item').each((_, element) => {
        const title = $(element).find('title').text().trim()
        const link = $(element).find('link').text().trim()
        const date = $(element).find('pubDate').text().trim()
        const tweetContent = title + ' #MGSMUTATION ' + link
        if (!populated) {
          console.log('populated? (Should return false)', populated)
          dates.push(date)
          tweet.tweet(tweetContent)
        } else if (populated && !dates.includes(date)) {
          console.log('New event')
          dates.push(date)
          tweet.tweet(tweetContent)
        }
      })
      populated = true
      console.log('Events Length ', dates.length)
    })
    .catch((error) => console.log(error))
}

pollRss()

setInterval(() => pollRss(), interval)
