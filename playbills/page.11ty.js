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

function parseTitleBox(annotation, index) {
  const { body, target } = annotation
  const [ url, fragment ] = target.split('#')
  const [ key, values ] = fragment.split('=')
  const [ x, y, width, height ] = values.split(',')
  const text = body.value
  const id = `annotation-${index}`
  return { id, x, y, width, height, text }
}

function scaledTitleBox(box, scale) {
  const x = box.x / scale
  const y = box.y / scale
  const height = box.height / scale
  const width = box.width / scale
  return `<rect id="${box.id}" fill="transparent" stroke="orange" x=${x} y=${y} height=${height} width=${width} />`
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
    const { imageHeight, imageWidth } = config
    const [ canvas ] = pagination.items
    const { width, height, images } = canvas
    const { locations, metadata } = parseCanvas(canvas, pagination.pageNumber, config)
    const [src] = locations
    const canvasDates = dates.filter(item => item.target === canvas['@id'])
    const stringDates = canvasDates.map(date => `<li>${date.body.value}</li>`)
    const canvasTitles = titles.filter(item => item.target.startsWith(canvas['@id']))
    const titleBoxes = canvasTitles.map(parseTitleBox)
    const stringTitles = titleBoxes.map(box => `<li><a href="#${box.id}">${box.text}</a></li>`)
    const scale = Math.max((canvas.height / imageHeight), (canvas.width / imageWidth))
    const svgTitles = titleBoxes.map(box => scaledTitleBox(box, scale))

    const { href } = pagination
    const nextLink = href.next ? `<a href=..${href.next}>Next</a>` : 'Next'
    const previousLink = href.previous ? `<a href=..${href.previous}>Previous</a>` : 'Previous'

    return `
    <style>
      rect:target {
        fill: white;
        fill-opacity: 0.5;
      }
    </style>
    <h1>${manifest.label}</h1>
    <nav aria-label="Browse playbills">
    ${previousLink}
    ${nextLink}
    </nav>
    <h2>Digital image</h2>
    <svg width=700 style="float:left;" viewbox="0,0,${imageWidth},${imageHeight}">
      <image xlink:Href=${src} />
      ${svgTitles.join('\n')}
    </svg>
    <h2>Annotated Titles</h2>
    <ul>
      ${stringTitles.join('\n')}
    </ul>
    <h2>Annotated Dates</h2>
    <ul>
      ${stringDates.join('\n')}
    </ul>
    `
  }
}