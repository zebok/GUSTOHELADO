# GustoHelado — Personal Ice Cream Log & Recommender

[English](README.md) | [Español](README.es.md)

Live demo: https://zebok.github.io/GUSTOHELADO/

## About

This project started with a simple, everyday motivation: my love for ice cream.

I was born and raised in Buenos Aires, Argentina. I have also lived in other places and traveled a lot.

Buenos Aires is one of the cities with the best ice cream I have ever tasted. I am surrounded by an immense offering: national and international chains, artisanal and commercial shops. Over time, and after tasting ice cream around the world, I developed a fairly critical palate. I am not a professional critic, but I can tell a faithful flavor from an artificial one, and I enjoy chasing the best possible experience.

One day, I started writing flavors down and rating them. Everywhere. Today, everything lives in a single Google Sheet. From that, like a curious kid with questions and answers, I built a website to speed up the logging process and share my recommendations with the world.

This is my personal ice cream diary.

## Features

- **Craving-based recommender**: pick what you're in the mood for (chocolate, dulce de leche, creams, fruits, or signature flavors) and get ranked suggestions.
- **Live location or manual input**: the app uses your GPS position, or a location you type in.
- **Walk-radius control**: adjust the maximum distance and see what's nearby.
- **Blend Score ranking**: results are ordered by a score computed in real time in the browser.
- **Map view**: results plotted on an interactive map.
- **Personal insights**: KPIs and interactive charts (Chart.js) that explore my tasting history.
- **Open dataset**: browse the full database of shops and recorded tastings.

## How recommendations work

The app ranks nearby ice cream shops using a composite score, computed in real time in the browser:

- **Historical Quality (70%)**: average of my personal ratings for the flavor category you chose (chocolate, dulce de leche, creams, fruits, or signature flavors).
- **Geographic Proximity (30%)**: straight-line distance (Haversine formula) between my current location — from GPS or manual input — and the shop, normalized against your selected walk radius.

## Architecture

The data flow is designed to run with zero server and database costs:

```text
Google Form (logging from the phone)
   │
   ▼
Google Sheets (relational database and shop catalog)
   │
   ▼ (automated via GitHub Actions)
ETL Pipeline (Python + Pandas: cleans and processes the data)
   │
   ▼
Static JSON file (public/data/heladerias_prod.json)
   │
   ▼
React app (filtering, geolocation, and real-time scoring)
```

1. **Google Form & Sheets**: a Google Form, paired with an Apps Script, converts free text into identifiers and stores structured records in the occurrences sheet.
2. **ETL Pipeline**: a Python script reads the sheet tabs, joins the data, computes averages, and generates a unified JSON file.
3. **React frontend**: the app loads the static JSON and performs geolocation, filtering, and score calculation reactively — with no backend.


## Key learnings

This project was a hands-on exercise in:

- Relational database design and normalization using Google Sheets.
- Data ingestion and transformation (ETL) with Python and Pandas to generate clean, structured files.
- Geolocation and distance calculation with direct math in JavaScript (Haversine formula).
- Automation and continuous integration with GitHub Actions and Google Apps Script — without a dedicated backend.

---

This is my ice cream diary. And my first data project.
