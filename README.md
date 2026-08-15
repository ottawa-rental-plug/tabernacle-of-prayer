# Tabernacle of Prayer Parish — website

Static site for Tabernacle of Prayer Parish, Ottawa (New Life In Christ Ministry).
Deployed on Netlify at https://tabernacleofprayer.ca

## Layout

```
index.html            single page; all sections are anchors on this one file
404.html              custom not-found page
robots.txt            allows all crawlers, points at the sitemap
sitemap.xml           one entry, the homepage
assets/css/styles.css design tokens + component styles
assets/js/app.js      i18n (EN/FR), scroll reveals, image probing
assets/img/           portraits, book covers, hero photograph
assets/video/         optional looping hero clip
brand/                crest and favicons
```

## Images are optional, and named by convention

`app.js` probes for each image and silently keeps a styled placeholder when the
file is absent, so nothing breaks if one is missing. Extensions are tried in the
order `.webp`, `.jpg`, `.png`, `.jpeg`.

| Slot | Path |
| --- | --- |
| Hero background | `assets/img/ottawa.*` then `assets/img/hero.*` |
| Apostle Cornelius Babalola | `assets/img/pastor-1.*` |
| Pastor Ansa Babalola | `assets/img/pastor-2.*` |
| Echoes of a Praying Heart | `assets/img/book-1.*` |
| Footsteps of Destiny | `assets/img/book-2.*` |
| Hero video (optional) | `assets/video/hero.webm` then `.mp4` |

**The hero photograph is not in this repo yet.** Add it at
`assets/img/ottawa.jpg` — keep it under ~400 KB at about 1920px wide, since it
is the first thing every visitor downloads.

## Colour

The palette lives in the `:root` block at the top of `styles.css`, with a
`Morning Light` override block appended at the end. That block re-points tokens
rather than rewriting rules; deleting it restores the previous darker look
exactly.

The hero scrim is tuned so text clears WCAG AA over a bright photograph — the
13px uppercase eyebrow is the tightest case and sets those numbers. If you
change the hero image to something much brighter, re-check that label.
