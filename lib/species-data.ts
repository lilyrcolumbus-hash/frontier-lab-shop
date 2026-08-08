import type { Species } from '@/types/species'

export interface SpeciesBenefit {
  icon: 'brain' | 'shield' | 'heart' | 'leaf' | 'activity' | 'zap' | 'sun' | 'droplet'
  label: string
  detail: string
}

export interface SpeciesData extends Species {
  keyBenefits: SpeciesBenefit[]
  openartPrompt?: string
}

const SPECIES_LIST_BASE: SpeciesData[] = [
  {
    id: '1',
    slug: 'blue-oyster',
    commonName: 'Blue Oyster',
    scientificName: 'Pleurotus ostreatus',
    family: 'Pleurotaceae',
    order: 'Agaricales',
    type: 'edible',
    difficulty: 'beginner',
    substrate: ['Hardwood sawdust', 'Straw', 'Coffee grounds'],
    colonizationWeeks: { min: 2, max: 3 },
    fruitingTempF: { min: 55, max: 65 },
    fruitingTempC: { min: 13, max: 18 },
    expectedFlushes: 3,
    biologicalEfficiency: '25%',
    betaGlucanContent: 'High (25–30% dry weight)',
    indoorOutdoor: 'both',
    description: {
      en: 'The Blue Oyster is the most forgiving species for beginners. Native to temperate forests worldwide, Pleurotus ostreatus forms beautiful fan-shaped clusters with a blue-grey to cream coloring that deepens in cooler temperatures. It has a mild, slightly sweet flavor with a firm, meaty texture that works across many cooking styles — from stir-fries to pasta.',
      es: 'La Ostra Azul es la especie más indulgente para principiantes. Nativa de bosques templados de todo el mundo, Pleurotus ostreatus forma hermosos racimos en forma de abanico con una coloración azul-gris a crema que se intensifica con temperaturas más frías. Tiene un sabor suave y ligeramente dulce con una textura firme y carnosa.',
    },
    cultivationNotes: {
      en: 'Blue Oysters thrive in a wide range of conditions. Pack substrate into buckets or bags, inoculate with grain spawn, and wait 2–3 weeks for full colonization. Induce fruiting by introducing fresh air exchange and maintaining 85–95% humidity. Expect 3–4 flushes over 6–8 weeks. Tolerates beginner mistakes better than any other species.',
      es: 'Las Ostras Azules prosperan en una amplia gama de condiciones. Empaca el sustrato en cubetas o bolsas, inocula con spawn de grano y espera 2-3 semanas para la colonización completa. Induce la fructificación con intercambio de aire fresco y 85-95% de humedad. Espera 3-4 flushes en 6-8 semanas.',
    },
    medicalNotes: {
      en: 'Rich in beta-glucans (25–30% dry weight), ergothioneine, and natural lovastatin. Clinical studies suggest cholesterol-lowering effects comparable to pharmaceutical statins, immune modulation via macrophage activation, and anti-inflammatory properties. Contains 30% protein by dry weight with all essential amino acids.',
      es: 'Rico en beta-glucanos (25-30% peso seco), ergotionina y lovastatina natural. Estudios clínicos sugieren efectos reductores del colesterol comparables a estatinas farmacéuticas, modulación inmune via activación de macrófagos y propiedades antiinflamatorias. Contiene 30% proteína en peso seco con todos los aminoácidos esenciales.',
    },
    cookingNotes: {
      en: 'Excellent sautéed in butter with garlic, roasted at high heat, or used as a seafood substitute in tacos and stir-fries. The firm texture holds up well to heat. Pairs beautifully with thyme, white wine, cream, and soy sauce.',
      es: 'Excelente salteado en mantequilla con ajo, asado a temperatura alta, o usado como sustituto de mariscos en tacos y salteados. La textura firme aguanta bien el calor. Combina perfectamente con tomillo, vino blanco, crema y salsa de soya.',
    },
    lookalikes: [],
    imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=1200&h=600&q=85&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=600&h=400&q=85&auto=format&fit=crop',
    keyBenefits: [
      { icon: 'shield', label: 'Immune Support', detail: 'Beta-glucans (25–30% dry weight) activate macrophages and natural killer cells in the immune system' },
      { icon: 'heart', label: 'Cholesterol Balance', detail: 'Natural lovastatin reduces LDL cholesterol — a plant-derived statin equivalent without pharmaceuticals' },
      { icon: 'leaf', label: 'Anti-inflammatory', detail: 'Ergothioneine neutralizes free radicals and reduces chronic inflammation at the cellular level' },
      { icon: 'zap', label: 'Complete Protein', detail: '30% protein by dry weight with all essential amino acids — exceptional nutritional density for a mushroom' },
    ],
  },
  {
    id: '2',
    slug: 'lions-mane',
    commonName: "Lion's Mane",
    scientificName: 'Hericium erinaceus',
    family: 'Hericiaceae',
    order: 'Russulales',
    type: 'medicinal',
    difficulty: 'intermediate',
    substrate: ['Hardwood sawdust'],
    colonizationWeeks: { min: 3, max: 4 },
    fruitingTempF: { min: 65, max: 75 },
    fruitingTempC: { min: 18, max: 24 },
    expectedFlushes: 2,
    biologicalEfficiency: '15–20%',
    betaGlucanContent: 'Very High',
    indoorOutdoor: 'indoor',
    description: {
      en: "Lion's Mane is one of the most visually striking and scientifically fascinating mushrooms in existence. Its cascading white spines resemble a lion's mane, giving it an otherworldly appearance. Revered in Traditional Chinese Medicine for centuries, modern science has confirmed powerful neuroprotective and cognitive-enhancing properties through unique compounds found nowhere else in nature.",
      es: "La Melena de León es uno de los hongos más visualmente impactantes y científicamente fascinantes. Sus espinas blancas en cascada se asemejan a la melena de un león. Venerada en la medicina tradicional china durante siglos, la ciencia moderna ha confirmado poderosas propiedades neuroprotectoras y cognitivas a través de compuestos únicos que no existen en ningún otro lugar de la naturaleza.",
    },
    cultivationNotes: {
      en: "Lion's Mane requires high humidity (90–95%) and excellent fresh air exchange. It is sensitive to CO2 buildup — excess CO2 causes elongated, icicle-like growths instead of the classic pom-pom shape. Use enriched hardwood sawdust blocks and maintain 65–75°F during fruiting. Pin sites develop within 1–2 weeks of fruiting conditions.",
      es: "La Melena de León requiere alta humedad (90-95%) y excelente intercambio de aire fresco. Es sensible a la acumulación de CO2, que la hace formar crecimientos alargados en lugar de la forma clásica de pompón. Usa bloques de serrín de madera dura enriquecido y mantén 18-24°C durante la fructificación.",
    },
    medicalNotes: {
      en: "Contains hericenones and erinacines — two unique compounds that stimulate Nerve Growth Factor (NGF) synthesis. Randomized clinical trials show improvement in mild cognitive impairment, anxiety, depression, and neuropathic pain. Currently being researched for Alzheimer's and Parkinson's prevention. Also promotes myelin sheath repair.",
      es: "Contiene hericenones y erinacinas — dos compuestos únicos que estimulan la síntesis del Factor de Crecimiento Nervioso (NGF). Ensayos clínicos aleatorizados muestran mejoras en deterioro cognitivo leve, ansiedad, depresión y dolor neuropático. Se investiga actualmente para la prevención del Alzheimer y Parkinson.",
    },
    cookingNotes: {
      en: "Has a remarkable seafood-like texture and flavor — often compared to crab or lobster. Best sliced thick and seared in a very hot pan with butter to extract moisture and develop a golden crust. Superb in pasta, risotto, or simply on toast with good olive oil. Also widely consumed as a powder or capsule for cognitive benefits.",
      es: "Tiene una textura y sabor notablemente parecidos a los mariscos, frecuentemente comparado con cangrejo o langosta. Mejor cortado grueso y sellado en sartén muy caliente con mantequilla para extraer humedad y desarrollar una costra dorada. Excelente en pasta, risotto, o simplemente sobre tostadas con aceite de oliva.",
    },
    lookalikes: ['Hericium coralloides', 'Hericium americanum'],
    imageUrl: '',
    thumbnailUrl: '',
    openartPrompt:
      "Macro nature photography, Lion's Mane mushroom (Hericium erinaceus) showing cascading white icicle-like spines in a dense pom-pom formation, growing on a dark hardwood log in a temperate forest. Soft diffused natural light, pure white cascading spines with subtle ivory and cream tones, shallow depth of field, dark moody forest background softly blurred. Extreme surface detail on each individual spine. Professional mycology photography, photorealistic, 8K",
    keyBenefits: [
      { icon: 'brain', label: 'Cognitive Enhancement', detail: 'Hericenones and erinacines stimulate Nerve Growth Factor (NGF) synthesis — the only mushroom with this property' },
      { icon: 'activity', label: 'Neuroprotection', detail: 'Clinically studied for mild cognitive impairment, Alzheimer prevention, and neuropathic pain management' },
      { icon: 'sun', label: 'Mood & Anxiety', detail: 'Randomized trials show significant reduction in anxiety and depression symptom scores after 4 weeks of use' },
      { icon: 'zap', label: 'Nerve Regeneration', detail: 'Promotes myelin sheath repair and peripheral nerve regrowth — studied for nerve injury recovery' },
    ],
  },
  {
    id: '3',
    slug: 'shiitake',
    commonName: 'Shiitake',
    scientificName: 'Lentinula edodes',
    family: 'Marasmiaceae',
    order: 'Agaricales',
    type: 'edible',
    difficulty: 'intermediate',
    substrate: ['Hardwood sawdust', 'Oak logs'],
    colonizationWeeks: { min: 8, max: 52 },
    fruitingTempF: { min: 55, max: 75 },
    fruitingTempC: { min: 13, max: 24 },
    expectedFlushes: 10,
    biologicalEfficiency: '40–80% on logs (multi-year)',
    betaGlucanContent: 'High (lentinan)',
    indoorOutdoor: 'both',
    description: {
      en: "Shiitake is the world's second most cultivated mushroom and a cornerstone of East Asian cuisine for over 1,000 years. Native to the mountains of China, Japan, and Korea, it grows naturally on decaying broadleaf trees. Its rich, smoky, umami flavor profile is unmatched in the culinary world. Dried shiitake develops an even deeper, more concentrated flavor than fresh.",
      es: 'El Shiitake es el segundo hongo más cultivado del mundo y pilar de la cocina del este asiático durante más de 1,000 años. Nativo de las montañas de China, Japón y Corea, crece en árboles de hoja caduca en descomposición. Su rico perfil de sabor umami ahumado no tiene igual. El Shiitake seco desarrolla un sabor aún más profundo y concentrado que el fresco.',
    },
    cultivationNotes: {
      en: "On logs: inoculate oak in spring, allow 6–12 months for full colonization, then 'shock' with cold water (50°F soak for 24h) to trigger fruiting. On supplemented sawdust blocks: 8–12 weeks colonization. Both methods produce multiple flushes over years. Log cultivation yields shiitake with superior flavor and texture.",
      es: 'En troncos: inocula roble en primavera, permite 6-12 meses de colonización, luego da un "shock" con agua fría (remojo a 10°C por 24h) para desencadenar la fructificación. En bloques de aserrín suplementado: 8-12 semanas de colonización. Ambos métodos producen múltiples flushes durante años.',
    },
    medicalNotes: {
      en: 'Contains lentinan (beta-1,3-glucan with FDA Orphan Drug status for cancer immunotherapy), eritadenine (significantly reduces cholesterol), and AHCC (Active Hexose Correlated Compound, used in Japanese hospitals alongside chemotherapy). Also contains antiviral compounds active against HIV, hepatitis B, and influenza.',
      es: 'Contiene lentinan (beta-1,3-glucano con estatus de Medicamento Huérfano FDA para inmunoterapia contra el cáncer), eritadenina (reduce significativamente el colesterol) y AHCC, usado en hospitales japoneses junto a la quimioterapia. También contiene compuestos antivirales activos contra VIH, hepatitis B e influenza.',
    },
    cookingNotes: {
      en: 'The workhorse of umami cooking. Always remove the tough stems (save them for stock). Dried shiitake is even more intense than fresh — rehydrate in warm water and use the soaking liquid as a stock base. Sauté in sesame oil, use in ramen broth, stir-fries, duxelles, or risotto.',
      es: 'El caballo de batalla de la cocina umami. Siempre retira los tallos duros (guárdalos para caldo). El Shiitake seco es aún más intenso que el fresco — rehidrata en agua tibia y usa el líquido de remojo como base de caldo. Saltea en aceite de sésamo, úsalo en ramen, salteados, duxelles o risotto.',
    },
    lookalikes: [],
    imageUrl: '',
    thumbnailUrl: '',
    openartPrompt:
      'Macro nature photography, fresh Shiitake mushrooms (Lentinula edodes) growing in a dense cluster on an aged oak log, showing rich tan to dark chocolate brown caps with pale veil remnants on the edges, white gills visible underneath open caps. Warm directional natural light with soft shadows, extreme surface detail showing the characteristic cracked tan cap surface texture. Mossy oak log environment, shallow depth of field with softly blurred green background. Professional mycology photography, photorealistic, 8K',
    keyBenefits: [
      { icon: 'shield', label: 'Immune Activation', detail: 'Lentinan (beta-1,3-glucan) holds FDA Orphan Drug status — used as cancer immunotherapy adjunct in Japan' },
      { icon: 'heart', label: 'Cardiovascular Health', detail: 'Eritadenine significantly lowers LDL cholesterol and reduces blood pressure through a unique mechanism' },
      { icon: 'activity', label: 'Cancer Adjunct', detail: 'AHCC compound used in Japanese hospitals alongside chemotherapy — published meta-analyses show benefit' },
      { icon: 'leaf', label: 'Antiviral', detail: 'Demonstrated clinical activity against HIV, hepatitis B, and influenza in controlled laboratory studies' },
    ],
  },
  {
    id: '4',
    slug: 'reishi',
    commonName: 'Reishi',
    scientificName: 'Ganoderma lucidum',
    family: 'Ganodermataceae',
    order: 'Polyporales',
    type: 'medicinal',
    difficulty: 'advanced',
    substrate: ['Hardwood logs', 'Hardwood stumps'],
    colonizationWeeks: { min: 12, max: 16 },
    fruitingTempF: { min: 70, max: 80 },
    fruitingTempC: { min: 21, max: 27 },
    expectedFlushes: 1,
    biologicalEfficiency: '5–15%',
    betaGlucanContent: 'Extremely High (triterpenoids + beta-glucans)',
    indoorOutdoor: 'both',
    description: {
      en: 'Reishi — the "Mushroom of Immortality" — has been revered in Chinese medicine for over 2,000 years. Its lacquered, woody fruiting body is unmistakable: kidney-shaped with a shiny red-orange surface. Not consumed as food due to extreme bitterness from triterpenoids, but as a tincture or powder it is the most clinically researched medicinal fungus on Earth, with over 400 identified bioactive compounds.',
      es: 'El Reishi — el "Hongo de la Inmortalidad" — ha sido venerado en la medicina china durante más de 2,000 años. Su cuerpo fructificante lacado y leñoso es inconfundible: con forma de riñón y superficie brillante rojo-naranja. No se consume como alimento por su extrema amargura, pero como tintura o polvo es el hongo medicinal más investigado clínicamente del mundo, con más de 400 compuestos bioactivos identificados.',
    },
    cultivationNotes: {
      en: 'Reishi is the most demanding cultivated species. Requires long colonization at warm temperatures (75–80°F), high CO2 during colonization to drive mycelium growth, then fresh air during fruiting. The antler form grows under high CO2; the classic kidney-cap form requires good FAE. Frequently grown in bags or on logs. Patience is the primary skill required.',
      es: 'El Reishi es la especie cultivada más exigente. Requiere larga colonización a temperaturas cálidas (24-27°C), alto CO2 durante la colonización para impulsar el crecimiento del micelio, luego aire fresco durante la fructificación. La forma de asta crece con alto CO2; la forma clásica de sombrero requiere buen intercambio de aire. La paciencia es la habilidad principal requerida.',
    },
    medicalNotes: {
      en: 'Contains over 400 bioactive compounds including ganoderic acids (triterpenoids), beta-glucan polysaccharides, and immunomodulating proteins. Clinical evidence supports: immune enhancement, anti-tumor activity, adaptogen effects on cortisol and HPA axis, blood pressure reduction, liver protection (hepatoprotective), and anti-anxiety effects. The most globally researched medicinal mushroom.',
      es: 'Contiene más de 400 compuestos bioactivos incluyendo ácidos ganodéricos (triterpenoides), polisacáridos beta-glucanos y proteínas inmunomoduladoras. La evidencia clínica respalda: mejora inmune, actividad antitumoral, efectos adaptógenos sobre el cortisol y el eje HPA, reducción de presión arterial, protección hepática y efectos ansiolíticos. El hongo medicinal más investigado mundialmente.',
    },
    cookingNotes: {
      en: 'Not consumed as food — the fruiting body is extremely bitter and has a tough, woody texture. Best prepared as a dual-extract tincture (hot water + alcohol extraction) to capture both beta-glucans and triterpenoids. Also available as a powder for coffee, tea, or smoothies. Start with small doses and increase gradually.',
      es: 'No se consume como alimento — el cuerpo fructificante es extremadamente amargo y tiene una textura dura y leñosa. Se prepara mejor como tintura de doble extracción (agua caliente + extracción con alcohol) para capturar tanto beta-glucanos como triterpenoides. También disponible en polvo para café, té o batidos. Comenzar con dosis pequeñas e ir aumentando gradualmente.',
    },
    lookalikes: ['Ganoderma applanatum', 'Ganoderma tsugae'],
    imageUrl: '',
    thumbnailUrl: '',
    openartPrompt:
      'Macro nature photography, Reishi mushroom (Ganoderma lucidum) showing the distinctive kidney-shaped fruiting body with a brilliant lacquered red-orange and dark mahogany surface, thin white actively-growing edge, growing at the base of an oak stump in a temperate forest. Dramatic directional natural light highlighting the glossy lacquered sheen on the cap surface. Extreme surface detail, shallow depth of field with dark forest floor softly blurred in background. Professional mycology photography, photorealistic, 8K',
    keyBenefits: [
      { icon: 'shield', label: 'Immune Modulation', detail: '400+ bioactive compounds including ganoderic acids and immunomodulating polysaccharides — uniquely comprehensive' },
      { icon: 'leaf', label: 'Adaptogen', detail: 'Reduces cortisol, regulates the HPA axis, and builds long-term stress resilience with consistent use' },
      { icon: 'activity', label: 'Anti-Tumor Activity', detail: 'Triterpenoids and polysaccharides inhibit tumor cell proliferation and enhance NK cell activity in multiple studies' },
      { icon: 'heart', label: 'Liver & Longevity', detail: 'Hepatoprotective properties, clinically shown to lower blood pressure and improve sleep quality and duration' },
    ],
  },
  {
    id: '5',
    slug: 'pink-oyster',
    commonName: 'Pink Oyster',
    scientificName: 'Pleurotus djamor',
    family: 'Pleurotaceae',
    order: 'Agaricales',
    type: 'edible',
    difficulty: 'beginner',
    substrate: ['Straw', 'Hardwood sawdust', 'Sugarcane bagasse'],
    colonizationWeeks: { min: 1, max: 2 },
    fruitingTempF: { min: 64, max: 86 },
    fruitingTempC: { min: 18, max: 30 },
    expectedFlushes: 3,
    biologicalEfficiency: '25%',
    betaGlucanContent: 'High',
    indoorOutdoor: 'indoor',
    description: {
      en: 'The Pink Oyster is the showstopper of the mushroom world. Vibrant magenta-pink clusters burst from substrate in dramatic fashion, fruiting fast and abundantly. Native to tropical and subtropical regions, Pleurotus djamor is among the most visually striking edible mushrooms on Earth — and one of the easiest to grow. The intense pink color fades when cooked, but the flavor and nutrition remain.',
      es: 'La Ostra Rosa es el espectáculo del mundo de los hongos. Vibrantes racimos magenta-rosados brotan del sustrato dramáticamente, fructificando rápido y abundantemente. Nativa de regiones tropicales y subtropicales, Pleurotus djamor es uno de los hongos comestibles más llamativos del mundo — y uno de los más fáciles de cultivar. El color rosa intenso desaparece al cocinar, pero el sabor y la nutrición permanecen.',
    },
    cultivationNotes: {
      en: 'The Pink Oyster loves warmth (75–85°F) and is one of the fastest colonizers in existence. Expects pins within days of fruiting conditions. High humidity tent recommended at 85–90%. Extremely fast — from inoculation to harvest in as little as 3–4 weeks total. Thrives in subtropical home environments without climate control.',
      es: 'La Ostra Rosa ama el calor (24-29°C) y es uno de los colonizadores más rápidos que existen. Espera pines en días desde las condiciones de fructificación. Se recomienda tienda de humedad al 85-90%. Extremadamente rápida — de inoculación a cosecha en tan solo 3-4 semanas. Prospera en ambientes hogareños subtropicales sin control climático.',
    },
    medicalNotes: {
      en: 'High in antioxidants (phenolic compounds), beta-glucan polysaccharides, and natural lovastatin. Anti-inflammatory and immune-boosting properties. Rich in ergothioneine — a potent antioxidant that accumulates in mitochondria and protects against oxidative damage. Contains all essential amino acids with a favorable protein-to-calorie ratio.',
      es: 'Alta en antioxidantes (compuestos fenólicos), polisacáridos beta-glucanos y lovastatina natural. Propiedades antiinflamatorias e inmunoestimulantes. Rica en ergotionina — un potente antioxidante que se acumula en las mitocondrias y protege contra el daño oxidativo. Contiene todos los aminoácidos esenciales con una excelente relación proteína-caloría.',
    },
    cookingNotes: {
      en: "Delicate flavor with a slight sweetness. Cook quickly — the dramatic pink color fades with sustained heat. Best lightly sautéed in butter or coconut oil for 2–3 minutes maximum. Excellent as a garnish on tacos, ramen, or salads where the visual impact matters. Don't overcrowd the pan or it will steam instead of sear.",
      es: 'Sabor delicado con ligera dulzura. Cocinar rápido — el dramático color rosa desaparece con el calor sostenido. Mejor salteado ligeramente en mantequilla o aceite de coco por 2-3 minutos máximo. Excelente como guarnición en tacos, ramen o ensaladas donde el impacto visual importa. No amontonar en la sartén o se cocerá al vapor en lugar de sellar.',
    },
    lookalikes: [],
    imageUrl: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=1200&h=600&q=85&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1773600149997-2b6af77031d7?w=600&h=400&q=85&auto=format&fit=crop',
    keyBenefits: [
      { icon: 'sun', label: 'Antioxidant Power', detail: 'High phenolic content and ergothioneine neutralize oxidative stress at the cellular and mitochondrial level' },
      { icon: 'heart', label: 'Cholesterol Control', detail: 'Natural lovastatin reduces LDL cholesterol without synthetic pharmaceutical statins' },
      { icon: 'shield', label: 'Immune Boost', detail: 'Beta-glucan polysaccharides support both innate and adaptive immune responses — stimulates macrophage activity' },
      { icon: 'zap', label: 'Fast Nutrition', detail: 'Among the fastest-growing edible mushrooms — nutrient-dense with all essential amino acids and high bioavailability' },
    ],
  },
  {
    id: '6',
    slug: 'yellow-oyster',
    commonName: 'Golden Oyster',
    scientificName: 'Pleurotus citrinopileatus',
    family: 'Pleurotaceae',
    order: 'Agaricales',
    type: 'edible',
    difficulty: 'beginner',
    substrate: ['Hardwood sawdust', 'Straw', 'Coffee grounds'],
    colonizationWeeks: { min: 1, max: 2 },
    fruitingTempF: { min: 64, max: 77 },
    fruitingTempC: { min: 18, max: 25 },
    expectedFlushes: 3,
    biologicalEfficiency: '20%',
    betaGlucanContent: 'High',
    indoorOutdoor: 'indoor',
    description: {
      en: 'Golden clusters that glow like sunlight. The Golden Oyster — native to the birch forests of Eastern Russia and Northern China — is a beginner favorite with a premium aesthetic. Pleurotus citrinopileatus fruits in delicate, ruffled clusters with a bright golden-yellow color that makes it one of the most photogenic edible mushrooms. Fast, beautiful, and packed with longevity-supporting antioxidants.',
      es: 'Racimos dorados que brillan como la luz del sol. La Ostra Amarilla — nativa de los bosques de abedul del este de Rusia y norte de China — es favorita de principiantes con estética premium. Pleurotus citrinopileatus fructifica en delicados racimos ondulados con un brillante color amarillo-dorado que lo convierte en uno de los hongos comestibles más fotogénicos. Rápida, hermosa y llena de antioxidantes que apoyan la longevidad.',
    },
    cultivationNotes: {
      en: 'Fast colonizer with a preference for slightly cooler temperatures than Pink Oyster. Needs strong fresh air exchange — without good FAE, stems elongate and caps shrink. Fruits best at 64–77°F with 85–90% humidity. Very visual when fruiting — clusters appear almost overnight. 3 flushes expected over 6–8 weeks.',
      es: 'Colonizador rápido con preferencia por temperaturas ligeramente más frescas que la Ostra Rosa. Necesita buen intercambio de aire fresco — sin FAE adecuado, los tallos se alargan y los sombreros se encogen. Fructifica mejor a 18-25°C con 85-90% de humedad. Muy visual al fructificar — los racimos aparecen casi de la noche a la mañana.',
    },
    medicalNotes: {
      en: "Rich in mevinolin (a natural lovastatin analog), beta-glucans, and extraordinarily high levels of ergothioneine — one of the most powerful natural antioxidants known, synthesized only by fungi and certain bacteria. Ergothioneine concentrates in mitochondria and protects against oxidative damage linked to aging and neurodegeneration. Supports immune function and cholesterol balance.",
      es: 'Rica en mevinolina (un análogo natural de la lovastatina), beta-glucanos y niveles extraordinariamente altos de ergotionina — uno de los antioxidantes naturales más potentes conocidos, sintetizado solo por hongos y ciertas bacterias. La ergotionina se concentra en las mitocondrias y protege contra el daño oxidativo relacionado con el envejecimiento y la neurodegeneración.',
    },
    cookingNotes: {
      en: "Mild, slightly nutty flavor with a tender texture. The delicate caps require quick cooking — sauté in butter over medium-high heat for 3–4 minutes. Excellent for ramen, stir-fries, and garnishes where visual impact matters. The golden color partially survives light cooking. Don't overcook — they become rubbery quickly.",
      es: 'Sabor suave y ligeramente con sabor a nuez, con textura tierna. Los delicados sombreros requieren cocción rápida — saltear en mantequilla a fuego medio-alto por 3-4 minutos. Excelente para ramen, salteados y guarniciones donde el impacto visual importa. El color dorado sobrevive parcialmente la cocción ligera. No sobrecocinar — se vuelven gomosos rápidamente.',
    },
    lookalikes: [],
    imageUrl: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=1200&h=600&q=85&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1748118869505-e75f25812a70?w=600&h=400&q=85&auto=format&fit=crop',
    keyBenefits: [
      { icon: 'sun', label: 'Longevity Antioxidant', detail: 'Ergothioneine — synthesized only by fungi — concentrates in mitochondria and protects against age-related oxidative damage' },
      { icon: 'heart', label: 'Cholesterol Control', detail: 'Mevinolin (natural lovastatin analog) reduces LDL cholesterol through the same mechanism as pharmaceutical statins' },
      { icon: 'shield', label: 'Immune Support', detail: 'Beta-glucan polysaccharides train and activate the innate immune system for improved pathogen response' },
      { icon: 'leaf', label: 'B-Vitamin Complex', detail: 'Rich in B1, B2, B3, and B5 — supports energy metabolism, nervous system function, and cellular health' },
    ],
  },
]


