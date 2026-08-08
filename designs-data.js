/* ==========================================================================
   J BAKE CO. — Cake portfolio data
   --------------------------------------------------------------------------
   This is the ONLY file you edit to add a cake. designs.html renders the grid
   straight from the array below, newest date first.

   TO ADD A NEW CAKE
   1. Drop the photo into the /images folder, e.g.  images/rose-tier.jpg
   2. Copy the example below, paste it anywhere in the array, fill it in.
      (Order in the file does not matter — the page sorts by `date`.)

   {
     title:       "Rose Ombre Tier",              // shown as the card heading
     description: "Three tiers in blush buttercream with hand-piped roses.",
     date:        "2026-08-01",                   // YYYY-MM-DD, used for sorting
     image:       "images/rose-tier.jpg",         // path relative to this site
     tags:        ["Wedding"]                     // any of: Wedding, Birthday, Seasonal
   },

   NOTES
   · `tags` drives the filter buttons (All / Wedding / Birthday / Seasonal).
     A cake can carry more than one tag: ["Wedding", "Seasonal"].
   · `image` can be a local path or a full URL — the seed cakes below use
     Unsplash URLs as placeholders. Swap them for real photos as you shoot them.
   ========================================================================== */

const CAKE_DESIGNS = [
  {
    title: "Ivory Cascade",
    description:
      "Four tiers of smooth Italian buttercream with a cascade of sugared blooms, finished in soft ivory.",
    date: "2026-06-14",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80",
    tags: ["Wedding"],
  },
  {
    title: "Cherry Linen",
    description:
      "Dark chocolate sponge under a crown of fresh cherries, with a hand-torn linen ribbon at the base.",
    date: "2026-05-02",
    image:
      "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
    tags: ["Birthday", "Seasonal"],
  },
  {
    title: "The Quiet Twenty",
    description:
      "A low, wide celebration cake in soft meringue and cream — one script inscription, nothing more.",
    date: "2026-04-18",
    image:
      "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=900&q=80",
    tags: ["Birthday"],
  },
  {
    title: "Winter Fig",
    description:
      "Vanilla bean sponge, mascarpone, and roasted winter fruit under a dusting of icing sugar.",
    date: "2026-02-09",
    image:
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=900&q=80",
    tags: ["Seasonal"],
  },
  {
    title: "Almond & Amaretto",
    description:
      "Fine layers of toasted almond crumb and mascarpone, with a whisper of amaretto through the soak.",
    date: "2025-11-22",
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80",
    tags: ["Wedding", "Seasonal"],
  },
  {
    title: "Petite Bordeaux",
    description:
      "A six-inch cake in deep berry and cream, cut into fine layers — small, intentional, complete.",
    date: "2025-09-30",
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80",
    tags: ["Birthday"],
  },
];
