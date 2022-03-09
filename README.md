# iiif-browser
March 2022 hackday project: browse an IIIF manifest from the British Library.

Run it locally with
```
npm install
npx eleventy --serve
```

Browse the annotated images on
https://eatyourgreens.github.io/iiif-browser/playbills/0.html

## How it works

`_data/config.js` contains the URL of a British Library [IIIF manifest](https://iiif.io/api/presentation/2.0/#manifest), which lists digitised theatre playbills, and the URLs of two [annotation collections](https://iiif.io/api/presentation/3.0/#58-annotation-collection):
- `dates.json` collects plain text dates that volunteers have entered, one per playbill per volunteer.
- `titles.json` collects rectangles that volunteers drew around performance titles, along with the transcribed titles themselves.

`playbills/page.11ty.js` is an [Eleventy](https://www.11ty.dev/) template that loops over the default sequence of canvases in the manifest (`manifest.sequences[0].canvases`), printing out some HTML for each canvas. The HTML contains the canvas image, rendered as an SVG `<image>` overlaid with SVG rectangles for each crowdsourced title, and lists of the title and date text annotations for each canvas. Titles are linked to their related rectangle on the image via page fragment identifiers.
