// Generates events/YYYY/DD-MM-YYYY.html from events-data.json.
// Run after adding a new event's photos + entry: node scripts/build-events.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const events = JSON.parse(fs.readFileSync(path.join(__dirname, 'events-data.json'), 'utf8'));

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const page = (e) => {
  const imgBase = `/img/Events/${e.year}/${e.slug}`;
  const showHero = e.hero && !/^\d+\.webp$/.test(e.hero);

  const downloadBtn = e.zip ? `
        <div class="event-meta">
          <a class="btn" href="${imgBase}/${e.zip}" download="${esc(e.downloadName || e.title)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
            Download All Photos
          </a>
        </div>` : '';

  const heroBlock = showHero ? `
        <a href="${imgBase}/${e.hero}" style="display:block;border-radius:10px;overflow:hidden;margin-bottom:18px">
          <img src="${imgBase}/${e.hero}" alt="${esc(e.title)} — group photo" loading="lazy">
        </a>` : '';

  const photoLinks = e.photos.map(p => `
          <a href="${imgBase}/${p}"><img src="${imgBase}/${p}" alt="${esc(e.title)} photo" loading="lazy"></a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${esc(e.title)} — Elite Creative Group, Indore. Event photos from ${e.date}.">
  <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon">
  <link rel="stylesheet" href="/css/main.css">
  <title>${esc(e.title)} — Elite Creative Group</title>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-83DPGDBW78"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-83DPGDBW78');
  </script>
</head>
<body>

  <header class="site-header">
    <div class="container">
      <a class="brand" href="/"><img src="/img/name_logo.png" alt="Elite Creative Group"></a>
      <button class="nav-toggle" aria-expanded="false" aria-label="Menu" aria-controls="siteNav">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="siteNav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/event" aria-current="page">Events</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="page-hero">
    <div class="container">
      <h1>${esc(e.title)}</h1>
      <p class="crumb"><a href="/event">Events</a> · ${e.date}</p>
    </div>
  </section>

  <main class="section">
    <div class="container">${downloadBtn}${heroBlock}
      <div class="gallery">${photoLinks}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>Copyright © <span id="curYr"></span> Elite Creative Group &amp; <a href="https://devolvee.com/">Devolvee</a> | All rights reserved</p>
    </div>
  </footer>

  <script src="/js/main.js"></script>
</body>
</html>
`;
};

function cardImage(e) {
  if (e.card) return e.card;
  const dir = path.join(ROOT, 'img', 'Events', e.year, e.slug);
  if (fs.existsSync(dir)) {
    const entries = fs.readdirSync(dir);
    const show = entries.find(f => /^group_show\.webp$/i.test(f));
    if (show) return `img/Events/${e.year}/${e.slug}/${show}`;
    const group = entries.find(f => /^group\.webp$/i.test(f));
    if (group) return `img/Events/${e.year}/${e.slug}/${group}`;
  }
  if (e.photos.length) return `img/Events/${e.year}/${e.slug}/${e.photos[0]}`;
  return 'img/groupImageNotAvailable.png';
}

const listingPage = () => {
  const years = [...new Set(events.map(e => e.slug.slice(-4)))].sort().reverse();

  const yearButtons = years.map(y => `
        <button data-year="${y}">${y}</button>`).join('');

  const cards = events.map(e => `
        <a class="event-card" href="/events/${e.year}/${e.slug}" data-year="${e.slug.slice(-4)}">
          <div class="event-card__img"><img src="${cardImage(e)}" alt="${esc(e.title)}" loading="lazy"></div>
          <div class="event-card__body">
            <h3>${esc(e.title)}</h3>
            <p class="event-card__date">${e.date}</p>
          </div>
        </a>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="All events organised by Elite Creative Group, Indore — outings, celebrations, games, and gatherings since 2015.">
  <link rel="shortcut icon" href="img/favicon.png" type="image/x-icon">
  <link rel="stylesheet" href="css/main.css">
  <title>Events — Elite Creative Group</title>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-83DPGDBW78"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-83DPGDBW78');
  </script>
</head>
<body>

  <header class="site-header">
    <div class="container">
      <a class="brand" href="/"><img src="img/name_logo.png" alt="Elite Creative Group"></a>
      <button class="nav-toggle" aria-expanded="false" aria-label="Menu" aria-controls="siteNav">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav" id="siteNav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/event" aria-current="page">Events</a></li>
          <li><a href="/contact">Contact Us</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <section class="page-hero">
    <div class="container">
      <h1>Events</h1>
      <p class="crumb">Every gathering since 2015</p>
    </div>
  </section>

  <main class="section">
    <div class="container">
      <div class="filter-bar">
        <button data-year="all" class="active">All Events</button>${yearButtons}
      </div>
      <div class="card-grid">${cards}
      </div>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>Copyright © <span id="curYr"></span> Elite Creative Group &amp; <a href="https://devolvee.com/">Devolvee</a> | All rights reserved</p>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
`;
};

let count = 0;
for (const e of events) {
  if (e.special) continue;
  const outPath = path.join(ROOT, 'events', e.year, `${e.slug}.html`);
  fs.writeFileSync(outPath, page(e));
  count++;
}
fs.writeFileSync(path.join(ROOT, 'event.html'), listingPage());
console.log(`Generated ${count} event pages + event.html listing`);
