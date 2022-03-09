const fetch = require('node-fetch')
const { titles } = require('./config')

async function fetchJSON(url) {
  if (url) {
    const response = await fetch(url)
    if (!response.ok) {
      const error = new Error(response.statusText)
      error.status = response.status
      throw error
    }
    const body = await response.json()
    return body
  }
  return null
}

async function fetchAnnotations(url) {
  const collection = await fetchJSON(url)
  const firstPage = await fetchJSON(collection.first.id)
  console.log('read', firstPage.items.length, 'titles')
  return firstPage
}
module.exports = fetchAnnotations(titles)