/* Everything the app knows lives here, so it can grow without touching the app code.
   Ingredient tiers: pure, fine, caution, skip. Flags: fragrance, nut, pregnancy. */

const TIERS = {
  pure:    { label: 'Glow',   note: 'From nature and gentle, what I reach for' },
  fine:    { label: 'Okay',   note: 'Lab-made or processed, and well tolerated' },
  caution: { label: 'Rarely', note: 'I only buy this about 2% of the time' },
  skip:    { label: 'Never',  note: 'I would never put this on my body' },
  unknown: { label: 'Not Rated Yet', note: 'Not in my list yet' }
};

const INGREDIENTS = [
  // Base
  { n: 'Water', a: ['water', 'aqua', 'eau'], t: 'pure', w: 'The base of most formulas, and usually the reason a product needs a preservative.' },
  { n: 'Flower Water', a: ['flower water', 'rose water', 'hydrosol', 'leaf water'], t: 'pure', w: 'A gentle water distilled from a plant, carrying a light natural scent.' },
  { n: 'Beef Tallow', a: ['beef tallow', 'grass-fed tallow', 'grass fed tallow', 'tallow'], t: 'pure', w: 'Rendered beef fat that is very close to the oils in our own skin. I choose grass-fed tallow from regenerative farms.' },
  { n: 'Aloe Vera', a: ['aloe barbadensis', 'aloe vera'], t: 'pure', w: 'Hydrating and soothing, and a common natural replacement for water.' },
  { n: 'Glycerin', a: ['glycerin', 'glycerine'], t: 'fine', w: 'A humectant that pulls water into skin. It can be plant-based or synthetic, and labels rarely say which.' },
  { n: 'Propanediol', a: ['propanediol'], t: 'fine', w: 'A lightweight humectant that is often fermented from corn.' },
  { n: 'Butylene Glycol', a: ['butylene glycol'], t: 'fine', w: 'A petroleum-derived humectant and solvent that most skin tolerates well.' },
  { n: 'Propylene Glycol', a: ['propylene glycol'], t: 'caution', w: 'A synthetic humectant that irritates a small share of people, so patch test if your skin reacts easily.' },

  // Oils, butters, waxes
  { n: 'Jojoba Oil', a: ['simmondsia chinensis', 'jojoba'], t: 'pure', w: 'A liquid wax that sits close to the skin\'s own oils and suits most skin types.' },
  { n: 'Rosehip Oil', a: ['rosa canina', 'rosa rubiginosa', 'rosa moschata', 'rosehip'], t: 'pure', w: 'A light oil rich in linoleic acid that helps dry and dull skin.' },
  { n: 'Argan Oil', a: ['argania spinosa', 'argan'], t: 'pure', w: 'A nourishing oil for skin and hair that comes from a nut kernel.', f: ['nut'] },
  { n: 'Sweet Almond Oil', a: ['prunus amygdalus dulcis', 'sweet almond'], t: 'pure', w: 'A soft, skin-softening oil, best avoided with a tree nut allergy.', f: ['nut'] },
  { n: 'Macadamia Oil', a: ['macadamia'], t: 'pure', w: 'A rich, soft oil pressed from a tree nut.', f: ['nut'] },
  { n: 'Hazelnut Oil', a: ['corylus', 'hazelnut'], t: 'pure', w: 'A light oil pressed from a tree nut.', f: ['nut'] },
  { n: 'Walnut Oil', a: ['juglans regia', 'walnut'], t: 'pure', w: 'A plant oil pressed from a tree nut.', f: ['nut'] },
  { n: 'Coconut Oil', a: ['cocos nucifera oil', 'coconut oil'], t: 'pure', w: 'Lovely for hair and body, though it can clog pores on acne-prone faces.' },
  { n: 'Olive Oil', a: ['olea europaea', 'olive oil'], t: 'pure', w: 'A nourishing oil that suits body care better than very sensitive facial skin.' },
  { n: 'Sunflower Oil', a: ['helianthus annuus', 'sunflower'], t: 'pure', w: 'A light oil rich in linoleic acid and vitamin E.' },
  { n: 'Avocado Oil', a: ['persea gratissima', 'persea americana', 'avocado'], t: 'pure', w: 'A rich oil that helps very dry skin and hair.' },
  { n: 'Grapeseed Oil', a: ['vitis vinifera', 'grapeseed', 'grape seed'], t: 'pure', w: 'A thin, fast-absorbing oil.' },
  { n: 'Sea Buckthorn Oil', a: ['hippophae rhamnoides', 'sea buckthorn'], t: 'pure', w: 'A bright orange oil full of carotenoids and fatty acids.' },
  { n: 'Castor Oil', a: ['ricinus communis', 'castor oil'], t: 'pure', w: 'A thick, glossy oil used in lip and hair care.' },
  { n: 'Hydrogenated Castor Oil', a: ['hydrogenated castor oil'], t: 'fine', w: 'Castor oil hardened into a wax, used for texture.' },
  { n: 'Shea Butter', a: ['butyrospermum parkii', 'vitellaria paradoxa', 'shea butter', 'shea'], t: 'pure', w: 'A rich butter that seals in moisture.' },
  { n: 'Cocoa Butter', a: ['theobroma cacao', 'cocoa butter'], t: 'pure', w: 'A firm, softening butter that can clog pores on the face.' },
  { n: 'Mango Butter', a: ['mangifera indica'], t: 'pure', w: 'A light butter that softens without feeling heavy.' },
  { n: 'Beeswax', a: ['cera alba', 'beeswax'], t: 'pure', w: 'A natural wax that seals and gives structure. It is not vegan.' },
  { n: 'Candelilla Wax', a: ['euphorbia cerifera', 'candelilla'], t: 'pure', w: 'A plant wax and a vegan swap for beeswax.' },
  { n: 'Carnauba Wax', a: ['copernicia cerifera', 'carnauba'], t: 'pure', w: 'A hard plant wax from palm leaves.' },
  { n: 'Lanolin', a: ['lanolin'], t: 'caution', w: 'A wool-derived wax that seals in moisture and is a known allergen for some people.' },
  { n: 'Squalane', a: ['squalane'], t: 'fine', w: 'A stable, weightless oil. Most is now made from olives or sugarcane.' },
  { n: 'Caprylic/Capric Triglyceride', a: ['caprylic capric triglyceride'], t: 'fine', w: 'A light oil made from coconut or palm that feels silky.' },
  { n: 'Coco-Caprylate', a: ['coco caprylate'], t: 'fine', w: 'A coconut-derived oil used as a natural swap for silicone slip.' },
  { n: 'C12-15 Alkyl Benzoate', a: ['c12 15 alkyl benzoate'], t: 'fine', w: 'A light synthetic emollient, common in sunscreens.' },

  // Botanicals
  { n: 'Oat', a: ['avena sativa', 'colloidal oatmeal'], t: 'pure', w: 'Calms itchy, irritated skin and has real evidence behind it.' },
  { n: 'Chamomile', a: ['chamomilla recutita', 'matricaria', 'anthemis nobilis', 'chamomile'], t: 'pure', w: 'A soothing plant extract, best avoided with a ragweed allergy.' },
  { n: 'Calendula', a: ['calendula officinalis', 'calendula'], t: 'pure', w: 'A gentle, soothing flower extract.' },
  { n: 'Green Tea', a: ['camellia sinensis', 'green tea'], t: 'pure', w: 'An antioxidant plant extract that helps calm skin.' },
  { n: 'Licorice Root', a: ['glycyrrhiza glabra', 'licorice'], t: 'pure', w: 'A calming extract that helps even out tone.' },
  { n: 'Centella Asiatica', a: ['centella asiatica', 'gotu kola'], t: 'pure', w: 'A soothing herb used to calm and support skin.' },
  { n: 'Honey', a: ['mel', 'honey'], t: 'pure', w: 'A natural humectant, best avoided with a bee product allergy.' },
  { n: 'Rice', a: ['oryza sativa'], t: 'pure', w: 'Rice bran, starch or water, used to soften skin and condition hair.' },

  // Actives from nature or lab
  { n: 'Hyaluronic Acid', a: ['hyaluronic acid', 'sodium hyaluronate'], t: 'fine', w: 'A hydrating molecule your skin makes too, now produced by fermentation.' },
  { n: 'Niacinamide', a: ['niacinamide'], t: 'fine', w: 'Vitamin B3, well studied for tone and the skin barrier.' },
  { n: 'Panthenol', a: ['panthenol'], t: 'fine', w: 'Pro-vitamin B5, which hydrates and soothes.' },
  { n: 'Vitamin E', a: ['tocopherol', 'tocopheryl acetate'], t: 'fine', w: 'An antioxidant that also protects oils from going rancid.' },
  { n: 'Vitamin C', a: ['ascorbic acid', 'ascorbyl glucoside', 'sodium ascorbyl phosphate', 'tetrahexyldecyl ascorbate'], t: 'fine', w: 'A brightening antioxidant, well studied for skin.' },
  { n: 'Ferulic Acid', a: ['ferulic acid'], t: 'fine', w: 'A plant antioxidant often paired with vitamin C.' },
  { n: 'Bisabolol', a: ['bisabolol'], t: 'fine', w: 'The calming part of chamomile, often made synthetically.' },
  { n: 'Allantoin', a: ['allantoin'], t: 'fine', w: 'A soothing ingredient, usually lab-made.' },
  { n: 'Ceramides', a: ['ceramide np', 'ceramide ap', 'ceramide eop', 'ceramide ns', 'ceramide'], t: 'fine', w: 'Skin-identical lipids that support the barrier.' },
  { n: 'Peptides', a: ['palmitoyl tripeptide', 'palmitoyl tetrapeptide', 'acetyl hexapeptide', 'copper tripeptide'], t: 'fine', w: 'Short protein chains used in firming products.' },
  { n: 'Azelaic Acid', a: ['azelaic acid'], t: 'fine', w: 'A gentle acid for redness and breakouts.' },
  { n: 'Lactic Acid', a: ['lactic acid'], t: 'fine', w: 'A mild exfoliating acid that makes skin more sensitive to sun, so pair it with SPF.' },
  { n: 'Glycolic Acid', a: ['glycolic acid'], t: 'caution', w: 'A strong exfoliating acid that raises sun sensitivity and can irritate.' },
  { n: 'Salicylic Acid', a: ['salicylic acid'], t: 'caution', w: 'A useful acid for breakouts that can dry skin. Check with your doctor if you are pregnant.', f: ['pregnancy'] },
  { n: 'Retinol', a: ['retinol', 'retinal', 'retinaldehyde', 'retinyl palmitate', 'retinyl acetate', 'hydroxypinacolone retinoate'], t: 'caution', w: 'A well-proven vitamin A active that can irritate and raises sun sensitivity. It is not advised during pregnancy.', f: ['pregnancy'] },
  { n: 'Bakuchiol', a: ['bakuchiol'], t: 'fine', w: 'A plant-based alternative to retinol with early supportive studies.' },
  { n: 'Benzoyl Peroxide', a: ['benzoyl peroxide'], t: 'caution', w: 'An effective acne treatment that can dry skin and bleach fabric.' },
  { n: 'Hydroquinone', a: ['hydroquinone'], t: 'skip', w: 'A strong skin lightener that is banned in EU cosmetics and no longer sold over the counter in the USA.' },

  // Cleansers
  { n: 'Coco-Glucoside', a: ['coco glucoside'], t: 'fine', w: 'A gentle plant-derived cleanser made from coconut and sugar.' },
  { n: 'Decyl Glucoside', a: ['decyl glucoside'], t: 'fine', w: 'A gentle plant-derived cleanser.' },
  { n: 'Lauryl Glucoside', a: ['lauryl glucoside'], t: 'fine', w: 'A mild plant-derived cleanser.' },
  { n: 'Sodium Cocoyl Isethionate', a: ['sodium cocoyl isethionate'], t: 'fine', w: 'A mild coconut-derived cleanser that leaves skin soft.' },
  { n: 'Sodium Lauroyl Sarcosinate', a: ['sodium lauroyl sarcosinate'], t: 'fine', w: 'A mild foaming cleanser.' },
  { n: 'Disodium Cocoyl Glutamate', a: ['disodium cocoyl glutamate', 'sodium cocoyl glutamate'], t: 'fine', w: 'A mild cleanser made with coconut and amino acids.' },
  { n: 'Cocamidopropyl Betaine', a: ['cocamidopropyl betaine'], t: 'fine', w: 'A coconut-derived foam booster that bothers a small share of people.' },
  { n: 'Sodium Lauryl Sulfate', a: ['sodium lauryl sulfate', 'sodium lauryl sulphate', 'sls'], t: 'skip', w: 'A strong detergent that strips skin and hair and is often used in irritation testing.' },
  { n: 'Sodium Laureth Sulfate', a: ['sodium laureth sulfate', 'sodium laureth sulphate', 'sles'], t: 'skip', w: 'A strong foaming detergent that can carry traces of 1,4-dioxane from how it is made.' },
  { n: 'Ammonium Lauryl Sulfate', a: ['ammonium lauryl sulfate'], t: 'skip', w: 'A strong detergent in the same family as SLS.' },

  // Texture
  { n: 'Cetearyl Alcohol', a: ['cetearyl alcohol'], t: 'fine', w: 'A fatty alcohol that softens and thickens. Despite the name, it does not dry skin.' },
  { n: 'Cetyl Alcohol', a: ['cetyl alcohol'], t: 'fine', w: 'A fatty alcohol that softens and thickens.' },
  { n: 'Stearyl Alcohol', a: ['stearyl alcohol'], t: 'fine', w: 'A fatty alcohol that softens and thickens.' },
  { n: 'Behenyl Alcohol', a: ['behenyl alcohol'], t: 'fine', w: 'A fatty alcohol that softens and thickens.' },
  { n: 'Glyceryl Stearate', a: ['glyceryl stearate'], t: 'fine', w: 'A common emulsifier that holds oil and water together.' },
  { n: 'Glyceryl Caprylate', a: ['glyceryl caprylate'], t: 'fine', w: 'A coconut-derived emulsifier that also helps preserve.' },
  { n: 'Cetearyl Glucoside', a: ['cetearyl glucoside'], t: 'fine', w: 'A plant-derived emulsifier.' },
  { n: 'Stearic Acid', a: ['stearic acid'], t: 'fine', w: 'A fatty acid that thickens and stabilizes.' },
  { n: 'Lecithin', a: ['lecithin'], t: 'fine', w: 'A natural emulsifier from soy or sunflower.' },
  { n: 'Xanthan Gum', a: ['xanthan gum'], t: 'fine', w: 'A fermented thickener used in food too.' },
  { n: 'Guar Gum', a: ['cyamopsis tetragonoloba'], t: 'fine', w: 'A thickener made from guar beans.' },
  { n: 'Carbomer', a: ['carbomer'], t: 'fine', w: 'A synthetic thickener that gives gels their body.' },
  { n: 'Citric Acid', a: ['citric acid'], t: 'fine', w: 'Used in tiny amounts to balance pH.' },
  { n: 'Sodium Hydroxide', a: ['sodium hydroxide'], t: 'fine', w: 'Used in tiny amounts to balance pH, and fully reacted in the final formula.' },
  { n: 'Sodium Chloride', a: ['sodium chloride', 'sea salt'], t: 'pure', w: 'Salt, used to thicken cleansers.' },
  { n: 'Silica', a: ['silica'], t: 'fine', w: 'A mineral powder that absorbs shine and softens feel.' },
  { n: 'Kaolin', a: ['kaolin'], t: 'pure', w: 'A soft mineral clay that absorbs oil.' },
  { n: 'Bentonite', a: ['bentonite'], t: 'pure', w: 'A mineral clay used in masks.' },
  { n: 'Mica', a: ['mica'], t: 'fine', w: 'A shimmering mineral. Look for brands that disclose ethical sourcing.' },
  { n: 'Iron Oxides', a: ['iron oxides', 'iron oxide'], t: 'fine', w: 'Mineral pigments that give makeup its color.' },
  { n: 'Talc', a: ['talc'], t: 'caution', w: 'A mineral powder that must be tested and kept free of asbestos, which is why many brands dropped it.' },

  // Sun filters
  { n: 'Zinc Oxide', a: ['zinc oxide'], t: 'pure', w: 'A mineral UV filter with broad protection, and the gentlest choice for most skin.' },
  { n: 'Titanium Dioxide', a: ['titanium dioxide'], t: 'fine', w: 'A mineral UV filter and white pigment that is best avoided in loose powders and sprays you could inhale.' },
  { n: 'Oxybenzone', a: ['oxybenzone', 'benzophenone 3', 'benzophenone'], t: 'skip', w: 'A chemical UV filter that absorbs into the body and raises questions about hormones. FDA asked for more safety data on it.' },
  { n: 'Octinoxate', a: ['octinoxate', 'ethylhexyl methoxycinnamate'], t: 'caution', w: 'A chemical UV filter that absorbs into the body and is restricted in places that protect coral reefs.' },
  { n: 'Homosalate', a: ['homosalate'], t: 'caution', w: 'A chemical UV filter with a tightened limit in the EU.' },
  { n: 'Octocrylene', a: ['octocrylene'], t: 'caution', w: 'A chemical UV filter that can degrade into benzophenone over time.' },
  { n: 'Avobenzone', a: ['avobenzone', 'butyl methoxydibenzoylmethane'], t: 'caution', w: 'A chemical UVA filter that absorbs into the body and is still under FDA review.' },

  // Preservatives
  { n: 'Sodium Benzoate', a: ['sodium benzoate'], t: 'fine', w: 'A gentle preservative also used in food.' },
  { n: 'Potassium Sorbate', a: ['potassium sorbate'], t: 'fine', w: 'A gentle preservative also used in food.' },
  { n: 'Sodium Levulinate', a: ['sodium levulinate'], t: 'fine', w: 'A plant-derived preservative booster.' },
  { n: 'Sodium Anisate', a: ['sodium anisate'], t: 'fine', w: 'A plant-derived preservative booster.' },
  { n: 'Benzyl Alcohol', a: ['benzyl alcohol'], t: 'fine', w: 'A common preservative used in low amounts that bothers a small share of people.', f: ['fragrance'] },
  { n: 'Dehydroacetic Acid', a: ['dehydroacetic acid'], t: 'fine', w: 'A low-level synthetic preservative.' },
  { n: 'Phenoxyethanol', a: ['phenoxyethanol'], t: 'caution', w: 'A widely used synthetic preservative that is considered safe up to 1 percent in the EU, and it can sting sensitive skin.' },
  { n: 'Ethylhexylglycerin', a: ['ethylhexylglycerin'], t: 'caution', w: 'A preservative booster that occasionally causes skin reactions.' },
  { n: 'Chlorphenesin', a: ['chlorphenesin'], t: 'caution', w: 'A synthetic preservative that some people react to.' },
  { n: 'Methylparaben', a: ['methylparaben', 'ethylparaben'], t: 'caution', w: 'A short-chain paraben. Regulators allow it at low levels, though many people prefer to avoid it.' },
  { n: 'Propylparaben', a: ['propylparaben', 'butylparaben'], t: 'caution', w: 'A longer-chain paraben with stricter EU limits because of hormone questions.' },
  { n: 'Banned Parabens', a: ['isobutylparaben', 'isopropylparaben', 'benzylparaben', 'phenylparaben', 'pentylparaben'], t: 'skip', w: 'This paraben is banned in EU cosmetics.' },
  { n: 'Methylisothiazolinone', a: ['methylisothiazolinone', 'methylchloroisothiazolinone'], t: 'skip', w: 'A strong preservative and a leading cause of contact allergy, so the EU banned it from leave-on products.' },
  { n: 'Formaldehyde Releasers', a: ['dmdm hydantoin', 'quaternium 15', 'imidazolidinyl urea', 'diazolidinyl urea', 'bronopol', '2 bromo 2 nitropropane 1 3 diol', 'sodium hydroxymethylglycinate'], t: 'skip', w: 'This preservative slowly releases small amounts of formaldehyde, a known allergen and carcinogen.' },
  { n: 'Formaldehyde', a: ['formaldehyde', 'methylene glycol', 'formalin'], t: 'skip', w: 'A known carcinogen and allergen.' },
  { n: 'Triclosan', a: ['triclosan', 'triclocarban'], t: 'skip', w: 'An antibacterial that FDA removed from consumer soaps.' },

  // Scent
  { n: 'Fragrance', a: ['fragrance', 'parfum', 'perfume', 'aroma'], t: 'skip', w: 'One word that can hide dozens of undisclosed chemicals, and a leading cause of skin reactions.', f: ['fragrance'] },
  { n: 'Scent Allergen', a: ['limonene', 'linalool', 'citronellol', 'geraniol', 'citral', 'eugenol', 'isoeugenol', 'coumarin', 'farnesol', 'hexyl cinnamal', 'benzyl salicylate', 'benzyl benzoate', 'benzyl cinnamate', 'cinnamal', 'cinnamyl alcohol', 'amyl cinnamal', 'butylphenyl methylpropional'], t: 'caution', w: 'A scent molecule that the EU requires brands to list because it can trigger allergies, whether it comes from a plant or a lab.', f: ['fragrance'] },
  { n: 'Lavender Oil', a: ['lavandula angustifolia oil', 'lavandula angustifolia flower oil', 'lavandula hybrida oil', 'lavender oil', 'lavender flower oil'], t: 'caution', w: 'A natural essential oil, and a common skin sensitizer once it oxidizes.', f: ['fragrance', 'pregnancy'] },
  { n: 'Tea Tree Oil', a: ['melaleuca alternifolia oil', 'melaleuca alternifolia leaf oil', 'tea tree oil', 'tea tree leaf oil'], t: 'caution', w: 'Helpful for spots when diluted, and irritating when it is not.', f: ['fragrance', 'pregnancy'] },
  { n: 'Peppermint Oil', a: ['mentha piperita oil', 'mentha piperita leaf oil', 'peppermint oil', 'peppermint leaf oil'], t: 'caution', w: 'A tingly essential oil that can irritate skin, especially around the eyes and lips.', f: ['fragrance', 'pregnancy'] },
  { n: 'Eucalyptus Oil', a: ['eucalyptus globulus oil', 'eucalyptus globulus leaf oil', 'eucalyptus oil', 'eucalyptus leaf oil'], t: 'caution', w: 'An essential oil that can irritate sensitive skin.', f: ['fragrance', 'pregnancy'] },
  { n: 'Rosemary Oil', a: ['rosmarinus officinalis oil', 'rosmarinus officinalis leaf oil', 'rosemary oil', 'rosemary leaf oil'], t: 'caution', w: 'A scalp favorite that must stay diluted, since essential oils can irritate.', f: ['fragrance', 'pregnancy'] },
  { n: 'Citrus Peel Oil', a: ['bergamot', 'citrus aurantium bergamia', 'lemon peel oil', 'lime oil', 'grapefruit peel oil', 'citrus limon peel oil', 'citrus aurantifolia'], t: 'caution', w: 'A citrus oil that can cause burns or dark patches when skin goes out in the sun.', f: ['fragrance', 'pregnancy'] },
  { n: 'Orange Peel Oil', a: ['citrus aurantium dulcis oil', 'citrus aurantium dulcis peel oil', 'orange peel oil', 'orange oil', 'sweet orange oil'], t: 'caution', w: 'A fragrant citrus oil that can irritate as it ages.', f: ['fragrance', 'pregnancy'] },

  // Petroleum and others
  { n: 'Mineral Oil', a: ['mineral oil', 'paraffinum liquidum'], t: 'caution', w: 'A petroleum-derived oil. Cosmetic grade is highly refined, though it offers no nutrients.' },
  { n: 'Petrolatum', a: ['petrolatum', 'petroleum jelly'], t: 'caution', w: 'A petroleum-derived seal. It works well for protecting skin, and refined grades matter.' },
  { n: 'Paraffin', a: ['paraffin', 'microcrystalline wax', 'ozokerite', 'ceresin'], t: 'caution', w: 'A petroleum-derived wax that adds texture.' },
  { n: 'Drying Alcohol', a: ['alcohol denat', 'denatured alcohol', 'sd alcohol', 'ethanol', 'isopropyl alcohol'], e: ['alcohol'], t: 'caution', w: 'A quick-drying alcohol that can leave skin tight when it sits high on the list.' },
  { n: 'EDTA', a: ['disodium edta', 'tetrasodium edta', 'trisodium edta', 'edta'], t: 'caution', w: 'A synthetic stabilizer that breaks down slowly in the environment.' },
  { n: 'Tetrasodium Glutamate Diacetate', a: ['tetrasodium glutamate diacetate'], t: 'fine', w: 'A biodegradable, plant-derived swap for EDTA.' },
  { n: 'BHT', a: ['bht', 'butylated hydroxytoluene'], t: 'caution', w: 'A synthetic antioxidant preservative with open questions at higher doses.' },
  { n: 'BHA', a: ['bha', 'butylated hydroxyanisole'], t: 'skip', w: 'A synthetic antioxidant that IARC lists as a possible human carcinogen.' },
  { n: 'Triethanolamine', a: ['triethanolamine'], t: 'caution', w: 'A pH adjuster best kept to low amounts in rinse-off products.' },
  { n: 'Toluene', a: ['toluene'], t: 'skip', w: 'A harsh solvent found in nail products that is linked to reproductive harm.' },
  { n: 'Coal Tar', a: ['coal tar'], t: 'skip', w: 'A known carcinogen that the EU bans from cosmetics, apart from some medical uses.' },
  { n: 'Cyclic Silicones', a: ['cyclopentasiloxane', 'cyclotetrasiloxane', 'cyclohexasiloxane', 'cyclomethicone'], t: 'caution', w: 'Silky silicones that linger in the environment, and the EU restricts them.' }
];

