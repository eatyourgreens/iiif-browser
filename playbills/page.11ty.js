function parseCanvasImage(image, config) {
  const { resource } = image;
  const { imageHeight, imageWidth } = config
  const id = resource.service['@id'];
  const src = `${id}/full/!${imageWidth},${imageHeight}/0/default.jpg`;
  return src;
}

function parseCanvas(canvas, index, config) {
  const locations = canvas.images.map(image => parseCanvasImage(image, config));
  const metadata = {
    "iiif:canvas": canvas['@id'],
    priority: index + 1
  };
  return { locations, metadata };
}

module.exports = class Playbill {
  data() {
    return {
      pagination: {
        data: 'manifest.sequences[0].canvases',
        size: 1
      },
      permalink: ({ pagination }) => `/playbills/${pagination.pageNumber}.html`
    }
  }

  render({ config, manifest, dates, titles, pagination }) {
    const [ canvas ] = pagination.items
    const { width, height, images } = canvas
    const { locations, metadata } = parseCanvas(canvas, pagination.pageNumber, config)
    const [src] = locations
    const canvasDates = dates.items.filter(item => item.target === canvas['@id'])
    const stringDates = canvasDates.map(date => `<p>${date.body.value}</p>`)
    const canvasTitles = titles.items.filter(item => item.target.startsWith(canvas['@id']))
    const stringTitles = canvasTitles.map(title => `<p>${title.body.value}</p>`)
    return `
    <svg width=700 style="float:left;" viewbox="0,0,1400,2000">
      <image xlink:Href=${src} />
    </svg>
    ${stringDates.join('\n')}
    ${stringTitles.join('\n')}
    `
  }
}