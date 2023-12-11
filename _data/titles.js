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

async function fetchPages(pages, url) {
  const page = await fetchJSON(url)
  pages = [...pages, page]
  if (page.next) {
    pages = await fetchPages(pages, page.next.id)
  }
  return pages
}

async function fetchAnnotations(url) {
  const collection = await fetchJSON(url)
  const pages = await fetchPages([], collection.first.id)
  const items = pages.map(page => page.items).flat()
  console.log('read', items.length, 'titles')
  return items
}
module.exports = fetchAnnotations(titles)