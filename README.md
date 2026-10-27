# Auto Scraping

A Node.js scraper that collects listings of damaged cars from a Dutch car marketplace and exports them to CSV.

## Features
- Scrapes multiple result pages
- Filters on price, mileage and build year
- Extracts name, price, build year, fuel type, mileage and link
- Writes the results to a CSV file

## Built with
Node.js, `node-fetch` and `cheerio`

## Usage
```bash
npm install
node app.js
```

## What I learned
- Parsing HTML server-side with CSS selectors
- Turning unstructured web pages into structured data
