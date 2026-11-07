# Kosway

**Plan a trip with friends, then carry it in your pocket.**

Kosway is a mobile-first travel planner that installs like an app (it's a PWA). It began as a Vizag · Araku · Vanjangi trip plan for three friends and grew into a planner for any trip in India.

- Live: https://krishnaar21.github.io/vizag/
- Beta (newest builds): https://krishnaar21.github.io/vizag/beta/

## What it does

**Plan**
- Build a trip from a start city, dates, travellers, budget, pace and travel mode.
- See it as days: wake-up and sleep times, stops in order, travel legs and distances.
- "Suggest more with AI": your chosen assistant suggests places to add.
- Templates and a built-in sample trip so you can start fast.

**On the trip**
- Home shows today: the next stop, today's spend, stay, food and cab estimates, plus the weather and daylight hours.
- Day-by-day checklists with ticks that are saved, and a "Jump to now" shortcut.
- Bookings, packing list, budget split per person, and alerts in one Plan tab.
- Explore: route, places, stays, food and shops, each with map links.
- Save places you like to a Saved tab.

**Together**
- Travel groups with avatars, and a Top travellers board (coming soon).
- Share a trip as a PDF or a QR code.

**Make it yours**
- Themes in light and dark (Classic, Mono, Paper, Ocean, Sage, Lilac), app icon presets, nav styles, sounds and a choice of refresh animation.

**Works anywhere**
- Works offline after the first visit; the Home tag shows Online, Local, Demo or Offline mode.
- Sign in to sync across devices, or use it signed out with data kept on your phone.
- Demo mode shows a sample trip without touching your own data.

**Plans**
- Free: 2 trips.
- Trip pass: ₹199 for 30 days.
- Atlas AI: ₹99 a month.
- Yearly: ₹999 for unlimited trips and Atlas.
- Customisation add-on: ₹99, one-time.

## Tech

- Plain HTML, CSS and JavaScript, with no framework and no build step.
- A service worker (`sw.js`) caches the app so it works offline and shows an update prompt for new builds.
- Firebase (Auth and Firestore, compat SDK 10.12) for sign-in and sync.
- Optional AI assistants: Claude, ChatGPT (OpenAI), Gemini or your own MCP server. Keys stay on the device.
- Data from Open-Meteo (weather), OpenStreetMap tiles, Wikipedia and Openverse (place images), and Google Maps links.
- Hosted on GitHub Pages: the `main` branch is live and the `beta` branch is served at `/beta/`.

### Folder layout

```
index.html          markup, icon sprite, built-in trip data
styles/
  base.css          reset, layout and components
  themes.css        theme palettes (light and dark)
  refinements.css   newer tweaks, grouped by named section
scripts/
  startup.js        runs first: saved theme, splash, write guard
  app.js            main app: views, planner, sync, sheets
  features.js       newer features, in numbered parts
  themes.js         theme and palette switching
  app-icon.js       app icon presets
  online-scene.js   online/offline scenes
  qr-code.js        third-party QR code generator
sw.js               service worker (offline cache)
manifest.webmanifest
```

To run it locally, serve the folder with any static server, for example `python3 -m http.server`, and open `http://localhost:8000`.

## Credits

- Design and product: Krishna AR.
- Built with help from Claude (Anthropic).
- Icons: [Hugeicons](https://hugeicons.com) free set.
- Fonts: [Nunito](https://fonts.google.com/specimen/Nunito), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) and [Caveat](https://fonts.google.com/specimen/Caveat) from Google Fonts.
- Weather: [Open-Meteo](https://open-meteo.com).
- Maps: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Place info and images: [Wikipedia](https://www.wikipedia.org) and [Openverse](https://openverse.org).
- QR codes: a bundled open-source QR code generator (`scripts/qr-code.js`).

© Krishna AR. All rights reserved.
