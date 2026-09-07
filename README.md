# Church Hub — Web Version

This is a responsive web version of the Church Hub project.

## Files
- `index.html` — main page
- `style.css` — layout and styling
- `main.js` — navigation, Google Sheet loading, clock, and rendering
- `config.js` — Google Apps Script URL and refresh interval
- `assets/` — starter logo/background

## Google Sheet connection
The website expects a Google Apps Script Web App that returns JSON.

Example JSON structure:

{
  "churchName": "Example Baptist Church",
  "verse": "For God so loved the world...",
  "reference": "John 3:16",
  "announcements": [
    {"title":"Sunday Service","date":"Sunday 10:00 AM","description":"Join us for worship."}
  ],
  "events": [
    {"title":"Youth Night","date":"Friday 7:00 PM","description":"Fellowship and Bible study."}
  ],
  "sermons": [
    {"title":"Latest Sermon","date":"September 6, 2026","description":"Sunday morning message","url":"https://example.com"}
  ],
  "liveUrl": "https://example.com/live",
  "contact": {
    "name":"Example Baptist Church",
    "address":"123 Main Street",
    "phone":"555-555-5555",
    "email":"church@example.com",
    "website":"https://example.com"
  }
}

Paste your deployed Apps Script URL into `config.js`:

const GOOGLE_SHEET_API = "YOUR_WEB_APP_URL";

## Running it
You can upload the files to GitHub Pages, Netlify, Cloudflare Pages, or another static web host.

The site refreshes Google Sheet data every 5 minutes by default.