export const CORDYCEPS_SPECIES: SpeciesData = {
  id: '7',
  slug: 'cordyceps',
  commonName: 'Cordyceps',
  scientificName: 'Cordyceps militaris',
  family: 'Cordycipitaceae',
  order: 'Hypocreales',
  type: 'medicinal',
  difficulty: 'advanced',
  substrate: ['Cooked grain (wheat berries, brown rice)', 'Insect pupae (wild)'],
  colonizationWeeks: { min: 2, max: 3 },
  fruitingTempF: { min: 60, max: 75 },
  fruitingTempC: { min: 15, max: 24 },
  expectedFlushes: 1,
  biologicalEfficiency: '50–150g dry per substrate',
  betaGlucanContent: 'High (cordycepin + adenosine)',
  indoorOutdoor: 'indoor',
  description: {
    en: "Cordyceps militaris is the cultivatable species behind the legendary Cordyceps performance benefits — without the ethical and ecological concerns of wild-harvested Ophiocordyceps sinensis ($20,000/kg). In the wild, C. militaris parasitizes insect pupae; in cultivation, it grows on sterilized grain or rice, producing the same bioactive compounds — most critically cordycepin and adenosine — through an entirely sustainable lab process. Its vivid orange club-shaped stromata are visually unlike any other cultivated mushroom.",
    es: "Cordyceps militaris es la especie cultivable detrás de los legendarios beneficios de rendimiento del Cordyceps — sin los problemas éticos y ecológicos del Ophiocordyceps sinensis silvestre ($20,000/kg). En la naturaleza parasita pupas de insectos; en cultivo crece en grano esterilizado produciendo los mismos compuestos bioactivos — principalmente cordycepina y adenosina — a través de un proceso de laboratorio completamente sostenible. Sus vibrantes estromatos naranjas en forma de maza son visualmente únicos entre los hongos cultivados.",
  },
  cultivationNotes: {
    en: "Cordyceps is one of the most technically demanding cultivated fungi. Colonization occurs on cooked grain (wheat berries or brown rice) over 14–21 days at 65–72°F. Fruiting requires a 12-hour light/dark cycle — light is critical to trigger stroma formation. Maintain 85–95% humidity and 60–75°F. Orange stromata develop slowly over 30–60 days. Harvest when tips show bright orange color, before the white spore layer appears.",
    es: "El Cordyceps es uno de los hongos cultivados más técnicamente exigentes. La colonización ocurre en grano cocido (trigo o arroz integral) en 14–21 días a 18–22°C. La fructificación requiere ciclo luz/oscuridad de 12 horas — la luz es crítica para detonar la formación de estromatos. Mantener 85–95% humedad. Los estromatos naranjas se desarrollan lentamente en 30–60 días.",
  },
  medicalNotes: {
    en: "Cordycepin (3'-deoxyadenosine) is the primary bioactive compound — it mimics adenosine in the body, increasing ATP synthesis at the cellular level. Randomized controlled trials in trained athletes show significant improvements in VO2 max, time to exhaustion, and lactate clearance. Also studied for: immune modulation (via beta-glucan polysaccharides), kidney protection (nephroprotective), libido and testosterone support, and anti-aging properties. A 2010 study published in the Journal of Alternative and Complementary Medicine showed 11% improvement in VO2 max vs. placebo.",
    es: "La cordycepina (3'-desoxiadenosina) es el principal compuesto bioactivo — imita la adenosina en el cuerpo, aumentando la síntesis de ATP a nivel celular. Ensayos controlados aleatorizados en atletas entrenados muestran mejoras significativas en VO2 máx, tiempo hasta el agotamiento y aclaramiento de lactato. También estudiado para: modulación inmune, protección renal, soporte de libido y testosterona, y propiedades antienvejecimiento.",
  },
  cookingNotes: {
    en: "Not typically consumed as a culinary mushroom due to its small fruiting body size and slightly bitter flavor. Best consumed as a powder, capsule, or tincture. The dried stromata can be steeped in hot water as a tea. Dose: 1–3g of powder daily. Pairs well with coffee and chocolate in functional beverage blends.",
    es: "Generalmente no se consume como hongo culinario por el pequeño tamaño de sus cuerpos fructificantes y sabor ligeramente amargo. Mejor consumido como polvo, cápsula o tintura. Los estromatos secos pueden prepararse en infusión de agua caliente. Dosis: 1–3g de polvo diario. Combina bien con café y chocolate en mezclas funcionales.",
  },
  lookalikes: ['Ophiocordyceps sinensis (wild)', 'Isaria farinosa'],
  imageUrl: '',
  thumbnailUrl: '',
  openartPrompt: "Macro nature photography, Cordyceps militaris mushrooms showing vivid orange club-shaped stromata (fruiting bodies) growing upright from sterilized grain substrate in a laboratory cultivation container. Multiple thin orange stalks 3–6cm tall with slightly swollen club-shaped tips, glowing warm orange against a dark blurred background. Extreme surface detail showing the fine granular texture of the stromata surface. Soft directional studio lighting highlighting the saturated orange color. Professional mycology/scientific photography, photorealistic, 8K",
  keyBenefits: [
    { icon: 'zap', label: 'ATP & Energy', detail: 'Cordycepin increases cellular ATP production — the same mechanism used by the world\'s most elite endurance athletes' },
    { icon: 'activity', label: 'VO2 Max', detail: 'Randomized trials show 11%+ improvement in VO2 max and time-to-exhaustion in trained athletes after 3 weeks' },
    { icon: 'shield', label: 'Immune Modulation', detail: 'Beta-glucan polysaccharides activate NK cells and macrophages — studied for immune enhancement and anti-tumor activity' },
    { icon: 'heart', label: 'Kidney & Vitality', detail: 'Nephroprotective compounds support kidney function; traditionally used for libido, fatigue, and age-related vitality' },
  ],
}

