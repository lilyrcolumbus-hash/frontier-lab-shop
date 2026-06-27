export type LearnCategory = 'beginners' | 'science' | 'cultivation' | 'wellness' | 'kitchen'

export interface LearnSection {
  title: { en: string; es: string }
  content: { en: string; es: string }
}

export interface LearnArticle {
  slug: string
  category: LearnCategory
  title: { en: string; es: string }
  excerpt: { en: string; es: string }
  readTime: number
  species?: string
  imageUrl: string
  intro: { en: string; es: string }
  sections: LearnSection[]
  keyTakeaways: { en: string[]; es: string[] }
}

export const CATEGORY_LABEL: Record<LearnCategory, { en: string; es: string }> = {
  beginners:   { en: 'Beginners',  es: 'Principiantes' },
  science:     { en: 'Science',    es: 'Ciencia' },
  cultivation: { en: 'Cultivation', es: 'Cultivo' },
  wellness:    { en: 'Wellness',   es: 'Bienestar' },
  kitchen:     { en: 'Kitchen',    es: 'Cocina' },
}

export const CATEGORY_COLOR: Record<LearnCategory, string> = {
  beginners:   'bg-accent/15 text-accent border-accent/20',
  science:     'bg-lavender/15 text-lavender border-lavender/20',
  cultivation: 'bg-moss/15 text-moss border-moss/20',
  wellness:    'bg-amber/15 text-amber border-amber/20',
  kitchen:     'bg-amber/15 text-amber border-amber/20',
}

export const CATEGORY_GRADIENT: Record<LearnCategory, string> = {
  beginners:   'from-accent/20 to-accent/5',
  science:     'from-lavender/20 to-lavender/5',
  cultivation: 'from-moss/20 to-moss/5',
  wellness:    'from-amber/20 to-amber/5',
  kitchen:     'from-amber/20 to-amber/5',
}

