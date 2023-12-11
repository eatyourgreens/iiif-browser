const { manifestUrl } = require('./config')

async function readManifest(url) {
  if (url) {
    const response = await fetch(url)
    if (!response.ok) {
      const error = new Error(response.statusText)
      error.status = response.status
      throw error
    }
    const body = await response.json()
    console.log('Retrieved', body.label)
    return body
  }
  return null
}

module.exports = readManifest(manifestUrl)