/* Patterns catch whole families that can't be listed one by one. They are checked against the cleaned name. */
const PATTERNS = [
  { r: /\b(per|poly)fluoro|\bptfe\b/, n: 'PFAS', t: 'skip', w: 'A "forever chemical" that does not break down in the body or the environment.' },
  { r: /phthalate\b/, n: 'Phthalate', t: 'skip', w: 'A plasticizer linked to hormone disruption.' },
  { r: /\b(peg|ppg) \d+|\b(ceteareth|laureth|steareth|oleth|ceteth) \d+|\bpolysorbate \d+/, n: 'Ethoxylated Ingredient', t: 'caution', w: 'A lab-processed emulsifier. The process can leave traces of 1,4-dioxane unless it is purified well.' },
  { r: /\bci 77\d{3}\b/, n: 'Mineral Pigment', t: 'fine', w: 'A mineral pigment, listed by its color index number.' },
  { r: /\bci \d{5}\b|\b(fd c|d c|fdc)\b/, n: 'Synthetic Dye', t: 'caution', w: 'A synthetic color that does nothing for skin and can irritate.' },
  { r: /\w*(methicone|siloxane)\b/, late: true, n: 'Silicone', t: 'fine', w: 'A synthetic that gives slip and a soft finish. It is gentle, though it does nothing nourishing.' }
];

