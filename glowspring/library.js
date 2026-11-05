/* The library. Item text is Anja's own wording from her notes, with only spelling fixed.
   Anything added on top of her words goes in `note` (shown as Good To Know), so hers stays hers.
   Section kinds: list, steps. A note can carry a `src` link to where it was checked. */

const SOURCES = {
  henna: 'https://www.fda.gov/cosmetics/cosmetic-products/temporary-tattoos-hennamehndi-and-black-henna-fact-sheet',
  vitaminA: 'https://ods.od.nih.gov/factsheets/VitaminA-Consumer/',
  selenium: 'https://ods.od.nih.gov/factsheets/Selenium-Consumer/',
  vinegar: 'https://www.unboundmedicine.com/medline/citation/22980269/Chemical_burn_from_topical_apple_cider_vinegar_'
};

/* Inside and Outside each split into roots, the daily habits, and remedies, the products and homemade things. */
const GROUPS = [
  { id: 'roots', name: 'Roots', line: 'The daily habits everything grows from.' },
  { id: 'remedies', name: 'Remedies', line: 'The products and homemade things you use.' }
];

const WORLDS = [
  {
    id: 'inside', name: 'Inside', line: 'What you take in, from the water you drink to your teas and supplements.',
    roots: ['water', 'food', 'movement', 'rest'],
    remedies: ['drink', 'teas', 'supplements']
  },
  {
    id: 'outside', name: 'Outside', line: 'What you put on, from your skin routine to makeup, hair and scent.',
    roots: ['routine', 'appearance'],
    remedies: ['skincare', 'masks', 'makeup', 'hair', 'scent']
  }
];

