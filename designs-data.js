/* ==========================================================================
   J BAKE CO. | Cake portfolio data
   --------------------------------------------------------------------------
   This is the ONLY file you edit to add a cake. designs.html renders the grid
   straight from the array below, newest date first. Clicking a card opens the
   detail view, which shows the `images` as a slideshow and lists `ingredients`
   underneath.

   TO ADD A NEW CAKE
   1. Drop the photos into the /images folder, e.g. images/lemon-poppy-1.jpg
   2. Copy the example below, paste it anywhere in the array, fill it in.
      (Order in the file does not matter, the page sorts by `date`.)

   {
     title:       "Lemon & Poppy",                  // card heading
     description: "A single tier in lemon buttercream with a poppy seed crumb.",
     date:        "2026-08-01",                     // YYYY-MM-DD, sorts the grid
     images: [                                      // first one is the card photo
       "images/lemon-poppy-1.jpg",
       "images/lemon-poppy-2.jpg"
     ],
     ingredients: [                                 // shown in the detail view
       "Lemon curd", "Poppy seed sponge", "Vanilla buttercream"
     ],
     tags: ["Birthday"]                             // Birthday, Celebration, Seasonal
   },

   NOTES
   · `tags` drives the filter buttons (All / Birthday / Celebration / Seasonal).
     A cake can carry more than one tag: ["Birthday", "Seasonal"].
   · `images` can be local paths or full URLs. One photo is fine, the slideshow
     just hides its arrows. A single `image: "..."` string still works too.
   · `ingredients` is optional. Leave it off and the detail view omits the list.
   · The seed cakes below use Unsplash URLs as placeholders. Swap them for real
     photos as you shoot them.
   ========================================================================== */

const CAKE_DESIGNS = [
  {
    title: "Cherry Linen",
    description:
      "Dark chocolate sponge under a crown of fresh cherries, with a hand-torn linen ribbon at the base.",
    date: "2026-06-14",
    images: [
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1626803775151-61d756612f97?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Dark chocolate sponge",
      "Fresh summer cherries",
      "Vanilla bean cream",
      "Cocoa ganache",
      "Cultured butter",
    ],
    tags: ["Birthday", "Seasonal"],
  },
  {
    title: "Velvet, Plainly",
    description:
      "Red velvet, cream cheese, and nothing else asked of it. Cut thin and served cold.",
    date: "2026-05-02",
    images: [
      "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578775887804-699de7086ff9?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Red velvet sponge",
      "Cream cheese frosting",
      "Buttermilk",
      "Madagascar vanilla",
      "A little cocoa",
    ],
    tags: ["Birthday", "Celebration"],
  },
  {
    title: "The Quiet Twenty",
    description:
      "A low, wide celebration cake in soft meringue and cream, with one script inscription and nothing more.",
    date: "2026-04-18",
    images: [
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Italian meringue",
      "Brown butter sponge",
      "Lemon curd",
      "Crème fraîche",
      "Sea salt",
    ],
    tags: ["Celebration"],
  },
  {
    title: "Winter Fig",
    description:
      "Vanilla bean sponge, mascarpone, and roasted winter fruit under a dusting of icing sugar.",
    date: "2026-02-09",
    images: [
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Vanilla bean sponge",
      "Whipped mascarpone",
      "Roasted figs",
      "Honey from Dripping Springs",
      "Toasted walnut",
    ],
    tags: ["Seasonal"],
  },
  {
    title: "Almond & Amaretto",
    description:
      "Fine layers of toasted almond crumb and mascarpone, with a whisper of amaretto through the soak.",
    date: "2025-11-22",
    images: [
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Toasted almond crumb",
      "Mascarpone cream",
      "Amaretto soak",
      "Espresso",
      "Bitter chocolate shavings",
    ],
    tags: ["Celebration", "Seasonal"],
  },
  {
    title: "Petite Bordeaux",
    description:
      "A six-inch cake in deep berry and cream, cut into fine layers. Small, intentional, complete.",
    date: "2025-09-30",
    images: [
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578775887804-699de7086ff9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1200&q=80",
    ],
    ingredients: [
      "Raspberry and blackcurrant",
      "Vanilla chiffon",
      "Swiss meringue buttercream",
      "Crushed pistachio",
    ],
    tags: ["Birthday"],
  },
];