export const ARTICLES: LearnArticle[] = [
  // ── BEGINNERS ──────────────────────────────────────────────────────────────
  {
    slug: 'beginners-guide-oyster-mushrooms',
    category: 'beginners',
    title: {
      en: "The Complete Beginner's Guide to Growing Oyster Mushrooms",
      es: 'Guía Completa para Principiantes: Cómo Cultivar Hongos Ostra',
    },
    excerpt: {
      en: 'Blue, Pink, and Yellow Oyster mushrooms are the fastest, most forgiving species to grow. This guide covers everything from your first inoculation to your first harvest.',
      es: 'Las ostras Azul, Rosa y Amarilla son las especies más rápidas y tolerantes de cultivar. Esta guía cubre todo desde tu primera inoculación hasta tu primera cosecha.',
    },
    readTime: 12,
    species: 'blue-oyster',
    imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=1200&h=500&q=85&auto=format&fit=crop',
    intro: {
      en: "Oyster mushrooms are the ideal entry point into the world of mushroom cultivation. They colonize fast, tolerate beginner mistakes, fruit abundantly, and reward you with a harvest in as little as three weeks. Blue Oyster (Pleurotus ostreatus) is the most forgiving of all — but Pink and Yellow Oysters follow the same principles and add visual drama to your first grow.",
      es: 'Los hongos ostra son el punto de entrada ideal al mundo del cultivo de hongos. Colonizan rápido, toleran los errores de principiante, fructifican abundantemente y te recompensan con una cosecha en tan solo tres semanas.',
    },
    sections: [
      {
        title: { en: 'Why Start with Oyster Mushrooms?', es: '¿Por qué empezar con hongos ostra?' },
        content: {
          en: "Oyster mushrooms are aggressive colonizers — their mycelium out-competes most contaminants before they can take hold. They fruit at room temperature (55–85°F depending on variety), require no specialized equipment beyond a humidity tent, and produce 3–4 flushes from a single block. Blue Oyster prefers cooler temperatures (55–65°F), making it perfect for air-conditioned spaces. Pink Oyster thrives in warmth (75–85°F) and pins within days. Yellow Oyster sits in the middle and has the most spectacular visual payoff.",
          es: 'Los hongos ostra son colonizadores agresivos — su micelio supera a la mayoría de los contaminantes antes de que puedan establecerse. Fructifican a temperatura ambiente, no requieren equipo especializado más allá de una tienda de humedad, y producen 3-4 flushes de un solo bloque.',
        },
      },
      {
        title: { en: 'What You Need', es: 'Qué necesitas' },
        content: {
          en: "The essentials: grain spawn (Blue, Pink, or Yellow Oyster), one pre-sterilized hardwood substrate bag, a humidity tent or clear tote, a misting bottle, and a thermometer. Total investment for your first grow: under $40. You don't need a pressure cooker, laminar flow hood, or agar work for oyster mushrooms — they are forgiving enough for open-air inoculation when done cleanly.",
          es: 'Lo esencial: spawn de grano (ostra azul, rosa o amarilla), una bolsa de sustrato de madera dura pre-esterilizada, una tienda de humedad o tote transparente, atomizador y termómetro. Inversión total para tu primer cultivo: menos de $40.',
        },
      },
      {
        title: { en: 'Inoculation to First Pins', es: 'De la inoculación a los primeros pines' },
        content: {
          en: "Open the substrate bag in a clean area (spray isopropyl alcohol on your hands and surfaces). Add grain spawn at 10–15% of substrate weight, mix thoroughly, and seal the bag with an injection port or filter patch. Place in a warm dark spot at 70–75°F. Within 2–3 weeks you'll see white mycelium covering the bag. When fully colonized, introduce fruiting conditions: cut 2–3 slits in the bag, place inside your humidity tent, and mist 2–3 times daily to maintain 85–95% humidity. First pins appear in 5–10 days.",
          es: 'Abre la bolsa de sustrato en un área limpia. Agrega spawn de grano al 10-15% del peso del sustrato, mezcla bien y cierra la bolsa. Coloca en un lugar cálido y oscuro a 21-24°C. En 2-3 semanas verás micelio blanco cubriendo la bolsa. Introduce las condiciones de fructificación: corta 2-3 ranuras, coloca en la tienda de humedad y rocía 2-3 veces al día.',
        },
      },
      {
        title: { en: 'Harvesting and Second Flush', es: 'Cosecha y segundo flush' },
        content: {
          en: "Harvest your oysters just before the caps flatten out and the edges begin to turn upward — this is when they're at peak flavor and before they start dropping spores. Grab the entire cluster at the base and twist-pull cleanly. After the first flush, remove any leftover stump material, mist the exposed substrate, and wait 5–7 days for the second flush to develop. Between flushes, give the block a 24-hour soak in cold water to rehydrate.",
          es: 'Cosecha las ostras justo antes de que los sombreros se aplanen y los bordes comiencen a curvarse hacia arriba. Agarra todo el racimo en la base y tuerce/jala limpiamente. Después del primer flush, elimina cualquier resto de tallo, rocía el sustrato expuesto y espera 5-7 días para el segundo flush.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        'Harvest before the cap edges turn upward — that is peak flavor and texture',
        'High humidity (85–95%) matters more than perfect temperature',
        'First pins typically appear 5–10 days after introducing fruiting conditions',
        'Soak the block in cold water between flushes to rehydrate',
      ],
      es: [
        'Cosechar antes de que los bordes del sombrero se curven hacia arriba — eso es sabor y textura óptimos',
        'Alta humedad (85-95%) importa más que la temperatura perfecta',
        'Los primeros pines aparecen típicamente 5-10 días después de introducir condiciones de fructificación',
        'Remojar el bloque en agua fría entre flushes para rehidratarlo',
      ],
    },
  },

  // ── SCIENCE ────────────────────────────────────────────────────────────────
  {
    slug: 'lions-mane-brain-health',
    category: 'science',
    title: {
      en: "Lion's Mane & Brain Health: What the Science Says",
      es: "Melena de León y Salud Cerebral: Qué Dice la Ciencia",
    },
    excerpt: {
      en: "Lion's Mane is the only mushroom known to contain compounds that directly stimulate nerve growth in the human brain. Here's what the research actually shows.",
      es: 'La Melena de León es el único hongo conocido que contiene compuestos que estimulan directamente el crecimiento nervioso en el cerebro humano.',
    },
    readTime: 15,
    species: 'lions-mane',
    imageUrl: '',
    intro: {
      en: "For thousands of years, Lion's Mane (Hericium erinaceus) was prescribed by Chinese physicians for cognitive clarity and nervous system health. Modern science has identified why: two families of bioactive compounds — hericenones (found in the fruiting body) and erinacines (found in the mycelium) — are the only naturally occurring substances known to cross the blood-brain barrier and stimulate the synthesis of Nerve Growth Factor (NGF), a protein essential for the growth, maintenance, and survival of neurons.",
      es: 'Durante miles de años, la Melena de León fue prescrita por médicos chinos para la claridad cognitiva. La ciencia moderna ha identificado por qué: dos familias de compuestos bioactivos — hericenones y erinacinas — son las únicas sustancias naturales conocidas que cruzan la barrera hematoencefálica y estimulan la síntesis del Factor de Crecimiento Nervioso (NGF).',
    },
    sections: [
      {
        title: { en: 'The NGF Connection', es: 'La conexión con el NGF' },
        content: {
          en: "Nerve Growth Factor (NGF) is a protein that regulates the growth, maintenance, and survival of neurons in both the central and peripheral nervous systems. NGF levels naturally decline with age, and low NGF is associated with cognitive decline, Alzheimer's disease, and peripheral neuropathy. The erinacines in Lion's Mane mycelium are small enough to cross the blood-brain barrier and stimulate NGF synthesis directly inside the brain — something virtually no other compound in nature can do. Hericenones in the fruiting body trigger peripheral NGF synthesis and protect existing neurons from amyloid-beta damage.",
          es: 'El Factor de Crecimiento Nervioso (NGF) es una proteína que regula el crecimiento, mantenimiento y supervivencia de las neuronas. Los niveles de NGF disminuyen naturalmente con la edad, y el NGF bajo se asocia con declive cognitivo y enfermedad de Alzheimer. Las erinacinas en el micelio son lo suficientemente pequeñas para cruzar la barrera hematoencefálica y estimular la síntesis de NGF directamente dentro del cerebro.',
        },
      },
      {
        title: { en: 'What Clinical Trials Show', es: 'Qué muestran los ensayos clínicos' },
        content: {
          en: "A landmark double-blind, placebo-controlled trial published in Phytotherapy Research (2009) gave 30 Japanese adults aged 50–80 with mild cognitive impairment either 250mg Lion's Mane extract three times daily or placebo for 16 weeks. The Lion's Mane group showed significant improvement on cognitive function scales — and scores declined when supplementation stopped. A 2023 study from the University of Queensland found that Lion's Mane enhanced memory and nerve growth even in healthy young adults. Multiple trials also confirm improvements in anxiety and depression, likely through the same NGF pathway and an independent effect on BDNF (Brain-Derived Neurotrophic Factor).",
          es: 'Un ensayo doble ciego, controlado con placebo (Phytotherapy Research, 2009) dio a 30 adultos japoneses de 50-80 años con deterioro cognitivo leve extracto de Melena de León o placebo durante 16 semanas. El grupo de Melena de León mostró mejora significativa en las escalas de función cognitiva — y las puntuaciones disminuyeron cuando se detuvo la suplementación.',
        },
      },
      {
        title: { en: 'Cognitive vs. Mood Benefits', es: 'Beneficios cognitivos vs. del estado de ánimo' },
        content: {
          en: "Lion's Mane appears to work through two distinct pathways. The NGF pathway primarily supports memory, learning, and neuroprotection — benefits that are most pronounced in people with existing cognitive decline or nerve damage. The second pathway involves reducing neuroinflammation and supporting myelin sheath integrity, which correlates more with anxiety reduction and mood stabilization in otherwise healthy individuals. Most users report mood benefits appearing faster (2–4 weeks) than clear cognitive improvements (6–8 weeks), which require consistent daily use.",
          es: 'La Melena de León parece actuar a través de dos vías distintas. La vía del NGF apoya principalmente la memoria, el aprendizaje y la neuroprotección. La segunda vía reduce la neuroinflamación y apoya la integridad de la vaina de mielina, que se correlaciona más con la reducción de ansiedad y la estabilización del estado de ánimo.',
        },
      },
      {
        title: { en: 'How to Use It Effectively', es: 'Cómo usarlo de manera efectiva' },
        content: {
          en: "For medicinal benefit, whole dried powder has lower bioavailability than extracts. Look for dual-extract products that capture both hericenones (from hot water extraction) and erinacines (from alcohol extraction). A dose of 500–1000mg of a quality extract daily is the range used in most trials. Benefits require 4–8 weeks of consistent daily use — do not expect immediate effects. Fresh Lion's Mane cooked and eaten is nutritious and delicious but delivers lower concentrations of the active compounds than a concentrated extract.",
          es: 'Para beneficio medicinal, el polvo seco entero tiene menor biodisponibilidad que los extractos. Busca productos de doble extracción que capturen tanto hericenones (extracción con agua caliente) como erinacinas (extracción con alcohol). Los beneficios requieren 4-8 semanas de uso diario consistente.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Benefits typically appear after 4–8 weeks of consistent daily use — not immediately",
        "Dual-extract products (water + alcohol) capture both hericenones and erinacines",
        "Most studied for cognitive decline — healthy adults may notice mood benefits first",
        "Cooking and eating fresh Lion's Mane is nutritious but delivers lower therapeutic doses",
      ],
      es: [
        'Los beneficios aparecen típicamente después de 4-8 semanas de uso diario consistente',
        'Los productos de doble extracción (agua + alcohol) capturan tanto hericenones como erinacinas',
        'Más estudiado para el deterioro cognitivo — los adultos sanos pueden notar primero los beneficios en el estado de ánimo',
        'Cocinar y comer Melena de León fresca es nutritivo pero entrega dosis terapéuticas más bajas',
      ],
    },
  },
  {
    slug: 'turkey-tail-cancer-research',
    category: 'science',
    title: {
      en: "Turkey Tail & Cancer: The PSK Immunotherapy Research",
      es: "Cola de Pavo y Cáncer: La Investigación de Inmunoterapia con PSK",
    },
    excerpt: {
      en: "PSK — derived from Turkey Tail — has been approved in Japan as a cancer adjunct therapy since 1977. Here's what decades of research actually show.",
      es: 'El PSK — derivado de la Cola de Pavo — ha sido aprobado en Japón como terapia adyuvante contra el cáncer desde 1977.',
    },
    readTime: 10,
    species: 'turkey-tail',
    imageUrl: '',
    intro: {
      en: "Turkey Tail (Trametes versicolor) is among the most researched medicinal mushrooms in the world, not because of tradition, but because of hard pharmaceutical science. PSK (polysaccharide-K, also called krestin) and PSP (polysaccharide peptide) are two immune-modulating compounds extracted from Turkey Tail that have been the subject of hundreds of clinical trials since the 1970s. PSK is not a supplement — in Japan and China, it is a government-approved prescription drug used alongside chemotherapy.",
      es: 'La Cola de Pavo (Trametes versicolor) es uno de los hongos medicinales más investigados del mundo, no por tradición, sino por ciencia farmacéutica dura. El PSK y el PSP son compuestos inmunomoduladores que han sido objeto de cientos de ensayos clínicos desde los años 70.',
    },
    sections: [
      {
        title: { en: 'What PSK Actually Does', es: 'Qué hace realmente el PSK' },
        content: {
          en: "PSK is a beta-1,4-glucan-protein complex that binds to immune cell receptors and triggers a cascade of immune activation — increasing NK (natural killer) cell activity, stimulating dendritic cell maturation, and promoting T-cell proliferation. In cancer patients, these mechanisms help the immune system recognize and attack tumor cells that chemotherapy or radiation has damaged or disrupted. PSK does not kill cancer directly — it amplifies the body's own immune response and helps prevent immunosuppression caused by chemotherapy itself.",
          es: 'El PSK es un complejo beta-1,4-glucano-proteína que se une a los receptores de células inmunes y desencadena una cascada de activación inmune, aumentando la actividad de las células NK, estimulando la maduración de las células dendríticas y promoviendo la proliferación de células T.',
        },
      },
      {
        title: { en: 'The Clinical Evidence', es: 'La evidencia clínica' },
        content: {
          en: "The evidence base for PSK is substantial. A meta-analysis of randomized controlled trials covering over 8,000 gastric cancer patients found that PSK treatment alongside chemotherapy resulted in statistically significant improvements in 5-year survival rates. Similar benefits have been demonstrated in colorectal cancer (a 2012 Cochrane review covering 1,094 patients), breast cancer, and lung cancer. A landmark study by Stanford oncologist Dr. Denise Chien found that Turkey Tail extract significantly altered the gut microbiome of breast cancer patients in ways that enhanced systemic immune response.",
          es: 'Un meta-análisis de ensayos controlados aleatorizados que cubrieron más de 8,000 pacientes con cáncer gástrico encontró que el tratamiento con PSK junto a la quimioterapia resultó en mejoras estadísticamente significativas en las tasas de supervivencia a 5 años.',
        },
      },
      {
        title: { en: 'PSK vs. PSP: What\'s the Difference?', es: 'PSK vs. PSP: ¿Cuál es la diferencia?' },
        content: {
          en: "PSK and PSP are both extracted from Turkey Tail but differ in their protein components and research base. PSK has been the subject of most major clinical trials and is the compound in the approved Japanese drug krestin. PSP has been researched primarily in China and shows strong antiviral properties — clinical trials have demonstrated it increases T-cell and B-cell counts in HIV patients and shows antiviral activity against herpes simplex and influenza. A quality Turkey Tail extract contains both compounds.",
          es: 'El PSK y el PSP se extraen ambos de la Cola de Pavo pero difieren en sus componentes proteicos. El PSK ha sido el objeto de la mayoría de los ensayos clínicos principales. El PSP muestra fuertes propiedades antivirales, con ensayos clínicos que demuestran que aumenta los recuentos de células T y B en pacientes con VIH.',
        },
      },
      {
        title: { en: 'How to Use Turkey Tail', es: 'Cómo usar la Cola de Pavo' },
        content: {
          en: "Turkey Tail is not a food mushroom — the fruiting body is too tough and leathery. The most accessible preparation is a hot water decoction: simmer 5–10 grams of dried Turkey Tail in 500ml water for 20–30 minutes, strain, and drink as a tea. This captures the water-soluble beta-glucans effectively. For a more concentrated dose, look for standardized extracts with at least 30% polysaccharide content. Daily consistency over months is what the clinical trials used — this is not an acute treatment.",
          es: 'La Cola de Pavo no es un hongo comestible. La preparación más accesible es una decocción de agua caliente: hierve 5-10 gramos de Cola de Pavo seca en 500ml de agua durante 20-30 minutos, cuela y bebe como té. La consistencia diaria durante meses es lo que usaron los ensayos clínicos.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "PSK (krestin) is a government-approved drug in Japan — not just a supplement",
        "Works as an immune adjunct alongside chemotherapy — not a standalone cancer treatment",
        "Hot water decoction (tea) effectively extracts the water-soluble beta-glucans",
        "Consistent daily use over months is what clinical trials used — not short-term doses",
      ],
      es: [
        'El PSK (krestin) es un medicamento aprobado por el gobierno en Japón — no solo un suplemento',
        'Funciona como adyuvante inmune junto a la quimioterapia — no es un tratamiento oncológico independiente',
        'La decocción de agua caliente (té) extrae eficazmente los beta-glucanos solubles en agua',
        'El uso diario consistente durante meses es lo que usaron los ensayos clínicos',
      ],
    },
  },
  {
    slug: 'understanding-mycelium',
    category: 'science',
    title: {
      en: 'Understanding Mycelium: The Fungal Network That Runs the World',
      es: 'Entendiendo el Micelio: La Red Fúngica que Gobierna el Mundo',
    },
    excerpt: {
      en: "Mycelium is not the root of a mushroom — it is the actual organism. Understanding how it works makes you a better cultivator and reveals why fungi are essential to life on Earth.",
      es: 'El micelio no es la raíz de un hongo — es el organismo real. Entender cómo funciona te hace mejor cultivador y revela por qué los hongos son esenciales para la vida en la Tierra.',
    },
    readTime: 8,
    imageUrl: '',
    intro: {
      en: "A mushroom is to mycelium what an apple is to an apple tree — a temporary reproductive structure produced by a much larger, longer-lived organism. The real fungus lives underground (or inside wood), as a vast network of thread-like cells called hyphae that branch and fuse into the dense mat we call mycelium. A single mycelial network can span acres, live for thousands of years, and break down material that no other organism on Earth can digest.",
      es: 'Un hongo es al micelio lo que una manzana es a un manzano — una estructura reproductiva temporal producida por un organismo mucho más grande y de vida más larga. El hongo real vive bajo tierra como una vasta red de células filamentosas llamadas hifas que forman el micelio.',
    },
    sections: [
      {
        title: { en: 'Hyphae: The Building Block', es: 'Hifas: El bloque de construcción' },
        content: {
          en: "Each hypha is a single thread of fungal cells, typically 2–10 micrometers in diameter, that grows from its tip and branches continuously. These threads secrete enzymes ahead of their growth tip, breaking down organic material in the environment and absorbing the resulting nutrients. When two compatible hyphae meet, they can fuse (anastomose) — sharing nutrients and genetic information across the network. This fusion is what allows mycelium to spread as one integrated organism rather than separate threads.",
          es: 'Cada hifa es un solo filamento de células fúngicas que crece desde su punta y se ramifica continuamente. Estas fibras secretan enzimas frente a su punta de crecimiento, descomponiendo material orgánico en el ambiente. Cuando dos hifas compatibles se encuentran, pueden fusionarse, compartiendo nutrientes e información genética a través de la red.',
        },
      },
      {
        title: { en: 'How Mycelium Decomposes', es: 'Cómo descompone el micelio' },
        content: {
          en: "Fungi are the primary decomposers of lignin — the tough structural compound that makes wood rigid. No other kingdom of life can break down lignin efficiently. White-rot fungi (like Oyster, Shiitake, and Turkey Tail) secrete peroxidases and laccases that dismantle lignin and cellulose simultaneously. Brown-rot fungi target only cellulose. This decomposition process is the primary mechanism by which carbon locked in dead wood is returned to the soil, making fungi foundational to the global carbon cycle.",
          es: 'Los hongos son los principales descomponedores de la lignina — el compuesto estructural duro que hace rígida la madera. Ningún otro reino de la vida puede descomponer la lignina de manera eficiente. Los hongos de podredumbre blanca (como las ostras, el shiitake y la cola de pavo) secretan enzimas que desmantelan la lignina y la celulosa simultáneamente.',
        },
      },
      {
        title: { en: 'The Wood Wide Web', es: 'La red forestal subterránea' },
        content: {
          en: "Many forest trees form symbiotic relationships with mycorrhizal fungi — where fungal hyphae colonize tree roots and exchange phosphorus and water from the soil for sugars produced by the tree through photosynthesis. In this relationship, mycelial networks effectively connect the root systems of different trees, allowing them to share nutrients. Established trees can feed seedlings through this network; stressed trees can signal others through chemical compounds transported through mycelium. This system — sometimes called the Wood Wide Web — is now considered central to forest ecosystem health.",
          es: 'Muchos árboles del bosque forman relaciones simbióticas con hongos micorrizales, donde las hifas fúngicas colonizan las raíces de los árboles e intercambian fósforo y agua del suelo por azúcares producidos por el árbol. Las redes miceliales conectan efectivamente los sistemas de raíces de diferentes árboles, permitiéndoles compartir nutrientes.',
        },
      },
      {
        title: { en: 'Mycelium in Cultivation', es: 'El micelio en el cultivo' },
        content: {
          en: "Understanding mycelial growth stages makes you a better cultivator. Early colonization (lag phase): mycelium is establishing its enzymatic machinery in the substrate — little visible growth for the first few days. Exponential growth: the network expands rapidly, and you see visible white threads spreading through the substrate. Full colonization: the entire substrate is white and firm — the block is ready to fruit. Contamination appears as green, black, or pink patches — foreign molds that got established before or alongside your spawn. Clean practices during inoculation prevent 90% of contaminations.",
          es: 'Entender las etapas de crecimiento micelial te hace mejor cultivador. Colonización temprana: el micelio establece su maquinaria enzimática. Crecimiento exponencial: la red se expande rápidamente. Colonización completa: todo el sustrato es blanco y firme. La contaminación aparece como manchas verdes, negras o rosas.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "The mushroom is the fruiting body — the fungus itself is the mycelium",
        "White-rot fungi are the only organisms that can break down lignin in wood",
        "Full white colonization of the substrate before fruiting = most important cultivation milestone",
        "Green or black patches = contamination — remove immediately before it spreads",
      ],
      es: [
        'El hongo es el cuerpo fructificante — el organismo en sí es el micelio',
        'Los hongos de podredumbre blanca son los únicos organismos que pueden descomponer la lignina',
        'Colonización blanca completa del sustrato antes de fructificar = hito de cultivo más importante',
        'Manchas verdes o negras = contaminación — eliminar inmediatamente antes de que se propague',
      ],
    },
  },

  // ── CULTIVATION ────────────────────────────────────────────────────────────
  {
    slug: 'shiitake-log-inoculation',
    category: 'cultivation',
    title: {
      en: 'Shiitake Log Inoculation: The Traditional Method Step by Step',
      es: 'Inoculación de Troncos de Shiitake: El Método Tradicional Paso a Paso',
    },
    excerpt: {
      en: "Log-grown Shiitake has a richer, smokier flavor than sawdust-grown. One inoculation produces mushrooms for 3–5 years. Here's exactly how to do it.",
      es: 'El Shiitake cultivado en troncos tiene un sabor más rico y ahumado que el cultivado en aserrín. Una inoculación produce hongos durante 3-5 años.',
    },
    readTime: 20,
    species: 'shiitake',
    imageUrl: '',
    intro: {
      en: "Log cultivation is the traditional method used in Japan and Korea for thousands of years — and it produces Shiitake with noticeably superior flavor, texture, and medicinal compound concentration compared to the faster indoor sawdust method. The trade-off is time: log Shiitake takes 6–12 months to fully colonize before first fruiting. But a single log inoculated correctly will produce multiple flushes per year for 3–5 years, making the patient investment worthwhile.",
      es: 'El cultivo en troncos es el método tradicional usado en Japón y Corea durante miles de años — y produce Shiitake con sabor, textura y concentración de compuestos medicinales notablemente superiores. El costo es tiempo: el Shiitake en troncos tarda 6-12 meses en colonizarse completamente antes de la primera fructificación.',
    },
    sections: [
      {
        title: { en: 'Choosing Your Logs', es: 'Elegir tus troncos' },
        content: {
          en: "Oak is the ideal substrate — white oak (Quercus alba) and red oak (Quercus rubra) are the gold standard, but any oak species works well. Other acceptable hardwoods include maple, hornbeam, and alder. Avoid softwoods (pine, spruce) — they contain resins that inhibit mycelial growth. Logs should be freshly cut (no more than 6 weeks before inoculation) from living, healthy trees — dead or diseased wood may harbor competing fungi. Ideal diameter: 4–6 inches. Length: 3–4 feet. Allow cut logs to rest 2–4 weeks before inoculation so the natural anti-fungal compounds in fresh wood dissipate.",
          es: 'El roble es el sustrato ideal. Evita las coníferas — contienen resinas que inhiben el crecimiento micelial. Los troncos deben ser recién cortados (no más de 6 semanas antes de la inoculación) de árboles vivos y sanos. Diámetro ideal: 10-15 cm. Largo: 90-120 cm.',
        },
      },
      {
        title: { en: 'Drilling and Filling', es: 'Perforar y llenar' },
        content: {
          en: "Use a 5/16\" drill bit to create holes 1.25\" deep in a diamond pattern across the log — typically 4–6 inches apart along the length and 2–3 inches apart around the circumference. This pattern ensures even colonization throughout the log's interior. Press plug spawn firmly into each hole until flush with the bark surface. Immediately seal each filled hole with cheese wax (melted and brushed on) to prevent contamination and moisture loss. The wax is critical — do not skip it.",
          es: 'Usa una broca de 8mm para crear agujeros de 3cm de profundidad en un patrón de diamante en el tronco — típicamente 10-15 cm separados. Presiona el spawn en tacos firmemente en cada agujero. Sella inmediatamente cada agujero rellenado con cera de queso para prevenir la contaminación.',
        },
      },
      {
        title: { en: 'Colonization and the Waiting Game', es: 'Colonización y el juego de la espera' },
        content: {
          en: "Stack inoculated logs in a shaded, humid area where they receive occasional natural rainfall but are not waterlogged. A woodland edge, under deciduous trees, is ideal. Keep logs off the ground to prevent competing fungi from entering through the cut ends — use crossed stakes or a simple rack. During the 6–12 month colonization period, the mycelium is quietly spreading through the wood's interior. You may see white fungal growth around the wax plugs — that is your spawn. Moisten logs during dry spells; they should feel damp to the touch but never soaking.",
          es: 'Apila los troncos inoculados en un área sombreada y húmeda donde reciban lluvia natural ocasional pero no estén empapados. Un borde de bosque es ideal. Mantén los troncos fuera del suelo para prevenir que hongos competidores entren por los extremos cortados.',
        },
      },
      {
        title: { en: 'Shocking and Fruiting', es: 'Shock y fructificación' },
        content: {
          en: "After 6–12 months, test for readiness by soaking a log in cold water for 24 hours. If it sinks (rather than floats), colonization is complete. The 24-hour cold water soak is also the fruiting trigger — the temperature shock and rehydration mimics the conditions that follow a cold autumn rain in natural Shiitake habitat. After soaking, stand the log upright in a shaded spot and wait 7–14 days for pins to emerge. Harvest before the caps flatten completely. After harvesting, rest the log for 8–10 weeks before the next soak-and-fruit cycle. Expect 2–4 fruiting cycles per year.",
          es: 'Después de 6-12 meses, prueba la madurez remojando un tronco en agua fría durante 24 horas. Si se hunde (en lugar de flotar), la colonización está completa. El remojo de 24 horas en agua fría es también el detonador de fructificación. Después de remojar, coloca el tronco en posición vertical en un lugar sombreado y espera 7-14 días para que emerjan los pines.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Use freshly cut oak — let it rest 2–4 weeks before inoculation for best results",
        "Seal every plug hole with cheese wax immediately — do not skip this step",
        "6–12 month colonization is normal — patience is the primary skill required",
        "Cold water soak (24h) triggers fruiting — repeat every 8–10 weeks for subsequent flushes",
      ],
      es: [
        'Usa roble recién cortado — déjalo reposar 2-4 semanas antes de inocular',
        'Sella cada agujero de tapón con cera de queso inmediatamente — no omitas este paso',
        'La colonización de 6-12 meses es normal — la paciencia es la habilidad principal requerida',
        'El remojo en agua fría (24h) desencadena la fructificación — repite cada 8-10 semanas',
      ],
    },
  },
  {
    slug: 'maitake-advanced-cultivation',
    category: 'cultivation',
    title: {
      en: 'Maitake: Cultivating the Hardest Mushroom',
      es: 'Maitake: Cultivando el Hongo Más Difícil',
    },
    excerpt: {
      en: "Maitake demands 12–20 weeks of colonization, a cold shock, and near-perfect humidity control. For experienced cultivators only — but the reward is worth it.",
      es: 'Maitake exige 12-20 semanas de colonización, shock frío y control de humedad casi perfecto. Solo para cultivadores experimentados — pero la recompensa vale la pena.',
    },
    readTime: 15,
    species: 'maitake',
    imageUrl: '',
    intro: {
      en: "Maitake (Grifola frondosa) is widely considered the most challenging commercially cultivated mushroom — not because the process is complicated, but because it demands extreme patience, precise environmental conditions, and an understanding of the fungus's natural habitat. In the wild, Maitake fruits at the base of old-growth oaks in autumn, after a cold front has dropped temperatures below 60°F. Replicating that ecology indoors is the core challenge.",
      es: 'El Maitake (Grifola frondosa) es ampliamente considerado el hongo cultivado comercialmente más desafiante — no porque el proceso sea complicado, sino porque exige extrema paciencia, condiciones ambientales precisas y comprensión del hábitat natural del hongo.',
    },
    sections: [
      {
        title: { en: 'Why Maitake is Different', es: 'Por qué el Maitake es diferente' },
        content: {
          en: "Most cultivated mushrooms are adapted to disturbed or fast-changing environments — they colonize quickly and fruit readily under a range of conditions. Maitake is a climax-forest species adapted to long, stable conditions in old-growth hardwood ecosystems. Its colonization strategy is slow and thorough, building a dense, complex mycelial architecture before investing energy in fruiting. It also requires a genuine cold-shock event to trigger fruiting — unlike most species, simply introducing fresh air is not sufficient.",
          es: 'La mayoría de los hongos cultivados están adaptados a entornos cambiantes — colonizan rápidamente y fructifican fácilmente. El Maitake es una especie de bosque maduro adaptada a condiciones estables en ecosistemas de madera dura de crecimiento antiguo. Su estrategia de colonización es lenta y minuciosa, construyendo una arquitectura micelial densa y compleja antes de invertir energía en la fructificación.',
        },
      },
      {
        title: { en: 'Indoor Substrate and Colonization', es: 'Sustrato interior y colonización' },
        content: {
          en: "The best substrate for indoor Maitake is a blend of 70% hardwood sawdust (oak, beech, or maple preferred) and 30% wheat bran or oat bran, sterilized at 15 PSI for 2.5 hours. Inoculate with liquid culture or agar-derived grain spawn at 15–20% spawn rate (higher than most species). Pack bags firmly and seal. Colonization temperature: 70–75°F. At these temperatures, expect 12–20 weeks for full colonization. The mycelium should appear white, rope-like, and firm — not fluffy. Fluffy mycelium often indicates too much CO2 or contamination.",
          es: 'El mejor sustrato para el Maitake interior es una mezcla de 70% de serrín de madera dura y 30% de salvado de trigo, esterilizada a 15 PSI durante 2.5 horas. Inocula con cultivo líquido o spawn de grano a una tasa del 15-20%. La colonización a 21-24°C tarda 12-20 semanas.',
        },
      },
      {
        title: { en: 'The Cold Shock Protocol', es: 'El protocolo de shock frío' },
        content: {
          en: "Once fully colonized, the block needs a genuine cold shock to trigger fruiting. Move the block to a refrigerator or cold space at 40–50°F (4–10°C) for 24–48 hours. Then return to fruiting conditions: 55–65°F (13–18°C), 90–95% humidity, and strong fresh air exchange. Cut 4–6 large slits across the top of the bag rather than side cuts — Maitake fruits upward from the top of the substrate. Misting 3–4 times daily is critical. Pins should appear in 10–21 days. If nothing appears in 3 weeks, repeat the cold shock.",
          es: 'Una vez completamente colonizado, el bloque necesita un shock frío genuino para desencadenar la fructificación. Mueve el bloque a un refrigerador a 4-10°C durante 24-48 horas. Luego regresa a condiciones de fructificación: 13-18°C, 90-95% de humedad y fuerte intercambio de aire fresco.',
        },
      },
      {
        title: { en: 'The Easier Path: Outdoor Oak Stumps', es: 'El camino más fácil: tocones de roble exterior' },
        content: {
          en: "For most cultivators, outdoor Maitake cultivation on oak stumps is more reliable than indoor methods. Find a freshly cut oak stump (or fell a small oak tree) in autumn. Inoculate the top and sides with plug spawn using the same drilling and waxing method as Shiitake logs. Cover the stump with burlap or wood chips to retain moisture. Leave it completely undisturbed for 12–18 months. The following autumn, when temperatures drop naturally below 60°F after a cold rain — inspect for fruiting. Outdoor Maitake can produce massive clusters of 5–30 lbs from a single stump, year after year, with essentially no maintenance.",
          es: 'Para la mayoría de los cultivadores, el cultivo exterior de Maitake en tocones de roble es más confiable que los métodos interiores. Encuentra un tocón de roble recién cortado en otoño. Inocula la parte superior y los lados con spawn en tacos. Cúbrelo con arpillera o astillas de madera para retener la humedad. Déjalo completamente sin tocar durante 12-18 meses.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "12–20 week colonization is completely normal — do not disturb or move the block",
        "A genuine cold shock (40–50°F for 24–48h) is required to trigger fruiting indoors",
        "Outdoor oak stump cultivation is more reliable and produces larger yields for most growers",
        "Maitake fruits from the top — cut slits in the top of the bag, not the sides",
      ],
      es: [
        'La colonización de 12-20 semanas es completamente normal — no disturbes ni muevas el bloque',
        'Se requiere un shock frío genuino (4-10°C durante 24-48h) para desencadenar la fructificación interior',
        'El cultivo exterior en tocones de roble es más confiable y produce mayores rendimientos para la mayoría de los cultivadores',
        'El Maitake fructifica desde arriba — corta ranuras en la parte superior de la bolsa, no en los lados',
      ],
    },
  },

  // ── WELLNESS ───────────────────────────────────────────────────────────────
  {
    slug: 'reishi-adaptogen-guide',
    category: 'wellness',
    title: {
      en: 'Reishi as a Daily Adaptogen: Protocol and Expectations',
      es: 'Reishi como Adaptógeno Diario: Protocolo y Expectativas',
    },
    excerpt: {
      en: "Reishi is not a stimulant or a quick fix — it is a long-game adaptogen. Here's what it actually does, how to use it, and what timeline to expect.",
      es: 'El Reishi no es un estimulante ni una solución rápida — es un adaptógeno a largo plazo. Esto es lo que realmente hace, cómo usarlo y qué línea de tiempo esperar.',
    },
    readTime: 12,
    species: 'reishi',
    imageUrl: '',
    intro: {
      en: "An adaptogen is a compound that helps the body resist physical, chemical, and biological stress by modulating the HPA (hypothalamic-pituitary-adrenal) axis — the body's central stress-response system. Reishi (Ganoderma lucidum) is classified as a superior adaptogen not because it provides an acute energy boost, but because consistent long-term use strengthens the body's capacity to maintain homeostasis under stress. Think of it as training your stress-response system, not medicating it.",
      es: 'Un adaptógeno es un compuesto que ayuda al cuerpo a resistir el estrés físico, químico y biológico modulando el eje HPA — el sistema central de respuesta al estrés del cuerpo. El Reishi se clasifica como un adaptógeno superior porque el uso consistente a largo plazo fortalece la capacidad del cuerpo para mantener la homeostasis bajo estrés.',
    },
    sections: [
      {
        title: { en: "Reishi's Adaptogenic Compounds", es: 'Los compuestos adaptógenos del Reishi' },
        content: {
          en: "Ganoderic acids (triterpenoids unique to Ganoderma species) are the primary adaptogenic compounds in Reishi. They modulate cortisol secretion, inhibit the release of inflammatory cytokines triggered by stress, and support the adrenal glands. The polysaccharide fraction (primarily beta-glucans) provides separate immune-modulating effects. These two compound classes require different extraction methods — ganoderic acids dissolve in alcohol, beta-glucans dissolve in hot water — which is why a dual-extract product is necessary to capture the full adaptogenic profile.",
          es: 'Los ácidos ganodéricos (triterpenoides únicos de las especies Ganoderma) son los principales compuestos adaptógenos del Reishi. Modulan la secreción de cortisol, inhiben la liberación de citoquinas inflamatorias desencadenadas por el estrés y apoyan las glándulas suprarrenales. Los polisacáridos (principalmente beta-glucanos) proporcionan efectos inmunomoduladores separados.',
        },
      },
      {
        title: { en: 'Building a Daily Protocol', es: 'Construir un protocolo diario' },
        content: {
          en: "The most effective Reishi protocols use a dual-extract tincture or capsule at 500–1500mg daily, taken consistently — ideally at the same time each day. Morning use is common for overall adaptogenic support; some people prefer evening use because ganoderic acids have mild sedative properties that may improve sleep quality. Reishi powder in coffee or tea is a lower-cost option but typically delivers less of the alcohol-soluble triterpenoids unless you are using a pre-extracted powder. Avoid raw Reishi tea as a primary preparation — the bitter triterpenoids are not water-soluble and hot water alone does not extract them effectively.",
          es: 'Los protocolos más efectivos de Reishi usan una tintura o cápsula de doble extracción a 500-1500mg diarios, tomados consistentemente. El uso matutino es común para el apoyo adaptógeno general; algunas personas prefieren el uso nocturno porque los ácidos ganodéricos tienen propiedades sedantes leves que pueden mejorar la calidad del sueño.',
        },
      },
      {
        title: { en: 'What to Expect and When', es: 'Qué esperar y cuándo' },
        content: {
          en: "Unlike stimulants, Reishi does not produce a noticeable acute effect. First 2–4 weeks: most users notice nothing, or mild improvements in sleep quality and stress resilience. Weeks 4–8: clearer improvements in stress response, reduced anxiety reactivity, and more consistent energy levels throughout the day. Months 3–6+: the cumulative effects become most apparent — immune system resilience, sustained cortisol regulation, and improved overall wellbeing. Reishi is a long-term intervention, not a supplement to take for a week and evaluate.",
          es: 'A diferencia de los estimulantes, el Reishi no produce un efecto agudo notable. Primeras 2-4 semanas: la mayoría de los usuarios no notan nada, o mejoras leves en la calidad del sueño y la resiliencia al estrés. Semanas 4-8: mejoras más claras en la respuesta al estrés. Meses 3-6+: los efectos acumulativos se vuelven más aparentes.',
        },
      },
      {
        title: { en: 'Making Reishi Tea at Home', es: 'Hacer té de Reishi en casa' },
        content: {
          en: "If you are growing your own Reishi or have access to dried whole mushrooms, a simple hot water decoction captures the water-soluble beta-glucans: simmer 3–5 grams of dried Reishi slices in 500ml water for 30–45 minutes. The tea will be deeply brown and intensely bitter — that bitterness is the triterpenoids dissolving. Some is better than none, but hot water alone does not extract the full ganoderic acid profile. For a full-spectrum home extract, follow our dual-extraction guide (see the article on making dual-extract tinctures).",
          es: 'Si cultivas tu propio Reishi o tienes acceso a hongos secos enteros, una simple decocción de agua caliente captura los beta-glucanos solubles en agua: hierve 3-5 gramos de rebanadas de Reishi seco en 500ml de agua durante 30-45 minutos. El té será de color marrón oscuro e intensamente amargo.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Reishi is a long-game adaptogen — evaluate it after 3–6 months of daily use, not weeks",
        "Dual-extract products are necessary to capture both beta-glucans and ganoderic acids",
        "Evening use may improve sleep quality due to mild sedative triterpenoid properties",
        "Hot water tea alone does not extract the alcohol-soluble ganoderic acids effectively",
      ],
      es: [
        'El Reishi es un adaptógeno a largo plazo — evalúalo después de 3-6 meses de uso diario, no semanas',
        'Los productos de doble extracción son necesarios para capturar tanto beta-glucanos como ácidos ganodéricos',
        'El uso nocturno puede mejorar la calidad del sueño debido a las propiedades sedantes leves de los triterpenoides',
        'El té de agua caliente solo no extrae eficazmente los ácidos ganodéricos solubles en alcohol',
      ],
    },
  },
  {
    slug: 'maitake-blood-sugar',
    category: 'wellness',
    title: {
      en: 'Maitake D-Fraction and Blood Sugar: The Research',
      es: 'D-Fracción del Maitake y Azúcar en Sangre: La Investigación',
    },
    excerpt: {
      en: "Maitake is the only mushroom with published human clinical trials for blood sugar regulation. The D-fraction activates insulin receptors independently — here's what that means.",
      es: 'El Maitake es el único hongo con ensayos clínicos humanos publicados para la regulación del azúcar en sangre. La D-fracción activa los receptores de insulina de forma independiente.',
    },
    readTime: 10,
    species: 'maitake',
    imageUrl: '',
    intro: {
      en: "Most medicinal mushrooms support blood sugar indirectly through immune modulation or anti-inflammatory effects. Maitake (Grifola frondosa) is different: its D-fraction beta-glucan has been shown in controlled studies to activate insulin receptors on cell membranes independently of insulin itself — meaning cells can absorb glucose even when insulin signaling is impaired. This unique mechanism makes Maitake the most studied mushroom for type 2 diabetes support, metabolic syndrome, and PCOS.",
      es: 'La mayoría de los hongos medicinales apoyan el azúcar en sangre de forma indirecta. El Maitake es diferente: su beta-glucano D-fracción ha demostrado en estudios controlados activar los receptores de insulina de forma independiente a la insulina misma — lo que significa que las células pueden absorber glucosa incluso cuando la señalización de insulina está deteriorada.',
    },
    sections: [
      {
        title: { en: "The Discovery of D-Fraction", es: 'El descubrimiento de la D-fracción' },
        content: {
          en: "In the 1980s, Japanese researcher Dr. Hiroaki Nanba was studying Maitake's anti-tumor properties when he isolated a specific beta-1,3/1,6-glucan fraction he named the D-fraction (for its distinctive chromatography pattern). While testing its immunological effects, he observed unexpected blood glucose-lowering activity in diabetic mice — activity that was both rapid and sustained. Subsequent research revealed that the D-fraction binds to insulin receptors and facilitates glucose uptake through a pathway distinct from the normal insulin-receptor cascade, effectively bypassing the insulin resistance that characterizes type 2 diabetes.",
          es: 'En los años 80, el investigador japonés Dr. Hiroaki Nanba estaba estudiando las propiedades antitumorales del Maitake cuando aisló una fracción específica de beta-1,3/1,6-glucano que llamó la D-fracción. Mientras probaba sus efectos inmunológicos, observó una inesperada actividad reductora de glucosa en sangre en ratones diabéticos.',
        },
      },
      {
        title: { en: 'Human Clinical Evidence', es: 'Evidencia clínica en humanos' },
        content: {
          en: "A pilot study published in the Journal of Naturopathic Medicine gave Maitake D-fraction to 10 type 2 diabetic patients not currently on medication. After 2 weeks, fasting blood glucose dropped an average of 15–30% in responders. A larger study funded by the American Diabetes Association found that the SX-fraction (a refined version of D-fraction) reduced blood glucose in 75% of type 2 diabetic subjects over 4 weeks. Research at Memorial Sloan-Kettering Cancer Center documented significant immunological and metabolic effects in post-menopausal women with breast cancer who received Maitake D-fraction daily for 3 weeks.",
          es: 'Un estudio piloto publicado en el Journal of Naturopathic Medicine administró D-fracción de Maitake a 10 pacientes diabéticos tipo 2. Después de 2 semanas, la glucosa en sangre en ayunas bajó un promedio de 15-30% en los respondedores. Un estudio más amplio financiado por la American Diabetes Association encontró que la fracción SX redujo la glucosa en sangre en el 75% de los sujetos diabéticos tipo 2 durante 4 semanas.',
        },
      },
      {
        title: { en: 'Maitake and PCOS', es: 'Maitake y el SOP' },
        content: {
          en: "Polycystic Ovary Syndrome (PCOS) is characterized in part by insulin resistance — the same mechanism Maitake D-fraction addresses. A 2010 study compared Maitake extract to clomiphene (a common PCOS drug) in women with PCOS-related anovulation, finding comparable ovulation induction rates in both groups. For women with PCOS who prefer non-pharmaceutical options, Maitake's dual action on blood sugar and immune function makes it a frequently studied natural intervention — though it should be discussed with a healthcare provider before use.",
          es: 'El Síndrome de Ovario Poliquístico (SOP) se caracteriza en parte por la resistencia a la insulina — el mismo mecanismo que aborda la D-fracción del Maitake. Un estudio de 2010 comparó el extracto de Maitake con clomifeno (un medicamento común para el SOP) en mujeres con anovulación relacionada con el SOP, encontrando tasas de inducción de ovulación comparables en ambos grupos.',
        },
      },
      {
        title: { en: 'How to Use Maitake for Blood Sugar', es: 'Cómo usar el Maitake para el azúcar en sangre' },
        content: {
          en: "For blood sugar support, fresh or cooked Maitake (consumed as food) provides some benefit but lower concentrations of D-fraction than a standardized extract. Studies used D-fraction standardized extracts at 0.5–1mg per kg of body weight daily — roughly 35–70mg for a 70kg adult. Look for products standardized to D-fraction or listing beta-glucan content (aim for 30–40%). Monitor blood glucose if you are diabetic — Maitake can potentiate the effect of diabetes medications and may require dosage adjustment under medical supervision.",
          es: 'Para el apoyo al azúcar en sangre, el Maitake fresco o cocido proporciona algún beneficio pero concentraciones más bajas de D-fracción que un extracto estandarizado. Los estudios usaron extractos estandarizados de D-fracción a 0.5-1mg por kg de peso corporal diariamente. Monitorear la glucosa en sangre si eres diabético.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "D-fraction activates insulin receptors independently — uniquely effective for insulin resistance",
        "The most studied mushroom for type 2 diabetes — with published human clinical trials",
        "Monitor blood glucose if diabetic — may potentiate diabetes medications",
        "Standardized extracts deliver therapeutic doses more reliably than fresh mushroom consumption",
      ],
      es: [
        'La D-fracción activa los receptores de insulina de forma independiente — únicamente eficaz para la resistencia a la insulina',
        'El hongo más estudiado para la diabetes tipo 2 — con ensayos clínicos humanos publicados',
        'Monitorear la glucosa en sangre si eres diabético — puede potenciar los medicamentos para la diabetes',
        'Los extractos estandarizados entregan dosis terapéuticas de manera más confiable que el consumo de hongos frescos',
      ],
    },
  },
  {
    slug: 'making-dual-extract-tincture',
    category: 'wellness',
    title: {
      en: 'Making Your Own Dual-Extract Mushroom Tincture at Home',
      es: 'Cómo Hacer tu Propia Tintura de Doble Extracción de Hongos en Casa',
    },
    excerpt: {
      en: "A dual-extract tincture captures both water-soluble beta-glucans and alcohol-soluble triterpenoids — the full medicinal profile. Here's exactly how to make one.",
      es: 'Una tintura de doble extracción captura tanto los beta-glucanos solubles en agua como los triterpenoides solubles en alcohol — el perfil medicinal completo.',
    },
    readTime: 18,
    imageUrl: '',
    intro: {
      en: "Medicinal mushrooms contain two classes of compounds with very different chemical properties. Beta-glucans (polysaccharides responsible for immune modulation) are water-soluble and extracted through hot water decoction. Triterpenoids — the adaptogenic, anti-tumor, and anti-inflammatory compounds found in Reishi, Chaga, and Turkey Tail — are fat-soluble and only dissolve in alcohol. A dual-extract tincture runs both extractions and combines them, ensuring no compound class is left behind. Commercial-grade tinctures use exactly this method.",
      es: 'Los hongos medicinales contienen dos clases de compuestos con propiedades químicas muy diferentes. Los beta-glucanos (polisacáridos responsables de la modulación inmune) son solubles en agua y se extraen mediante decocción con agua caliente. Los triterpenoides son solubles en alcohol. Una tintura de doble extracción ejecuta ambas extracciones y las combina.',
    },
    sections: [
      {
        title: { en: 'What You Need', es: 'Qué necesitas' },
        content: {
          en: "Ingredients: 30g dried mushroom (Reishi, Turkey Tail, or Lion's Mane — each works with this method), 200ml high-proof grain alcohol or vodka (95% grain alcohol is ideal; 50–60% vodka works), 500ml filtered water. Equipment: a glass mason jar with lid, a medium saucepan, fine cheesecloth or muslin, a second glass jar, a dark glass dropper bottle for storage (amber glass blocks UV degradation). The total process takes about 6 weeks — mostly passive waiting time.",
          es: 'Ingredientes: 30g de hongo seco (Reishi, Cola de Pavo o Melena de León), 200ml de alcohol de grano de alta graduación o vodka (95% de alcohol de grano es ideal; el vodka al 50-60% funciona), 500ml de agua filtrada. El proceso total toma aproximadamente 6 semanas.',
        },
      },
      {
        title: { en: 'Step 1: Alcohol Extraction', es: 'Paso 1: Extracción con alcohol' },
        content: {
          en: "Break or grind your dried mushroom into smaller pieces — the more surface area exposed, the better. Place in the mason jar and cover completely with alcohol. Seal and store in a dark, room-temperature location for 4–6 weeks, shaking gently every few days. The alcohol draws out the fat-soluble triterpenoids and turns a deep amber-brown color. After 4–6 weeks, strain through cheesecloth, squeezing firmly to extract every drop. Reserve this alcohol extract (the marc — the spent mushroom material — is set aside for the next step).",
          es: 'Rompe o muele tu hongo seco en trozos más pequeños. Coloca en el frasco de vidrio y cubre completamente con alcohol. Sella y almacena en un lugar oscuro a temperatura ambiente durante 4-6 semanas, agitando suavemente cada pocos días. Después de 4-6 semanas, cuela a través de gasa.',
        },
      },
      {
        title: { en: 'Step 2: Hot Water Extraction', es: 'Paso 2: Extracción con agua caliente' },
        content: {
          en: "Take the strained marc (spent mushroom material from step 1) and place it in your saucepan with 500ml of filtered water. Simmer — not boil — for 45–60 minutes, keeping a lid on the pan to minimize evaporation. The water should turn deep brown. Strain through cheesecloth again, pressing firmly. You should have approximately 300–400ml of hot water extract. Allow to cool to room temperature. This extract contains your water-soluble beta-glucans and is the other half of your dual extract.",
          es: 'Toma el marc colado (material de hongo gastado del paso 1) y colócalo en tu cacerola con 500ml de agua filtrada. Hierve a fuego lento — no hirviendo — durante 45-60 minutos. El agua debe volverse marrón oscuro. Cuela nuevamente a través de gasa. Deberías tener aproximadamente 300-400ml de extracto de agua caliente.',
        },
      },
      {
        title: { en: 'Step 3: Combine and Store', es: 'Paso 3: Combinar y almacenar' },
        content: {
          en: "Combine the alcohol extract and the cooled water extract in a clean jar and stir well. The final tincture should be approximately 25–35% alcohol by volume — enough to preserve the water extract without destroying the compounds. Pour into dark glass dropper bottles. Properly stored (dark, cool, sealed), this tincture lasts 3–5 years. A standard dose is 1–2ml (20–40 drops) taken 1–2 times daily. Shake before each use as separation between the two extracts is normal.",
          es: 'Combina el extracto de alcohol y el extracto de agua enfriado en un frasco limpio y mezcla bien. La tintura final debe ser aproximadamente 25-35% alcohol en volumen. Vierte en botellas de vidrio oscuro con gotero. Una dosis estándar es 1-2ml (20-40 gotas) tomados 1-2 veces al día.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Hot water extracts beta-glucans; alcohol extracts triterpenoids — you need both",
        "Use the marc from the alcohol extraction for the hot water step — extract twice from the same material",
        "Final tincture should be 25–35% alcohol to preserve the combined extract",
        "Properly stored in dark glass, a dual-extract tincture lasts 3–5 years",
      ],
      es: [
        'El agua caliente extrae beta-glucanos; el alcohol extrae triterpenoides — necesitas ambos',
        'Usa el marc de la extracción de alcohol para el paso de agua caliente — extrae dos veces del mismo material',
        'La tintura final debe ser 25-35% alcohol para preservar el extracto combinado',
        'Almacenada adecuadamente en vidrio oscuro, una tintura de doble extracción dura 3-5 años',
      ],
    },
  },

  // ── KITCHEN ────────────────────────────────────────────────────────────────
  {
    slug: 'cooking-fresh-mushrooms',
    category: 'kitchen',
    title: {
      en: 'How to Cook Each Species: Techniques by Texture',
      es: 'Cómo Cocinar Cada Especie: Técnicas por Textura',
    },
    excerpt: {
      en: "Every mushroom species has a different texture, moisture content, and flavor — and each requires a different cooking approach. The golden rule: high heat, don't crowd the pan.",
      es: 'Cada especie de hongo tiene una textura, contenido de humedad y sabor diferente — y cada una requiere un enfoque de cocción diferente. La regla de oro: calor alto, no amontonar en la sartén.',
    },
    readTime: 8,
    imageUrl: 'https://images.unsplash.com/photo-1504545102780-26774c1bb073?w=1200&h=500&q=85&auto=format&fit=crop',
    intro: {
      en: "The most common mistake in cooking mushrooms is the same mistake for every species: low heat in a crowded pan. Mushrooms are 85–95% water by weight. When too many are placed in a pan that isn't hot enough, they release their water faster than it can evaporate, and the mushrooms steam instead of sear. Steamed mushrooms are rubbery and bland. Seared mushrooms — cooked in a hot, uncrowded pan — develop the Maillard reaction and produce the deep, savory, complex flavor that makes people compare mushrooms to meat.",
      es: 'El error más común al cocinar hongos es el mismo para todas las especies: calor bajo en una sartén llena. Los hongos son 85-95% agua en peso. Cuando se colocan demasiados en una sartén que no está suficientemente caliente, liberan su agua más rápido de lo que puede evaporarse, y los hongos se cuecen al vapor en lugar de sellarse.',
    },
    sections: [
      {
        title: { en: 'Oyster Mushrooms: Quick and Hot', es: 'Hongos Ostra: Rápido y Caliente' },
        content: {
          en: "Blue, Pink, and Yellow Oysters have a delicate, tender texture that overcooks quickly. Heat a pan (stainless or cast iron) over high heat until smoking. Add oil (not butter — it burns too fast at this stage), then add mushrooms in a single layer. Do not touch for 2 minutes — let them sear. Flip once, add butter and garlic, and cook 1–2 more minutes. Total cook time: 4–5 minutes. Season only at the end — salt draws out moisture. Pink Oyster: cook especially fast, 3 minutes maximum to preserve color. Yellow Oyster: same technique, pairs beautifully with soy sauce and sesame oil.",
          es: 'Las ostras Azul, Rosa y Amarilla tienen una textura delicada y tierna que se cocina demasiado rápido. Calienta una sartén a fuego alto hasta que humee. Agrega aceite, luego los hongos en una sola capa. No toques durante 2 minutos — déjalos sellar. Voltea una vez, agrega mantequilla y ajo, y cocina 1-2 minutos más. Tiempo total: 4-5 minutos.',
        },
      },
      {
        title: { en: "Shiitake: Building Umami", es: 'Shiitake: Construyendo Umami' },
        content: {
          en: "Shiitake has more moisture than oysters and benefits from a slightly longer cook time. Always remove the tough stems before cooking (save them for stock — they are packed with umami compounds). Slice caps thick (1cm) so they don't disappear in the pan. Cook in sesame oil over medium-high heat for 5–7 minutes, stirring occasionally. The mushrooms should shrink by about half and develop a rich golden-brown color. Finish with soy sauce, mirin, and a splash of sake for an authentic preparation. Dried Shiitake should be rehydrated in warm water for 20 minutes — the soaking liquid is liquid gold for stocks and sauces.",
          es: 'El Shiitake tiene más humedad que las ostras y se beneficia de un tiempo de cocción ligeramente más largo. Siempre retira los tallos duros antes de cocinar. Corta los sombreros gruesos (1cm). Cocina en aceite de sésamo a fuego medio-alto durante 5-7 minutos. Termina con salsa de soya, mirin y un toque de sake.',
        },
      },
      {
        title: { en: "Lion's Mane: Treat It Like a Steak", es: "Melena de León: Trátala como un Filete" },
        content: {
          en: "Lion's Mane has the highest moisture content of any cultivated mushroom — and its seafood-like flavor and lobster-like texture are only realized when that moisture is properly driven out. Slice into 2cm thick slabs (not pulled apart — keep it intact for a better sear). Press between paper towels for 10 minutes to remove surface moisture. Heat cast iron until smoking, add oil, and sear without moving for 3 minutes. Flip, add butter and thyme, baste for 2 minutes. The outside should be golden-brown and slightly crispy, the interior soft and moist. This preparation makes Lion's Mane genuinely impressive to non-mushroom-eaters.",
          es: 'La Melena de León tiene el mayor contenido de humedad de cualquier hongo cultivado — y su sabor a mariscos y textura solo se realizan cuando esa humedad se elimina correctamente. Corta en losas de 2cm. Presiona entre toallas de papel durante 10 minutos. Calienta el hierro fundido hasta que humee, agrega aceite y sella sin mover durante 3 minutos.',
        },
      },
      {
        title: { en: 'Drying and Preserving Your Harvest', es: 'Secar y Preservar tu Cosecha' },
        content: {
          en: "When you have a large flush, drying is the best preservation method. Slice mushrooms 5mm thin and dry in a food dehydrator at 115°F (45°C) for 4–6 hours, or in an oven on the lowest setting with the door slightly ajar for 2–3 hours. Mushrooms are fully dry when they snap cleanly rather than bend. Dried mushrooms concentrate their umami compounds and keep for 12 months in a sealed jar. To rehydrate: cover with warm (not boiling) water for 15–20 minutes. Use the soaking liquid — it contains the most flavor.",
          es: 'Cuando tienes un flush grande, secar es el mejor método de conservación. Corta los hongos de 5mm de grosor y seca en un deshidratador de alimentos a 45°C durante 4-6 horas. Los hongos están completamente secos cuando se rompen limpiamente en lugar de doblarse. Duran 12 meses en un frasco sellado.',
        },
      },
    ],
    keyTakeaways: {
      en: [
        "High heat + uncrowded pan = sear, not steam — the single most important rule",
        "Salt only at the end — it draws out moisture during cooking",
        "Shiitake stems are too tough to eat but make excellent stock — never discard them",
        "Dried mushrooms concentrate umami — the soaking liquid is as valuable as the mushroom itself",
      ],
      es: [
        'Calor alto + sartén sin amontonar = sellar, no cocinar al vapor — la regla más importante',
        'Sal solo al final — extrae humedad durante la cocción',
        'Los tallos de Shiitake son demasiado duros para comer pero hacen un excelente caldo — nunca los descartes',
        'Los hongos secos concentran umami — el líquido de remojo es tan valioso como el hongo mismo',
      ],
    },
  },
]

export const ARTICLES_MAP: Record<string, LearnArticle> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a])
)
