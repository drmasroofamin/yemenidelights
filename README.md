# Yemeni Delights

A responsive, bilingual restaurant website built with HTML, CSS and JavaScript. No runtime dependencies, external fonts, analytics, cookies or data collection.

## Run

Use Node.js 22 or later. Run `npm run dev` in this directory; the server listens on port 3000 (override with `PORT`). `npm test` checks the page, assets, and local server.

## Deploy

Vercel hosts this as a static site. `vercel.json` sets the framework to Other, skips the build (there is no compile step), and publishes the project root. Import the repository and deploy; no dashboard build override is required. The Node server is only for local preview.

## Before publication

The business name and Red Sea Mall location came from the supplied brief. The public email `ydsaudi@yahoo.com` is shown as a contact address; confirm it is the one the restaurant wants published. The Facebook URL came from the supplied brief and was not re-verified. All food images are AI-created illustrative assets. The dishes are an introduction to Yemeni cuisine, not a verified restaurant menu. No prices, opening hours, phone number, reviews, or mall unit are stated as fact. Directions open a search for Red Sea Mall, not a verified restaurant pin. The street line names King Abdulaziz Road, the mall’s public road, and should be checked against the restaurant’s unit.

The footer credit “Demo prepared by SunriseAI” is for this pitch. Remove it when the site becomes the restaurant’s own.

Replace illustrative dish data and photography with the confirmed menu and authorized photographs. Confirm the Arabic brand name, exact mall unit, hours, phone, delivery, and ordering links before enabling ordering or reservations.

Edit bilingual copy in `data-en`/`data-ar` attributes and the `dishes` array in index.html. Language selection lives in memory only. The site is English first, with an Arabic RTL toggle. Assets are local.