const PLANT_HINT = /\b(oil|butter|extract|wax|juice|seed|leaf|flower|fruit|root|bark|powder|ferment)\b/;

const GOALS = [
  { id: 'skin',   label: 'Clear Skin',    note: 'Calm, bright and protected' },
  { id: 'hair',   label: 'Strong Hair',   note: 'Scalp care and less breakage' },
  { id: 'energy', label: 'Steady Energy', note: 'Fewer dips through the day' },
  { id: 'sleep',  label: 'Deep Sleep',    note: 'Easier nights, brighter mornings' },
  { id: 'gut',    label: 'Happy Gut',     note: 'Less bloating, more plants' },
  { id: 'body',   label: 'Toned Body',    note: 'Strength and better posture' },
  { id: 'makeup', label: 'Natural Makeup', note: 'Clean swaps for your makeup bag' }
];

const SKIN_TYPES = [
  { id: 'dry',         label: 'Dry' },
  { id: 'oily',        label: 'Oily' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive',   label: 'Sensitive' }
];

const SENSITIVITIES = [
  { id: 'fragrance', label: 'Fragrance Sensitive' },
  { id: 'nut',       label: 'Tree Nut Allergy' },
  { id: 'pregnancy', label: 'Pregnant Or Nursing' }
];

/* Steps with no goals belong to everyone. Order inside a block is priority, and each block shows five at most. */
const STEPS = [
  { id: 'spf', when: 'morning', title: 'Mineral SPF 30', how: 'Finish your morning with a zinc oxide sunscreen on your face and neck.', why: 'Daily sun is the biggest cause of visible skin aging, and no oil or food can do this job for you.' },
  { id: 'light', when: 'morning', title: 'Ten Minutes Of Daylight', how: 'Step outside within an hour of waking, even when it is cloudy.', why: 'Morning light sets your body clock, which shapes your energy and your sleep.' },
  { id: 'rinse', when: 'morning', goals: ['skin'], title: 'Gentle Rinse', how: 'Wash your face with lukewarm water, or a mild cleanser if you woke up oily.', why: 'Overwashing strips the barrier that keeps skin calm.' },
  { id: 'protein', when: 'morning', goals: ['energy', 'hair', 'body'], title: 'Protein At Breakfast', how: 'Eggs, yogurt, beans or a nut butter with oats all count.', why: 'Protein keeps you full and steady, and hair and muscle are built from it.' },

  { id: 'water', when: 'day', title: 'Water With Every Meal', how: 'Have a full glass with breakfast, lunch and dinner.', why: 'An easy habit beats counting glasses all day.' },
  { id: 'walk', when: 'day', goals: ['energy', 'gut'], title: 'Walk After Lunch', how: 'Ten easy minutes straight after you eat.', why: 'A short walk after a meal softens the blood sugar rise and helps digestion.' },
  { id: 'strength', when: 'day', goals: ['body'], title: 'Twenty Minutes Of Strength', how: 'Squats, push-ups, rows and lunges, three days a week.', why: 'Muscle shapes the body and supports your metabolism and your bones.' },
  { id: 'plants', when: 'day', goals: ['gut', 'skin'], title: 'Three Plants At Lunch', how: 'Vegetables, beans, herbs, nuts and seeds all count toward 30 different plants a week.', why: 'People who eat a wider range of plants tend to have a more varied gut microbiome.' },
  { id: 'ferment', when: 'day', goals: ['gut'], title: 'One Fermented Food', how: 'Yogurt, kefir, sauerkraut or kimchi, a small portion is plenty.', why: 'Fermented foods bring live cultures and were linked to a more diverse microbiome in a Stanford trial.' },
  { id: 'coffee', when: 'day', goals: ['sleep'], title: 'Last Coffee By Noon', how: 'Switch to herbal tea for the afternoon.', why: 'Caffeine stays in your system for hours and quietly thins out deep sleep.' },
  { id: 'posture', when: 'day', goals: ['body'], title: 'Posture Reset', how: 'Stand tall, roll your shoulders back and take five slow breaths.', why: 'A gentle reset through the day eases a stiff neck and back.' },

  { id: 'cleanse', when: 'evening', goals: ['skin'], title: 'Evening Cleanse', how: 'Take off sunscreen and the day with a mild cleanser.', why: 'Skin repairs overnight, and clean skin takes care of itself better.' },
  { id: 'oil-dry', when: 'evening', goals: ['skin'], skin: ['dry'], title: 'Three Drops Of Rosehip', how: 'Press into damp skin after cleansing.', why: 'Rosehip oil is rich in fatty acids that help dry skin hold on to moisture.' },
  { id: 'oil-light', when: 'evening', goals: ['skin'], skin: ['oily', 'combination'], title: 'Two Drops Of Jojoba', how: 'Press into damp skin after cleansing, or skip it on oilier days.', why: 'Jojoba is a light liquid wax that sits close to your skin\'s own oils.' },
  { id: 'oat', when: 'evening', goals: ['skin'], skin: ['sensitive'], title: 'Oat Moisturizer', how: 'Use a simple colloidal oat cream on damp skin.', why: 'Colloidal oatmeal has solid evidence for calming dry, itchy skin.' },
  { id: 'scalp', when: 'evening', goals: ['hair'], title: 'Two Minute Scalp Massage', how: 'Use firm, slow circles with your fingertips, no oil needed.', why: 'Small studies suggest that daily massage may support thicker hair over several months.' },
  { id: 'braid', when: 'evening', goals: ['hair'], title: 'Loose Braid For Bed', how: 'Tie hair loosely with a soft scrunchie.', why: 'Less rubbing against your pillow means less breakage.' },
  { id: 'dim', when: 'evening', goals: ['sleep', 'energy'], title: 'Dim The Lights', how: 'Soften the lights an hour before bed.', why: 'Bright evening light delays the melatonin that makes you sleepy.' },
  { id: 'screens', when: 'evening', title: 'Screens Off Before Bed', how: 'Put your phone away 30 minutes before you sleep.', why: 'A calm last half hour makes falling asleep much easier.' },
  { id: 'bedtime', when: 'evening', goals: ['sleep'], title: 'Same Bedtime', how: 'Go to bed within the same half hour each night, weekends too.', why: 'A steady rhythm improves sleep more than any supplement.' }
];

const EVIDENCE = {
  strong: 'Well Studied',
  some: 'Some Studies',
  folk: 'Traditional Use'
};

const PANTRY = [
  { group: 'face', name: 'Zinc Oxide Sunscreen', for: 'Sun Protection', use: 'Apply generously every morning as your last step, and reapply outdoors.', watch: 'Homemade sunscreen cannot be tested, so always buy this one.', ev: 'strong', goals: ['skin'] },
  { group: 'face', name: 'Colloidal Oatmeal', for: 'Itchy Or Irritated Skin', use: 'Use it in a cream, or add finely ground oats to a lukewarm bath.', watch: 'Stop using it if you react to oats.', ev: 'strong', goals: ['skin'] },
  { group: 'face', name: 'Rosehip Seed Oil', for: 'Dry, Dull Skin', use: 'Press three drops into damp skin at night.', watch: 'It spoils quickly, so buy a small dark bottle and keep it cool.', ev: 'some', goals: ['skin'] },
  { group: 'face', name: 'Jojoba Oil', for: 'Balance And Light Moisture', use: 'Press two drops into damp skin, or use it to melt off makeup.', watch: 'Patch test first, as with any oil.', ev: 'some', goals: ['skin'] },
  { group: 'face', name: 'Green Tea Toner', for: 'Redness And Oil', use: 'Look for it in a toner, or pat cooled brewed tea on skin and rinse.', watch: 'Brewed tea only lasts a day or two in the fridge.', ev: 'some', goals: ['skin'] },
  { group: 'face', name: 'Raw Honey Mask', for: 'Softness And Glow', use: 'Spread a thin layer on damp skin for ten minutes and rinse.', watch: 'Leave this out with a pollen or bee product allergy.', ev: 'some', goals: ['skin'] },
  { group: 'face', name: 'Gua Sha', for: 'A Morning De-Puff', use: 'Glide gently upward and outward over oiled skin for two minutes.', watch: 'The effect is temporary and it does not reshape the face. Keep the pressure light.', ev: 'folk', goals: ['skin'] },

  { group: 'hair', name: 'Coconut Oil Pre-Wash', for: 'Less Protein Loss', use: 'Work through mid-lengths and ends 30 minutes before you shampoo.', watch: 'Fine hair can feel weighed down, and it can trigger forehead breakouts.', ev: 'some', goals: ['hair'] },
  { group: 'hair', name: 'Flaxseed Gel', for: 'Soft Curl Hold', use: 'Simmer flaxseed in water, strain while warm and use on damp curls.', watch: 'It has no preservative, so keep it in the fridge and use it within a week.', ev: 'folk', goals: ['hair'] },
  { group: 'hair', name: 'Diluted Rosemary Oil', for: 'Scalp Care', use: 'Mix a few drops into a tablespoon of jojoba and massage in before washing.', watch: 'Never apply it neat. One small trial looked promising, and larger studies are still needed.', ev: 'some', goals: ['hair'] },
  { group: 'hair', name: 'Rice Water Rinse', for: 'Slip And Shine', use: 'Soak rice in water for 30 minutes, then use it as a final rinse.', watch: 'Rinse it out well, since leftover starch can build up on the scalp.', ev: 'folk', goals: ['hair'] },
  { group: 'hair', name: 'Castor Oil', for: 'Shine On Ends', use: 'Smooth a small amount over dry ends.', watch: 'There is no good proof that it grows hair or lashes, so enjoy it just for shine.', ev: 'folk', goals: ['hair'] },

  { group: 'body', name: 'Shea Butter', for: 'Very Dry Skin', use: 'Warm between your palms and press into damp skin after a shower.', watch: 'It is heavy, so keep it for the body and not for breakout-prone areas.', ev: 'some', goals: ['skin'] },
  { group: 'body', name: 'Oat Bath', for: 'Calming Itchy Skin', use: 'Stir a cup of finely ground oats into a lukewarm bath for 15 minutes.', watch: 'Rinse afterward and be careful, since the tub gets slippery.', ev: 'strong', goals: ['skin'] },
  { group: 'body', name: 'Magnesium Bath Salts', for: 'A Slow Evening', use: 'Add two cups of Epsom salts to a warm bath before bed.', watch: 'Enjoy it for the warmth and the calm, since proof of magnesium entering through skin is weak.', ev: 'folk', goals: ['sleep'] },

  { group: 'food', name: 'Kiwi', for: 'Falling Asleep', use: 'Eat two an hour before bed.', watch: 'The study behind this was small, and it makes a lovely snack either way.', ev: 'some', goals: ['sleep'] },
  { group: 'food', name: 'Oats', for: 'Steady Energy', use: 'Have them cooked with nuts or seeds for a slower, fuller breakfast.', watch: 'Choose certified gluten-free oats if you have celiac disease.', ev: 'strong', goals: ['energy', 'gut'] },
  { group: 'food', name: 'Pumpkin Seeds', for: 'Zinc And Magnesium', use: 'A small handful on yogurt, salads or soup.', watch: 'Keep it to a handful, since they are rich.', ev: 'some', goals: ['skin', 'hair'] },
  { group: 'food', name: 'Kefir', for: 'A Varied Gut', use: 'Start with a small glass a day and build up.', watch: 'It can bloat at first, so go slowly.', ev: 'some', goals: ['gut'] },
  { group: 'food', name: 'Cooked Tomatoes', for: 'Skin From The Inside', use: 'Cook them with a little olive oil, which helps you absorb the lycopene.', watch: 'This is a gentle extra, and it never replaces sunscreen.', ev: 'some', goals: ['skin'] },
  { group: 'food', name: 'Brazil Nuts', for: 'Selenium', use: 'One or two a day is all you need.', watch: 'More is worse here, since too much selenium can cause hair loss.', ev: 'some', goals: ['hair'] },
  { group: 'food', name: 'Chamomile Tea', for: 'Winding Down', use: 'Brew a cup after dinner in place of a late coffee.', watch: 'Leave this out with a ragweed allergy, and check with a doctor if you take blood thinners.', ev: 'folk', goals: ['sleep'] },
  { group: 'food', name: 'Spearmint Tea', for: 'Hormonal Skin', use: 'Two cups a day was the amount used in small studies.', watch: 'The studies are small, so speak to your doctor if you take hormone treatments.', ev: 'some', goals: ['skin'] }
];

const SAMPLE_LIST = 'Water, Aloe Barbadensis Leaf Juice, Glycerin, Cetearyl Alcohol, Simmondsia Chinensis (Jojoba) Seed Oil, Butyrospermum Parkii (Shea) Butter, Niacinamide, Dimethicone, PEG-100 Stearate, Tocopherol, Phenoxyethanol, Ethylhexylglycerin, Fragrance (Parfum), Limonene, Linalool, Methylparaben, Disodium EDTA, Sodium Hydroxide';
