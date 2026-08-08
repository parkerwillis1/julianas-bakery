# J Bake Co.

**Live:** <https://julianas-bakery.netlify.app> · **Repo:** <https://github.com/parkerwillis1/julianas-bakery>

Static multi-page site for a custom cake design practice. Plain HTML, CSS, and
vanilla JS, no framework, no build step. The files you see are the files that
get served.

```
index.html         landing page
designs.html       cake portfolio, rendered from designs-data.js
about.html         about Juliana
contact.html       order inquiry form
styles.css         the whole brand system
script.js          nav, scroll reveal, portfolio grid, form handling
designs-data.js    the cake list, the only file you edit to add a cake
images/            cake photos
```

## Run it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5176>. That's it, `serve` just hands out the files
in this folder. Save a file, refresh the browser, done.

## Add a new cake

Two steps, no code beyond one object.

1. Drop the photos into `images/`, e.g. `images/lemon-poppy-1.jpg`.
   Portrait crops look best (cards use a 4:5 ratio); ~1200px on the long edge.
2. Open `designs-data.js` and add one object to the `CAKE_DESIGNS` array:

```js
{
  title:       "Lemon & Poppy",
  description: "A single tier in lemon buttercream with a poppy seed crumb.",
  date:        "2026-08-01",              // YYYY-MM-DD, the grid sorts by this
  images: [                               // first one is the card photo
    "images/lemon-poppy-1.jpg",
    "images/lemon-poppy-2.jpg"
  ],
  ingredients: [                          // listed in the detail view
    "Lemon curd", "Poppy seed sponge", "Vanilla buttercream"
  ],
  tags: ["Birthday"]                      // Birthday · Celebration · Seasonal
},
```

Position in the array doesn't matter, the page sorts newest first by `date`.
`tags` drives the filter buttons, and a cake can carry more than one:
`["Birthday", "Seasonal"]`. Commit and push, and it's live.

Clicking a card opens the detail view: the `images` become a slideshow (arrows,
dots, arrow keys, Escape to close) and `ingredients` are listed underneath. One
photo is fine, the arrows just hide themselves. `ingredients` is optional, and a
single `image: "..."` string still works instead of the array.

The six seed cakes point at Unsplash URLs as placeholders. Swap them for local
`images/…` paths as real photos come in.

## Deploys

Netlify is connected to the `julianas-bakery` GitHub repo and watches `main`.

- **Push to `main` → Netlify publishes.** No build command; publish directory is
  `.` (see `netlify.toml`). A deploy takes a few seconds since there's nothing
  to compile.
- **Pull requests** get their own deploy preview URL.
- Rollbacks are one click in the Netlify dashboard under *Deploys*.

```bash
git add .
git commit -m "Add rose ombre tier"
git push
```

## Wiring up the contact form

The form has no backend, `script.js` intercepts the submit and shows a
thank-you panel. To make it send email, create a form at
[Formspree](https://formspree.io) and add the action to `#order-form` in
`contact.html`:

```html
<form class="form" id="order-form"
      action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

`script.js` checks for a real `action` and steps aside when it finds one, so
the browser posts the form normally. No other change needed.

## Brand quick reference

| Token    | Hex       | Used for                                |
| -------- | --------- | --------------------------------------- |
| Bordeaux | `#5B1F23` | the only accent, links, buttons, script |
| Oat      | `#DCCDBA` | section backgrounds, borders, rules      |
| Cream    | `#F6F2EC` | page background                          |
| Charcoal | `#2B2A26` | body text, footer                        |
| White    | `#FFFFFF` | cards only                               |

Type: **Pinyon Script** for script accents only (never long text), **Jost**
uppercase + wide letterspacing for nav and labels, **Lora** for body, **Playfair
Display** / Lora for headlines.