const SPRINGS = [
  // Inside
  {
    id: 'water', name: 'Water', tag: 'Pure Water', world: 'inside',
    intro: 'Pure water, and water from food.',
    sections: [
      {
        title: 'Every Single Day, Non Negotiable', kind: 'list',
        items: [
          { t: 'Drink 2.5-3L water. Start with warm lemon water every morning, stimulates liver and digestion.', note: 'Drink it in one go rather than sipping, rinse with plain water after, and wait before brushing, since daily acid wears down enamel.' }
        ]
      },
      {
        title: 'Water From Food', kind: 'list',
        items: [
          { t: '2-3 L water everyday/fruit/coconut water' },
          { t: 'Low sugar fruit juice' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'food', name: 'Food', tag: 'Healthy Eating', world: 'inside',
    intro: 'Healthy eating, raw food, pure water, water from food.',
    sections: [
      {
        title: 'Every Single Day, Non Negotiable', kind: 'list',
        items: [
          { t: '1 tbsp ground flaxseed in food or water, clears excess estrogen through gut.', note: 'Flax is a wonderful source of fiber, while its effect on estrogen is still being studied.' }
        ]
      },
      {
        title: 'Eat Often', kind: 'list',
        items: [
          { t: 'Fatty fish' }, { t: 'Walnuts' }, { t: 'Leafy greens' }, { t: 'Berries' }, { t: 'Pumpkin seeds' }, { t: 'Sweet potato' },
          { t: 'Broccoli, kale, spinach for excess estrogen' }
        ]
      },
      {
        title: 'This Week', kind: 'list',
        items: [{ t: 'Cut dairy and sugar completely this week.' }]
      }
    ],
    pantry: ['food']
  },
  {
    id: 'movement', name: 'Movement', tag: 'Exercise', world: 'inside',
    intro: 'Walking, moving and letting your body feel light.',
    sections: [
      {
        title: 'Every Day', kind: 'list',
        items: [
          { t: '10K steps everyday' },
          { t: 'Walk 45 min daily only, no intense sweating yet while barrier rebuilds. Sweating before barrier repairs can worsen congestion.' }
        ]
      },
      {
        title: 'Debloat', kind: 'list',
        items: [{ t: 'Sleep on back' }, { t: 'Guasha' }, { t: 'Jumping' }]
      },
      {
        title: 'Reset', kind: 'list',
        items: [{ t: 'Massage + sauna' }]
      }
    ],
    pantry: []
  },
  {
    id: 'rest', name: 'Rest', tag: 'Sleep, Sun And Quiet', world: 'inside',
    intro: 'Sleep, morning light and the quiet that brings you back to yourself.',
    sections: [
      {
        title: 'Every Single Day, Non Negotiable', kind: 'list',
        items: [
          { t: '8hrs sleep, before midnight, skin repairs only at night.', note: 'Skin repair peaks at night, though it does carry on through the day too.' },
          { t: '10 min morning sunlight within 1hr of waking, regulates cortisol which controls hormones.' },
          { t: 'Sunlight', note: 'Morning light is the gentle kind. Wear sunscreen for longer stretches in the sun.' }
        ]
      },
      {
        title: 'Music', kind: 'list',
        items: [
          { t: 'Low frequency music' },
          { t: 'Classical music' },
          { t: 'Worship music' },
          { t: 'Silence' }
        ]
      }
    ],
    pantry: []
  },

  {
    id: 'drink', name: 'Morning Drink', tag: 'Every Morning', world: 'inside',
    intro: 'What goes into the glass first thing.',
    sections: [
      {
        title: 'Drink Every Morning', kind: 'list',
        link: { label: 'Watch The Reel', href: 'https://www.instagram.com/reel/DYfFn1fu1Os/' },
        items: [
          { t: '2 lemons juice' },
          { t: 'Chlorella + cilantro combo from NutraMedix', note: 'The label suggests taking it every other day and says it is not for pregnancy or nursing. Chlorella can also interfere with blood thinners like warfarin.' },
          { t: 'Global Healing wheat grass 1 tbs' },
          { t: '1 drop of GHI selenium', note: 'The adult upper limit for selenium is 400 mcg a day from everything combined, and too much can cause hair loss, so count your Brazil nuts too.', src: SOURCES.selenium },
          { t: 'Silica 1 tbs' },
          { t: 'Coconut water' },
          { t: 'Marine phytoplankton' },
          { t: 'Chlorophyll' },
          { t: 'Cellmed PSP', note: 'Anything taken this often deserves a look at the label, so follow the dose on each bottle and show the full list to your doctor if you have a thyroid condition or take medication.' },
          { t: '+ low sugar fruit juice' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'teas', name: 'Teas', tag: 'Daily Cups', world: 'inside',
    intro: 'Herbal teas for clear skin and an easy belly.',
    sections: [
      {
        title: 'Every Single Day, Non Negotiable', kind: 'list',
        items: [
          { t: '2 cups spearmint tea daily, lowers androgens that cause oil overproduction.', note: 'The studies behind this are small. Check with your doctor if you are pregnant or take hormone treatments.' }
        ]
      },
      {
        title: 'Teas', kind: 'list',
        items: [
          { t: 'Ginger' }, { t: 'Nettle' }, { t: 'Hibiscus tea' }, { t: 'Chamomile' }, { t: 'Sage' }, { t: 'Goji berries' },
          { t: 'Dandelion root tea for debloat' },
          { t: 'Spearmint', note: 'Herbal teas can interact with medication, and several of these are best avoided in pregnancy, so check with your doctor first.' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'supplements', name: 'Supplements', tag: 'Healthmaxing', world: 'inside',
    intro: 'What I take to support skin, hair and energy from within.',
    sections: [
      {
        title: 'Supplements', kind: 'list',
        items: [
          { t: 'Collagen + creatine supplement' },
          { t: "Dr. Morse's herbs", note: 'Herbs can interact with medication and are not all safe in pregnancy, so check with your doctor before starting.' },
          { t: 'Liver supplement: Paul or Ancient Nutrition' },
          { t: 'Cod liver oil supplement', note: 'Liver and cod liver oil are both high in preformed vitamin A. The NIH upper limit for adults is 3,000 mcg a day from all sources, and too much in pregnancy can cause birth defects, so add them up before taking both.', src: SOURCES.vitaminA }
        ]
      }
    ],
    pantry: []
  },

  // Outside
  {
    id: 'routine', name: 'Skin Routine', tag: 'Daily Habits', world: 'outside',
    intro: 'My everyday skin habits, morning and evening.',
    sections: [
      {
        title: 'Every Single Day, Non Negotiable', kind: 'list',
        items: [
          { t: 'Change pillowcase every 2 days or sleep on a clean t-shirt.' },
          { t: 'Warm washcloth or steaming to open pores.', note: 'Pores have no muscles, so they do not truly open, though warmth does soften what is inside them. Keep your face well back from hot water.' },
          { t: 'CLAY mask for oily skin.' }
        ]
      },
      {
        title: 'Morning And Evening', kind: 'list',
        items: [
          { t: 'Morning: Cool water rinse only, no cleanser. Apply raw aloe vera gel, let dry. That\'s your entire morning.', note: 'Add a mineral sunscreen on any day you will be outside.' },
          { t: 'Evening: Oil cleanse with jojoba oil, massage 2-3 full minutes especially congested areas, wipe with warm damp cloth. Jojoba mimics your skin\'s own sebum so it won\'t clog. Apply raw honey as mask for 15 min, antibacterial and repairs barrier. Rinse. Finish with 1-2 drops rosehip oil, natural vitamin A, helps cell turnover.' }
        ]
      },
      {
        title: 'Body', kind: 'list',
        items: [{ t: 'Moisturize whole body after shower, heels.' }]
      }
    ],
    pantry: []
  },
  {
    id: 'skincare', name: 'Skincare', tag: 'Skinmaxing', world: 'outside',
    intro: 'The skincare products I use and want to try.',
    sections: [
      {
        title: 'Brands I Use', kind: 'list',
        items: [
          { t: 'Primally Pure' },
          { t: 'De La Cruz' }
        ]
      },
      {
        title: 'Body', kind: 'list',
        items: [
          { t: 'Beef Tallow', note: 'It is rich and can clog pores on breakout-prone skin, so it may suit your body better than your face.' }
        ]
      }
    ],
    pantry: ['face', 'body']
  },
  {
    id: 'masks', name: 'Homemade', tag: 'Masks And Scrubs', world: 'outside',
    intro: 'My homemade masks, scrubs and weekly rituals.',
    sections: [
      {
        title: 'Mask Routine', kind: 'steps',
        items: [
          { t: 'Steam first, 5 min over hot water bowl. This softens everything and makes removal much easier.' },
          { t: 'Konjac sponge, gentle circular motions on damp skin after steam. The texture lifts dead cells without tearing skin.' },
          { t: 'Honey enzyme mask, raw honey contains natural enzymes that literally digest dead skin cells. Leave 20 min, massage gently while rinsing.' },
          { t: 'Apple cider vinegar diluted, 1 part ACV to 3 parts water as a toner after cleansing. Contains natural AHAs that dissolve dead skin buildup over time.', note: 'Vinegar on skin has caused chemical burns in reported cases, so patch test first, rinse it off if it stings, and skip it on irritated skin.', src: SOURCES.vinegar },
          { t: 'Consistency beats intensity, doing gentle exfoliation 3x a week works better than scrubbing hard once.' }
        ]
      },
      {
        title: 'This Week', kind: 'list',
        items: [
          { t: 'Face steam 1x this week. Boil water, lean over bowl, towel over head, 5 min. Opens pores. Follow immediately with honey mask.', note: 'Let the water cool for a minute first, since steam burns are common. Skip it if your skin is red or irritated.' },
          { t: 'Green tea toner. Brew, cool, store in fridge, apply with cotton pad after cleansing.' },
          { t: '2x this week, oatmeal and honey scrub. 1 tbsp ground oats mixed with honey, massage gently 30 sec in circles, rinse. This is your exfoliation.' },
          { t: '1x this week, kaolin clay mask mixed with water, apply to congested areas only, 10 min, rinse.' },
          { t: 'Dry brushing, body only, NEVER face: Before shower 3x this week, always brush upward toward your heart. Stimulates lymphatic drainage which removes toxins that otherwise exit through skin. Face skin is too delicate for dry brushing, it causes microtears.', note: 'It feels lovely and softens skin. The lymph and toxin part has little proof behind it, since your liver and kidneys do that work.' },
          { t: 'Ice rolling every morning: Wrap ice cube in cloth, glide over face 10-15 sec per area. Reduces inflammation, tightens, amazing for your skin type.' },
          { t: 'Start gua sha nightly: Use stone with few drops jojoba oil on clean face, always upward and outward strokes, 5 min. Drains lymph from face, reduces puffiness, brings circulation to congested areas.' }
        ]
      },
      {
        title: 'Exfoliant', kind: 'list',
        items: [
          { t: 'Fine sea salt, completely different from sand. Dissolve it mostly in water or honey so it\'s very diluted, barely any grit. Antibacterial, mineral rich. Use 1x a week max.' },
          { t: 'Celtic Salt + water = sea, face exfoliation.', note: 'Dissolve it fully, because undissolved crystals can scratch, and leave it out on active breakouts.' }
        ]
      },
      {
        title: 'Face Wash', kind: 'list',
        items: [
          { t: 'Clove' },
          { t: 'Oregano oil', note: 'Clove and oregano are two of the strongest essential oils and can burn skin. Never use them neat on your face. Dilute them heavily, patch test, and keep them away from your eyes.' },
          { t: 'Tea tree oil' },
          { t: 'Water' },
          { t: 'Tea tree + honey mask' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'makeup', name: 'Makeup', tag: 'Glowmaxing', world: 'outside',
    intro: 'Clean makeup, Moroccan beauty secrets, lashes and brows.',
    sections: [
      {
        title: 'Clean Makeup', kind: 'list',
        items: [
          { t: 'ARAZA Beauty' },
          { t: 'Toups and Co Organics' }
        ]
      },
      {
        title: 'Moroccan Beauty', kind: 'list',
        items: [
          { t: 'Morocco Henna' },
          { t: 'Rhassoul clay, Ghassoul' },
          { t: 'Moroccan Red Makeup Clay' },
          { t: 'Argan oil for hair' },
          { t: 'Rose water' }
        ]
      },
      {
        title: 'Henna Brows', kind: 'list',
        items: [
          { t: 'Henna Sooq' },
          { t: 'The Henna Guys' },
          { t: 'The Morocco Method', note: 'FDA approves henna only as a hair dye, and says it may not be used on eyebrows, eyelashes or around the eyes. Please be especially careful with "black henna", which can contain PPD and cause serious skin reactions.', src: SOURCES.henna }
        ]
      },
      {
        title: 'Lashes And Brows', kind: 'list',
        items: [
          { t: 'Castor oil everyday for lashes and brows', note: 'There is no good proof that it grows hair, and it should stay out of your eyes.' },
          { t: 'Rosemary oil brows', note: 'Always dilute it in a carrier oil and keep it well away from your eyes.' },
          { t: 'Eyelash and Brow serum: Plume Science' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'hair', name: 'Hair', tag: 'Hairmaxing', world: 'outside',
    intro: 'Natural lightening, scalp care and strong, shiny lengths.',
    sections: [
      {
        title: 'Hair Lighting', kind: 'list',
        items: [
          { t: 'Chamomile tea' },
          { t: 'Lemon juice', note: 'Keep lemon off your skin in the sun, since citrus and sunlight together can cause burns and dark patches.' },
          { t: 'Jojoba oil/argan (after)' },
          { t: 'Honey' },
          { t: 'Aloe vera' },
          { t: 'Turmeric' },
          { t: 'Cinnamon', note: 'Cinnamon can burn the scalp, so patch test it and rinse it off quickly if it tingles.' }
        ]
      }
    ],
    pantry: ['hair']
  },
  {
    id: 'scent', name: 'Scent', tag: 'Smelling Good', world: 'outside',
    intro: 'Natural perfume and soft, clean scents.',
    sections: [
      {
        title: 'For Perfume', kind: 'list',
        items: [
          { t: 'Vanilla absolute oil for parfume', note: 'Natural scents can still irritate skin, so test a little on your wrist first.' },
          { t: 'Rose water' },
          { t: 'Sonia Washburn natural perfume' }
        ]
      }
    ],
    pantry: []
  },
  {
    id: 'appearance', name: 'Appearance', tag: 'Personal Style', world: 'outside',
    intro: 'Colors, clothes, teeth, hair and the small finishing touches.',
    sections: [
      {
        title: 'Colors For Me', kind: 'swatches',
        lede: 'Warm/Deep Autumn, soft summer',
        items: [
          { t: 'Dusty blue', hex: '#8CA3B5' },
          { t: 'Sage green', hex: '#A9B89A' },
          { t: 'Dark red', hex: '#7A1F24' },
          { t: 'Black', hex: '#111111' },
          { t: 'White', hex: '#FFFFFF' },
          { t: 'Navy', hex: '#1C2B4A' },
          { t: 'Pastel earth colors', hex: '#D8C3A5' },
          { t: 'Espresso brown', hex: '#3C2A21' },
          { t: 'Deep purple', hex: '#3F2A56' },
          { t: 'Cool berry/raspberry', hex: '#A8295C' }
        ]
      },
      {
        title: 'Clothing', kind: 'list',
        items: [{ t: 'Inverted triangle best clothes for it' }]
      },
      {
        title: 'Smile', kind: 'list',
        items: [
          { t: 'Invisalign for teeth, go check clinics' },
          { t: 'Bamboo with full bristle toothbrush' }
        ]
      },
      {
        title: 'Face Testing', kind: 'list',
        items: [
          { t: 'Face IQ', note: 'Lighting, camera angle and lens change the score a lot, so treat it as a snapshot to learn from rather than a verdict on how you look.' }
        ]
      },
      {
        title: 'Finishing Touches', kind: 'list',
        items: [
          { t: 'Optimize hairstyle' },
          { t: 'Sophie Nails' },
          { t: 'Italian bracelet' }
        ]
      }
    ],
    pantry: []
  }
];

const SHELF_GROUPS = [
  { id: 'basics', label: 'Free Basics' },
  { id: 'supplements', label: 'Supplements' },
  { id: 'face', label: 'Face' },
  { id: 'body', label: 'Body' },
  { id: 'hair', label: 'Hair And Brows' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'nails', label: 'Nails' },
  { id: 'scent', label: 'Perfume' },
  { id: 'clothes', label: 'Clothes' },
  { id: 'bedding', label: 'Bedsheets And Home' }
];

/* Brands only, no product names, shades or prices. `also` lists extra groups a brand shows in. Only brands whose site answered are linked.
   `goals` match the quiz goals, `avoid` hides a brand for a sensitivity, `skinTypes` narrows it to some skin types. */
const SHELF = [
  { group: 'makeup', brand: 'Araza Beauty', href: 'https://arazabeauty.com/', goals: ['makeup'] },
  { group: 'makeup', brand: 'Toups And Co Organics', href: 'http://rwrd.io/ref_UG2YZ2F?c', note: '10% off with my link.', also: ['face'], goals: ['makeup'] },
  { group: 'makeup', brand: '100% Pure', href: 'https://www.100percentpure.com/', note: 'Makeup colored with fruit and plant pigments.', also: ['face'], goals: ['makeup', 'skin'] },
  { group: 'makeup', brand: 'True Glue', note: 'An all-natural lash adhesive.', goals: ['makeup'] },
  { group: 'makeup', brand: 'Uoga Uoga', href: 'https://uogauoga.com/', note: 'A natural makeup and skincare brand from Lithuania, in Europe. In the USA you can find it through Ecco Verde.', also: ['face'], goals: ['makeup', 'skin'] },
  { group: 'makeup', brand: 'Well People', href: 'https://www.wellpeople.com/', goals: ['makeup'] },
  { group: 'face', brand: 'Primally Pure', href: 'https://primallypure.com/', goals: ['skin'] },
  { group: 'face', brand: 'De La Cruz', note: 'Sulfur acne care. Follow the label and keep it off broken skin.', goals: ['skin'], skinTypes: ['oily', 'combination'] },
  { group: 'face', brand: 'Plume Science', href: 'https://www.plumescience.com/', note: 'Lash and brow serums. Check the full ingredient list on the box.', goals: ['makeup', 'hair'] },
  { group: 'hair', brand: 'Innersense', href: 'https://innersensebeauty.com/', goals: ['hair'] },
  { group: 'hair', brand: 'Vita Prima', href: 'https://vitaprima.com/', goals: ['hair'] },
  { group: 'hair', brand: 'Henna Sooq', href: 'https://hennasooq.com/', note: 'FDA approves henna for hair only, and not for brows or around the eyes.', goals: ['hair'] },
  { group: 'hair', brand: 'The Henna Guys', goals: ['hair'] },
  { group: 'hair', brand: 'The Morocco Method', goals: ['hair'] },
  { group: 'supplements', brand: 'Carnivore Aurelius', href: 'https://carnivoreaurelius.com/', goals: ['skin', 'hair', 'body'] },
  { group: 'supplements', brand: 'Heart And Soil', href: 'https://shop.heartandsoil.co/', note: 'Some of their supplements are made with liver, which is high in vitamin A.', goals: ['energy', 'skin', 'hair'], avoid: ['pregnancy'] },
  { group: 'supplements', brand: 'Ancient Nutrition', href: 'https://ancientnutrition.com/', goals: ['energy'], avoid: ['pregnancy'] },
  { group: 'supplements', brand: 'Global Healing', href: 'https://globalhealing.com/?oid=26&affid=6477058', note: 'My favorite cleanses: Complete Body Cleanse, Liver Cleanse, Colon Cleanse, Harmful Organism Cleanse and the Gut Health Bundle.', goals: ['energy', 'skin', 'hair', 'gut'] },
  { group: 'supplements', brand: "Dr. Morse's", href: 'https://drmorses.com/', note: 'Herbal formulas. Check with your doctor first if you are pregnant, nursing or take medication.', goals: ['gut', 'energy'], avoid: ['pregnancy'] },
  { group: 'supplements', brand: 'NutraMedix', href: 'https://www.nutramedix.com/', note: 'The label on their chlorella and cilantro drops says they are not for pregnancy or nursing.', goals: ['gut'], avoid: ['pregnancy'] },
  { group: 'scent', brand: 'Sonia Washburn', href: 'https://www.soniawashburn.com/', note: 'Natural perfume.', avoid: ['fragrance'] },
  { group: 'body', brand: 'Weddell', href: 'https://weddellwater.com/?rfsn=8864954.0ba9b7', note: 'Shower filters.', goals: ['skin', 'hair'] },
  { group: 'bedding', brand: 'Hatch', href: 'https://www.hatch.co/', note: 'Sunrise alarm clocks.', goals: ['sleep'] },
  { group: 'body', brand: 'Rowe Casa', href: 'https://www.rowecasaorganics.com/', note: 'Castor oil packs.', goals: ['gut'], avoid: ['pregnancy'] },
  { group: 'face', brand: 'FaceIQ Labs', href: 'https://www.faceiqlabs.com/', note: 'Face analysis and rating.', goals: ['body'] },
  { group: 'nails', brand: 'SOPHi', href: 'https://sophinailpolish.com/', note: 'Water-based nail polish.' },
  { group: 'clothes', brand: 'MATE The Label', href: 'https://matethelabel.com/' },
  { group: 'clothes', brand: 'Pact', href: 'https://wearpact.com/' },
  { group: 'clothes', brand: 'Brandy Melville', href: 'https://us.brandymelville.com/' },
  { group: 'clothes', brand: 'Colorful Standard', href: 'https://colorfulstandard.com/' },
  { group: 'clothes', brand: 'Indigo Luna', href: 'https://indigoluna.store/' },
  { group: 'clothes', brand: 'Moo Moda', href: 'https://moomoda.com/' },
  { group: 'clothes', brand: 'Abysse' },
  { group: 'clothes', brand: 'Kla by Clara', href: 'https://klabyclara.com/', note: 'Handmade headbands.' },
  { group: 'body', brand: "Jana's All Natural", href: 'https://www.janasallnatural.com/', also: ['makeup', 'scent', 'face'] },
  { group: 'supplements', brand: 'Earth Harmony', href: 'https://www.earthharmony.com/?oid=14&affid=6477058', note: 'Organic supplements.', goals: ['energy'] },
  { group: 'supplements', brand: 'Global Healing Multivitamin', href: 'https://globalhealing.com/products/multivitamin?uid=101&oid=26&affid=6477058', note: 'Organic, plant-based multivitamin with minerals.', goals: ['energy'] },
  { group: 'basics', brand: 'Walk Every Day', note: 'Free and the easiest way to lose fat. Aim for 8,000 to 10,000 steps, and a 10 to 15 minute walk after meals to steady your blood sugar.', goals: ['body', 'energy'] },
  { group: 'basics', brand: 'Morning Sunlight', note: 'Ten minutes outside soon after waking sets your body clock, so you sleep better and wake with more energy.', goals: ['sleep', 'energy'] },
  { group: 'basics', brand: 'Sleep Seven To Nine Hours', note: 'Same bedtime every night, a dark cool room and no screens for the last hour. Skin and hormones repair while you sleep.', goals: ['sleep', 'skin'] },
  { group: 'basics', brand: 'Water And Minerals', note: 'Drink filtered water through the day, with a pinch of sea salt or some lemon in the morning.', goals: ['skin', 'energy'] },
  { group: 'basics', brand: 'Real Food First', note: 'Protein at every meal, lots of fruit and vegetables, olive oil, and as little ultra-processed food as you can.', goals: ['skin', 'hair', 'energy', 'gut'] },
  { group: 'basics', brand: 'Move And Lift', note: 'Strength training two to three times a week keeps you toned and helps your hormones.', goals: ['body'] },
  { group: 'face', brand: 'Manuka Honey', note: 'Raw manuka honey, UMF 10+ or MGO 263+, as a face mask. Calming and antibacterial, lovely for breakouts and dull skin. Leave on for 15 minutes and rinse. Skip it with a bee or pollen allergy.', goals: ['skin'] },
  { group: 'basics', brand: 'Global Healing Institute', href: 'https://globalhealinginstitute.org/?oid=16&affid=6477058', note: 'Where I study. Courses on the root cause of disease, plus Dr. Group\'s body cleansing diet.' },
  { group: 'bedding', brand: 'BlockBlueLight', href: 'https://www.blockbluelight.com/?ref=anjagregoran', note: 'Blue light glasses for better sleep. 10% off with my link.', goals: ['sleep'] },
  { group: 'face', brand: 'Living Libations', href: 'https://int.livinglibations.com/', also: ['body', 'hair'], goals: ['skin'] },
  { group: 'face', brand: 'Immortella', href: 'https://immortella.eu/', note: 'Natural face and body care and essential oils, from Croatia.', also: ['body'], goals: ['skin'] },
  { group: 'face', brand: 'Global Healing Skin Therapy', href: 'https://globalhealing.com/products/skin-therapy?uid=87&oid=26&affid=6477058&creative_id=22', note: 'Ozone oil for skin. Also try Luminous for radiant skin.', goals: ['skin'] },
  { group: 'body', brand: 'Rvstika', href: 'https://rvstica.com/', note: 'Full-boiled natural soaps.' },
  { group: 'nails', brand: 'Olive And June', href: 'http://rwrd.io/ref_SEKFMLR?c', note: '25% off your first system with my link.' },
  { group: 'clothes', brand: 'LA Relaxed', href: 'https://larelaxed.com/' },
  { group: 'clothes', brand: 'I Love Linen', href: 'https://www.ilovelinen.com.au/collections/wear' },
  { group: 'clothes', brand: 'The Bare Road', href: 'https://thebareroad.com/' },
  { group: 'clothes', brand: 'Natural Life', href: 'https://fbuy.io/naturallife/88tx658t', note: '20% off with my link.' },
  { group: 'clothes', brand: 'Quince', href: 'https://www.quince.com/', also: ['bedding'] },
  { group: 'face', brand: 'Annmarie Skin Care', href: 'https://www.annmariegianni.com/', note: 'Organic and wild-harvested oils and clay masks.', goals: ['skin'] },
  { group: 'face', brand: 'Leahlani', href: 'https://www.leahlaniskincare.com/', note: 'Hawaiian botanical oils and masks, made in small batches.', goals: ['skin'] },
  { group: 'face', brand: 'Josh Rosebrook', href: 'https://joshrosebrook.com/', note: 'Plant-based actives and organic oils. Rich in essential oils, so patch test if you are sensitive.', goals: ['skin'], avoid: ['fragrance'] },
  { group: 'bedding', brand: 'Blissy', href: 'https://blissy.com/', note: 'Mulberry silk pillowcases. Less friction for your hair and skin while you sleep.', also: ['hair', 'face'], goals: ['hair', 'skin', 'sleep'] },
  { group: 'bedding', brand: 'Slip', href: 'https://slip.com/', note: 'Silk pillowcases and scrunchies, gentle on hair and skin.', also: ['hair'], goals: ['hair', 'skin', 'sleep'] },
  { group: 'bedding', brand: 'Linen Sheets', note: 'My favorite fabric for bedding and clothes. Natural, breathable, cool in summer and softer with every wash. Look for 100% pure, stonewashed European flax.', also: ['clothes'], goals: ['sleep'] },
  { group: 'bedding', brand: 'Brooklinen', href: 'https://www.brooklinen.com/pages/all-bed', note: 'Sheets, duvets and bedding.', goals: ['sleep'] }
];

/* Which library sections the quiz suggests for each goal. */
const GOAL_SPRINGS = {
  skin: ['routine', 'skincare', 'masks'],
  hair: ['hair'],
  energy: ['drink', 'supplements', 'movement'],
  sleep: ['rest', 'teas'],
  gut: ['food', 'teas', 'water'],
  body: ['movement', 'appearance'],
  makeup: ['makeup']
};
