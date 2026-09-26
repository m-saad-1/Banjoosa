/* ==========================================================================
   banjoosa - Centralized Site Configuration
   One source of truth for all images, links, and site data.
   ========================================================================== */

const BB_CONFIG = {

  /* ── Brand Info ─────────────────────────────────────────── */
  brand: {
    name: 'banjoosa',
    tagline: 'Premium Burgers & Fast Food',
    instagram: 'https://www.instagram.com/banjoosa/',
    phone: '+92 319 6990909',
    phonePretty: '+92 319 6990909',
    whatsapp: 'https://wa.me/923196990909',
    email: 'info@banjoosa.com',
    copyright: '© 2026 banjoosa. All rights reserved.',
  },


  /* ── Images (all relative to project root) ──────────────── */
  images: {
    logo:   'assets/images/logo.avif',
    hero:   'assets/images/hero.avif',
    offer:  'assets/images/combo-2.avif',

    /* Burgers */
    burger:   'assets/images/burger-1.avif',
    burger1:  'assets/images/burger-1.avif',
    burger3:  'assets/images/burger-3.avif',
    burgers1: 'assets/images/burger-1.avif',
    burgers2: 'assets/images/burger-2.avif',
    burgers3: 'assets/images/burger-3.avif',
    burgers4: 'assets/images/burger-4.avif',
    burgers5: 'assets/images/burger-5.avif',
    burgers6: 'assets/images/burger-1.avif',

    /* Pizzas (named) */
    chickenPizza:    'assets/images/chicken-pizza.avif',
    'crownbanjoosaPizza': 'assets/images/crown-banjoosa-pizza.avif',
    mughaliPizza:    'assets/images/mughali-pizza.avif',
    specialPizza:    'assets/images/special-pizza.avif',
    tandooriPizza:   'assets/images/tandoori-pizza.avif',
    'thinbanjoosaPizza':  'assets/images/thin-banjoosa-pizza.avif',

    /* Combos */
    deal:   'assets/images/combo-1.avif',
    deal1:  'assets/images/combo-2.avif',
    deal2:  'assets/images/combo-3.avif',
    deal4:  'assets/images/combo-4.avif',

    /* Rolls */
    roll1: 'assets/images/roll-1.avif',
    roll2: 'assets/images/roll-2.avif',

    /* Fries */
    cheeseFries: 'assets/images/cheese-fries.avif',
    plainFries:  'assets/images/plain-fries.avif',
    smokyFries:  'assets/images/smoky-fries.avif',
    frizzaFries: 'assets/images/frizza-fries.avif',

    /* Drinks */
    dew:         'assets/images/mountain-dew.avif',
    drinkCola:   'assets/images/pepsi.avif',
    cocaCola:    'assets/images/coca-cola.avif',
    sprite:      'assets/images/sprite.avif',
    mineralWater:'assets/images/mineral-water.avif',

    /* Sauce */
    garlicMayoDip:  'assets/images/garlic-mayo-dip.avif',
    coleslaw:       'assets/images/coleslaw.avif',
    ranchSauce:     'assets/images/ranch-sauce.avif',
    sirirachaSauce: 'assets/images/siriracha-sauce.avif',

    /* About Video */
    aboutVideo: 'assets/images/about.mp4',
  },

  /* ── Gallery ─────────────────────────────────────────────── */
  gallery: {
    images: [1,2,3,4,5].map(n => `assets/gallery/gallery-${n}.avif`),
    videos: [1].map(n => `assets/gallery/gallery-${n}.mp4`),
  },

  /* ── Opening Hours ───────────────────────────────────────── */
  hours: [
    { label: 'Lunch',        value: '11am to 4pm' },
    { label: 'Dinner',       value: '6:30pm to 12am' },
    { label: 'Special Deal', value: 'Fridays from 11am to 4pm' },
  ],

};

/* Make config globally accessible */
window.BB_CONFIG = BB_CONFIG;