export const ANTLER_REISHI_SPECIES: SpeciesData = {
  id: '8',
  slug: 'antler-reishi',
  commonName: 'Antler Reishi',
  scientificName: 'Ganoderma multipileum',
  family: 'Ganodermataceae',
  order: 'Polyporales',
  type: 'medicinal',
  difficulty: 'advanced',
  substrate: ['Hardwood logs', 'Hardwood stumps'],
  colonizationWeeks: { min: 12, max: 16 },
  fruitingTempF: { min: 70, max: 82 },
  fruitingTempC: { min: 21, max: 28 },
  expectedFlushes: 1,
  biologicalEfficiency: '5–15%',
  betaGlucanContent: 'High (triterpenoids + beta-glucans)',
  indoorOutdoor: 'both',
  description: {
    en: 'Antler Reishi grows dramatic branching, stag-horn fruiting bodies instead of the classic kidney-shaped cap. For decades it was sold and studied under the "Ganoderma lucidum" name — DNA sequencing only separated it into its own species, Ganoderma multipileum, in 2009. It shares the same core bioactive compound classes as standard Reishi, but as a distinct species its exact concentrations haven\'t been directly compared in published studies. A different growing experience from the same medicinal lineage.',
    es: 'El Reishi Antler forma dramáticos cuerpos fructificantes ramificados en forma de asta en lugar del clásico sombrero renal. Durante décadas se vendió y estudió bajo el nombre "Ganoderma lucidum" — la secuenciación de ADN recién lo separó en su propia especie, Ganoderma multipileum, en 2009. Comparte las mismas clases principales de compuestos bioactivos que el Reishi estándar, pero al ser una especie distinta sus concentraciones exactas no se han comparado directamente en estudios publicados. Una experiencia de cultivo distinta, dentro del mismo linaje medicinal.',
  },
  cultivationNotes: {
    en: 'Colonization matches standard Reishi — slow, at warm temperatures (75–82°F). The difference is entirely in fruiting: while most species need strong fresh air exchange, Antler Reishi requires the opposite — CO2 held above 5,000 ppm throughout fruiting by deliberately limiting FAE. This suppresses cap formation and drives vertical antler growth. Too much fresh air and it reverts to a normal kidney cap. Advanced growers only.',
    es: 'La colonización iguala al Reishi estándar — lenta, a temperaturas cálidas (24-28°C). La diferencia está toda en la fructificación: mientras la mayoría de las especies necesita buen intercambio de aire fresco, el Reishi Antler requiere lo opuesto — mantener el CO2 por encima de 5,000 ppm durante toda la fructificación limitando deliberadamente el FAE. Esto suprime la formación del sombrero y dirige el crecimiento vertical en forma de asta. Demasiado aire fresco y revierte a un sombrero renal normal. Solo cultivadores avanzados.',
  },
  medicalNotes: {
    en: 'As a member of the Ganoderma lucidum species complex, Antler Reishi shares the same core pharmacological categories documented for standard Reishi — ganoderic acids (triterpenoids), beta-glucan polysaccharides, and immunomodulating proteins. Because it was only formally separated into its own species in 2009, exact compound concentrations haven\'t been directly compared head-to-head against G. lucidum in published studies. The antler form\'s greater surface area per gram is prized for tincture extraction efficiency.',
    es: 'Como miembro del complejo de especies Ganoderma lucidum, el Reishi Antler comparte las mismas categorías farmacológicas centrales documentadas para el Reishi estándar — ácidos ganodéricos (triterpenoides), polisacáridos beta-glucanos y proteínas inmunomoduladoras. Al haberse separado formalmente en su propia especie recién en 2009, las concentraciones exactas de compuestos no se han comparado directamente contra G. lucidum en estudios publicados. La mayor superficie por gramo de la forma antler es apreciada por su eficiencia de extracción en tinturas.',
  },
  cookingNotes: {
    en: 'Not consumed as food — like standard Reishi, the fruiting body is tough and bitter. Best prepared as a dual-extract tincture (hot water + alcohol) or powder. The branching antler form exposes more surface area than a flat cap, which tincture makers report improves solvent penetration and extraction consistency.',
    es: 'No se consume como alimento — como el Reishi estándar, el cuerpo fructificante es duro y amargo. Se prepara mejor como tintura de doble extracción (agua caliente + alcohol) o en polvo. La forma ramificada de asta expone más superficie que un sombrero plano, lo cual los fabricantes de tinturas reportan que mejora la penetración del solvente y la consistencia de extracción.',
  },
  lookalikes: ['Ganoderma lucidum', 'Ganoderma applanatum'],
  imageUrl: '',
  thumbnailUrl: '',
  openartPrompt:
    'Macro nature photography, Antler Reishi mushroom (Ganoderma multipileum) showing dramatic branching stag-horn fruiting bodies with a lacquered mahogany-red surface, growing upright from a hardwood log in a controlled cultivation environment. No kidney-shaped cap — instead multiple antler-like branches with actively-growing white tips. Dramatic directional lighting highlighting the glossy lacquered texture. Extreme surface detail, shallow depth of field. Professional mycology photography, photorealistic, 8K',
  keyBenefits: [
    { icon: 'shield', label: 'Shared Ganoderma Compounds', detail: 'Ganoderic acids and immunomodulating polysaccharides — the same core compound classes as standard Reishi' },
    { icon: 'leaf', label: 'Adaptogen Lineage', detail: 'Member of the clinically-studied Ganoderma lucidum complex, historically used for stress resilience and the HPA axis' },
    { icon: 'zap', label: 'Extraction Efficiency', detail: 'The antler form\'s branching structure exposes more surface area per gram — preferred by tincture makers for solvent penetration' },
    { icon: 'activity', label: 'Distinct Species', detail: 'Formally separated from G. lucidum only in 2009 via DNA sequencing — a related but scientifically distinct organism' },
  ],
}

export const SPECIES_LIST: SpeciesData[] = [
  ...SPECIES_LIST_BASE,
  CORDYCEPS_SPECIES,
  ANTLER_REISHI_SPECIES,
]

export const SPECIES_MAP: Record<string, SpeciesData> = Object.fromEntries(
  SPECIES_LIST.map((s) => [s.slug, s])
)
