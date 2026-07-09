'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { CultivationSpecs } from '@/components/shop/CultivationSpecs'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

const PRODUCTS: Record<string, Product> = {
  'blue-oyster-grain-spawn': {
    id: '1', slug: 'blue-oyster-grain-spawn',
    name: { en: 'Blue Oyster Grain Spawn', es: 'Spawn de Grano Ostra Azul' },
    description: { en: 'Premium Blue Oyster grain spawn on sterilized rye berries. Lab-tested for contamination, certified organic, and ready to inoculate any hardwood substrate. Each bag contains vigorous, fully-colonized mycelium ready to transfer.\n\nOur spawn is produced in a positive-pressure laboratory environment with HEPA filtration. Each batch is tested for contaminants before shipping.', es: 'Spawn de grano premium de Ostra Azul en bayas de centeno esterilizadas. Probado en laboratorio para contaminación, certificado orgánico.' },
    category: 'spawn', subcategory: 'Grain Spawn', species: 'blue-oyster',
    price: 1499, compareAtPrice: 1999,
    variants: [
      { id: 'v1-sm', name: '1 lb', price: 1499, stock: 50, sku: 'BOS-1LB' },
      { id: 'v1-md', name: '5 lbs', price: 5999, stock: 30, sku: 'BOS-5LB' },
      { id: 'v1-lg', name: '10 lbs', price: 9999, stock: 15, sku: 'BOS-10LB' },
    ],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '1–3 flushes, 25% biological efficiency', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster', 'organic'], relatedProducts: ['beginners-grow-kit-bundle'],
  },
}

const LC_HOW_TO_USE_STEPS = [
  'Remove syringe from refrigerator 1–2 hours before use to warm to room temperature.',
  'Shake gently to suspend the mycelium uniformly throughout the nutrient broth.',
  'Sterilize the injection port of your grain bag or jar lid with the included alcohol swab. Let dry.',
  'Insert the 16G needle and inject 1–2cc per pound of grain substrate.',
  'Recap the needle. Refrigerate remaining culture — shelf life up to 2 months refrigerated.',
  'Incubate at 70–75°F away from direct light. Agitate the bag gently after 3–5 days to redistribute mycelium.',
  'Expect full colonization in 5–10 days. Transfer to bulk substrate once grain is fully colonized.',
]

const CORDYCEPS_HOW_TO_USE_STEPS = [
  'Remove syringe from refrigerator 1–2 hours before use to warm to room temperature.',
  'Shake gently to suspend the mycelium uniformly throughout the nutrient broth.',
  'Sterilize the injection port of your grain jar or bag with the included alcohol swab. Let dry completely.',
  'Inject 1–2cc per pound of sterilized cooked grain (wheat berries, brown rice, or rye berries work best).',
  'Incubate at 65–72°F in darkness for 14–21 days until grain is fully colonized white with mycelium.',
  'Transfer to Cordyceps fruiting conditions: 60–75°F, 85–95% humidity, 12h light/dark cycle — light triggers stroma formation.',
  'Vivid orange club-shaped stromata develop over 30–60 days. Harvest when tips show bright orange and before spores release.',
]

const LC_PRODUCTS: Record<string, Product> = {
  'lions-mane-liquid-culture': {
    id: 'lc1', slug: 'lions-mane-liquid-culture',
    name: { en: "Lion's Mane Liquid Culture Syringe", es: 'Jeringa de Cultivo Líquido Melena de León' },
    description: {
      en: "The only mushroom on Earth that stimulates Nerve Growth Factor (NGF) — the protein your brain needs to grow and repair neurons. shrooms Culture Bank — 10cc of lab-isolated Hericium erinaceus mycelium in nutrient broth, selected for dense pom-pom formation and vigorous colonization.\n\nColonizes supplemented hardwood grain in 5–10 days — up to 3× faster than spores. Yields 200–400g per flush on supplemented hardwood blocks. Fruit at 65–75°F with 90–95% humidity and strong fresh air exchange. CO2 buildup causes icicle-form instead of the classic pom-pom — a sign to increase FAE.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El único hongo del mundo que estimula el Factor de Crecimiento Nervioso (NGF) — la proteína que tu cerebro necesita para crecer y reparar neuronas. shrooms Culture Bank — 10cc de micelio de Hericium erinaceus aislado en laboratorio, seleccionado para formación de pompón denso y colonización vigorosa.\n\nColoniza grano de madera dura suplementada en 5–10 días — hasta 3× más rápido que esporas. Rinde 200–400g por flush. Fructificar a 18–24°C con 90–95% humedad y buen intercambio de aire fresco.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'lions-mane',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc1v', name: '10cc', price: 1799, stock: 40, sku: 'LML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'lions-mane'], relatedProducts: ['lions-mane-fruiting-block'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'blue-oyster-liquid-culture': {
    id: 'lc2', slug: 'blue-oyster-liquid-culture',
    name: { en: 'Blue Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Azul' },
    description: {
      en: "The benchmark beginner species — and the one professional growers keep coming back to. Pleurotus ostreatus is the most forgiving edible mushroom in cultivation: tolerates temperature swings, thrives on cheap substrates, and produces 3–4 dense flushes with 25%+ biological efficiency on hardwood. shrooms Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for aggressive colonization and high pin density.\n\nColonizes grain in 5–10 days. Fruit at 55–65°F with 85–95% humidity. Grows on hardwood sawdust, straw, or coffee grounds. First pins appear 7–14 days after fruiting conditions are introduced.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "La especie referencia para principiantes — y la que los cultivadores profesionales siguen usando. Pleurotus ostreatus es el hongo comestible más indulgente en cultivo: tolera cambios de temperatura, prospera en sustratos económicos y produce 3–4 flushes densos con 25%+ de eficiencia biológica. shrooms Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para colonización agresiva y alta densidad de pines.\n\nColoniza grano en 5–10 días. Fructificar a 13–18°C con 85–95% humedad.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'blue-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc2v', name: '10cc', price: 1799, stock: 50, sku: 'BOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: ['blue-oyster-grain-spawn'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'pink-oyster-liquid-culture': {
    id: 'lc3', slug: 'pink-oyster-liquid-culture',
    name: { en: 'Pink Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Rosa' },
    description: {
      en: "The fastest pinning edible mushroom in cultivation — and the most dramatic. Pleurotus djamor produces vivid magenta-pink clusters that appear within 5 days of fruiting conditions and double in size every 12 hours. Harvest before the edges begin to wave. shrooms Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for intense color retention and explosive pin density.\n\nColonizes grain in 5–10 days. Loves warmth (75–85°F) — thrives in subtropical home environments without climate control. High humidity (85–90%) tent recommended. From inoculation to first harvest in as little as 3–4 weeks total.\n\nNote: the dramatic pink color fades with heat when cooking — harvest young and cook quickly for best color and flavor.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo comestible con el pinado más rápido en cultivo — y el más dramático. Pleurotus djamor produce racimos magenta-rosados vibrantes que aparecen a los 5 días de las condiciones de fructificación y duplican tamaño cada 12 horas. shrooms Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para retención de color intenso y alta densidad de pines.\n\nColoniza grano en 5–10 días. Le encanta el calor (24–29°C). De inoculación a primera cosecha en tan solo 3–4 semanas.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'pink-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc3v', name: '10cc', price: 1799, stock: 40, sku: 'POL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust, sugarcane bagasse', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'yellow-oyster-liquid-culture': {
    id: 'lc4', slug: 'yellow-oyster-liquid-culture',
    name: { en: 'Golden Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Dorada' },
    description: {
      en: "Sunlight in mushroom form — and the Oyster species with the highest ergothioneine content. Ergothioneine is a potent antioxidant synthesized only by fungi and certain bacteria; it concentrates in human mitochondria and protects against oxidative damage linked to aging and neurodegeneration. Pleurotus citrinopileatus also contains mevinolin (a natural lovastatin analog) for cholesterol balance.\n\nshrooms Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for vivid golden-yellow coloration and tight, ruffled cluster formation. Colonizes grain in 5–10 days. Requires strong fresh air exchange — CO2 buildup causes long stems and small caps. Fruit at 64–77°F with 85–90% humidity.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "Luz del sol en forma de hongo — y la especie de Ostra con mayor contenido de ergotionina. La ergotionina es un potente antioxidante sintetizado solo por hongos que se concentra en las mitocondrias humanas y protege contra el daño oxidativo ligado al envejecimiento. shrooms Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para color dorado intenso y formación de racimos compactos.\n\nColoniza grano en 5–10 días. Requiere buen intercambio de aire fresco. Fructificar a 18–25°C con 85–90% humedad.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'yellow-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc4v', name: '10cc', price: 1799, stock: 35, sku: 'YOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'reishi-liquid-culture': {
    id: 'lc5', slug: 'reishi-liquid-culture',
    name: { en: 'Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi' },
    description: {
      en: "The most clinically researched medicinal mushroom on Earth. Over 2,000 years in Chinese pharmacopoeia. 400+ identified bioactive compounds including ganoderic acids (triterpenoids), beta-glucan polysaccharides, and immunomodulating proteins. Clinical evidence supports: immune modulation, anti-tumor activity, cortisol regulation, blood pressure reduction, liver protection, and anti-anxiety effects.\n\nshrooms Culture Bank — 10cc of lab-isolated Ganoderma lucidum mycelium in nutrient broth, selected for high triterpenoid content and reliable fruiting body formation. Colonizes grain in 5–10 days; full development to harvest takes 90–120 days — this is not a fast grow. Patience is the primary skill required.\n\nThe lacquered red-orange fruiting body is too bitter and woody to eat — best processed as a dual-extract tincture (water + alcohol) to capture both beta-glucans and triterpenoids. Not recommended for beginners.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo medicinal más investigado clínicamente del mundo. Más de 2,000 años en la farmacopea china. 400+ compuestos bioactivos identificados incluyendo ácidos ganodéricos, polisacáridos beta-glucanos y proteínas inmunomoduladoras. Evidencia clínica: modulación inmune, actividad antitumoral, regulación de cortisol, reducción de presión arterial, protección hepática y efectos ansiolíticos.\n\nshrooms Culture Bank — 10cc de micelio de Ganoderma lucidum aislado en laboratorio, seleccionado para alto contenido de triterpenoides. Coloniza grano en 5–10 días; desarrollo completo a cosecha tarda 90–120 días. No recomendado para principiantes.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc5v', name: '10cc', price: 1799, stock: 30, sku: 'REL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi'], relatedProducts: ['reishi-dual-extract-tincture'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'shiitake-liquid-culture': {
    id: 'lc6', slug: 'shiitake-liquid-culture',
    name: { en: 'Shiitake Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Shiitake' },
    description: {
      en: "The umami king — cultivated for over 1,000 years in East Asia and the only edible mushroom with an FDA Orphan Drug designation (lentinan, for cancer immunotherapy). Lentinula edodes also contains eritadenine (lowers LDL cholesterol) and AHCC — a compound used in Japanese hospitals alongside chemotherapy.\n\nshrooms Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for thick caps, dense gills, and the rich smoky flavor profile chefs demand. Colonizes grain in 5–10 days. Two paths from here: sawdust blocks yield first pins in 8–12 weeks; oak logs colonize over 6–12 months and then produce perennial flushes for 3–5 years with dramatically superior flavor and texture.\n\nPro tip: trigger fruiting with a cold-shock soak (50°F water for 12–24 hours) once substrate is fully colonized.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El rey del umami — cultivado durante más de 1,000 años en Asia Oriental y el único hongo comestible con designación de Medicamento Huérfano FDA (lentinan). shrooms Culture Bank — 10cc de micelio de Lentinula edodes aislado en laboratorio, seleccionado para sombreros gruesos y el perfil de sabor umami ahumado que exigen los chefs.\n\nColoniza grano en 5–10 días. En bloques de aserrín: primeros pines en 8–12 semanas. En troncos de roble: cosecha perenne 3–5 años con sabor y textura superiores. Pro tip: detonar fructificación con baño frío (10°C por 12–24 horas).\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'shiitake',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc6v', name: '10cc', price: 1799, stock: 45, sku: 'SHL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust blocks or oak logs', expectedYield: 'Multiple flushes (perennial on logs)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'liquid-culture', 'shiitake'], relatedProducts: ['shiitake-log-kit'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
  'cordyceps-militaris-liquid-culture': {
    id: 'lc7', slug: 'cordyceps-militaris-liquid-culture',
    name: { en: 'Cordyceps Militaris Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Cordyceps Militaris' },
    description: {
      en: "The athlete's mushroom — and the only cultivatable alternative to wild Ophiocordyceps sinensis, which trades at $20,000 per kg on Asian markets. Cordyceps militaris produces the same key bioactives (cordycepin, adenosine) through a completely sustainable lab process, with no wild harvesting required.\n\nCordycepin mimics adenosine in the body, increasing ATP production at the cellular level. Randomized trials show improvements in VO2 max, time to exhaustion, and lactate clearance in trained athletes. Also studied for immune modulation, kidney protection, and libido support.\n\nshrooms Culture Bank — 10cc of lab-isolated C. militaris mycelium in nutrient broth, selected for high cordycepin production and vivid orange stroma formation. Colonizes cooked grain in 14–21 days — slower than Oysters but worth the wait. Requires a 12h light/dark cycle during fruiting to trigger stroma development.\n\nWarning: Cordyceps is an advanced grow with strict environmental requirements. Not recommended as a first species.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo del atleta — y la única alternativa cultivable al Ophiocordyceps sinensis silvestre, que se comercializa a $20,000 por kg en mercados asiáticos. Cordyceps militaris produce los mismos bioactivos clave (cordycepina, adenosina) mediante un proceso de laboratorio completamente sostenible.\n\nLa cordycepina mimetiza la adenosina en el cuerpo, aumentando la producción de ATP celular. Ensayos aleatorios muestran mejoras en VO2 máx, tiempo hasta el agotamiento y aclaramiento de lactato en atletas entrenados.\n\nshrooms Culture Bank — 10cc de micelio de C. militaris aislado en laboratorio, seleccionado para alta producción de cordycepina y formación de estromatos naranjas vibrantes. Coloniza grano cocido en 14–21 días. Requiere ciclo luz/oscuridad 12h para detonar la formación de estromatos.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'cordyceps',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc7v', name: '10cc', price: 1799, stock: 25, sku: 'CML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '14–21 days (on grain/rice)', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Cooked grain (wheat berries, brown rice)', expectedYield: '50–150g dry per substrate', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'cordyceps', 'performance'], relatedProducts: [],
    howToUseSteps: CORDYCEPS_HOW_TO_USE_STEPS,
  },
  'antler-reishi-liquid-culture': {
    id: 'lc8', slug: 'antler-reishi-liquid-culture',
    name: { en: 'Antler Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi Antler' },
    description: {
      en: "Ganoderma lucidum — deliberately grown under elevated CO2 to produce dramatic antler and stag-horn shaped fruiting bodies instead of the classic kidney-shaped cap. Same species. Same 400+ bioactive compounds: ganoderic acids, beta-glucan polysaccharides, immunomodulating proteins. Different form factor — and a completely different growing experience.\n\nThe antler form is prized by tincture makers for its increased surface area (more exposed tissue per gram), easier processing, and striking visual presentation for display or gifting. Higher CO2 during the full fruiting cycle suppresses cap formation and drives vertical antler growth — managing this precisely is what makes this grow uniquely satisfying for advanced cultivators.\n\nshrooms Culture Bank — 10cc of lab-isolated Ganoderma lucidum mycelium in nutrient broth, grown under our antler-cultivation protocol. Colonizes grain in 5–10 days. Maintain CO2 above 5,000 ppm throughout fruiting by limiting fresh air exchange — the opposite of most species.\n\nNote: if FAE is too high, the culture will revert to cap formation. Advanced growers only.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "Ganoderma lucidum cultivado bajo CO2 elevado — produciendo dramáticos cuerpos fructificantes en forma de asta y cuerno de ciervo en lugar del clásico sombrero renal. La misma especie. Los mismos 400+ compuestos bioactivos. Diferente forma — y una experiencia de cultivo completamente distinta.\n\nLa forma antler es apreciada por los fabricantes de tinturas por su mayor superficie (más tejido expuesto por gramo) y presentación visual impactante. Mantener CO2 por encima de 5,000 ppm durante toda la fructificación limitando el intercambio de aire — lo opuesto a la mayoría de las especies.\n\nshrooms Culture Bank — 10cc de micelio de Ganoderma lucidum aislado en laboratorio, producido bajo nuestro protocolo de cultivo antler. Solo cultivadores avanzados.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc8v', name: '10cc', price: 1799, stock: 20, sku: 'ARL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi', 'antler'], relatedProducts: ['reishi-liquid-culture', 'reishi-dual-extract-tincture'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
  },
}

const TABS = ['description', 'howToUse', 'science', 'reviews'] as const

export default function ProductPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const product = PRODUCTS[params.slug] ?? LC_PRODUCTS[params.slug]
  if (!product) notFound()

  const { addItem, openCart } = useCartStore()

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('description')
  const [showSticky, setShowSticky] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const ctaRef = useRef<HTMLDivElement>(null)
  const magnetBtnRef = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 350, damping: 22 })
  const springY = useSpring(my, { stiffness: 350, damping: 22 })

  const handleMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  const handleMagnetLeave = () => { mx.set(0); my.set(0) }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name[locale],
      price: selectedVariant.price,
      quantity,
      image: product.images[0] ?? '',
    })
    openCart()
  }

  const handleRipple = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700)
  }

  useEffect(() => {
    const el = ctaRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const name = product.name[locale]
  const description = product.description[locale]
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > selectedVariant.price

  return (
    <>
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-cream-muted mb-8">
          <Link href="/shop" className="hover:text-cream transition-colors">{t('breadcrumb.shop')}</Link>
          <span>›</span>
          <span className="capitalize">{product.subcategory}</span>
          <span>›</span>
          <span className="text-cream">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} alt={name} />
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              {product.species && (
                <p className="font-mono-lab text-sm text-cream-muted italic mb-2">
                  {product.species.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </p>
              )}
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream">{name}</h1>

              {/* Rating placeholder */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-warning text-sm">★</span>
                  ))}
                </div>
                <span className="text-sm text-cream-muted">4.9 (127 {t('reviews')})</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="font-body text-4xl font-bold tracking-tight text-cream">{formatPrice(selectedVariant.price)}</span>
                {hasDiscount && (
                  <span className="text-xl text-cream-muted/50 line-through font-normal">{formatPrice(product.compareAtPrice!)}</span>
                )}
              </div>
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-wider">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Save {Math.round((1 - selectedVariant.price / product.compareAtPrice!) * 100)}% — Launch price
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 1 && (
              <div>
                <p className="text-sm text-cream-muted mb-2">{t('variant')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        selectedVariant.id === v.id
                          ? 'border-accent bg-accent/10 text-accent'
                          : 'border-ds-border text-cream-muted hover:border-accent/50 hover:text-cream'
                      }`}
                    >
                      {v.name} — {formatPrice(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm text-cream-muted mb-2">{t('quantity')}</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-ds-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-cream-muted hover:text-cream hover:bg-elevated transition-colors text-lg"
                  >−</button>
                  <span className="px-6 py-3 text-cream font-medium min-w-[4rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-cream-muted hover:text-cream hover:bg-elevated transition-colors text-lg"
                  >+</button>
                </div>
                <span className="text-sm text-cream-muted">{selectedVariant.stock} in stock</span>
              </div>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3">
              <motion.div
                ref={magnetBtnRef}
                className="flex-1 relative overflow-hidden rounded-full"
                style={{ x: springX, y: springY }}
                onMouseMove={handleMagnetMove}
                onMouseLeave={handleMagnetLeave}
                onClick={(e) => { handleRipple(e); handleAddToCart() }}
              >
                <Button fullWidth size="lg" disabled={!product.inStock}>
                  {product.inStock ? `${t('addToCart')} — ${formatPrice(selectedVariant.price * quantity)}` : tc('outOfStock')}
                </Button>
                {ripples.map(r => (
                  <motion.span
                    key={r.id}
                    className="absolute rounded-full bg-white/25 pointer-events-none"
                    style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                    initial={{ width: 0, height: 0, opacity: 0.7 }}
                    animate={{ width: 320, height: 320, opacity: 0 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                  />
                ))}
              </motion.div>
              <Button variant="outline" size="lg" className="sm:w-auto">
                ♡ {t('addToWishlist')}
              </Button>
            </div>

            {/* LC packet contents */}
            {product.subcategory === 'Liquid Culture' && (
              <div className="rounded-2xl border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the packet</p>
                </div>
                <div className="grid grid-cols-4 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '10cc\nSyringe',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z"/><path d="M12 6.5l5 5"/></svg>,
                    },
                    {
                      label: '16G\nNeedle',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><path d="M15 5h4v4"/></svg>,
                    },
                    {
                      label: 'Alcohol\nSwab',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="7"/><path d="M9 12h6m-3-3v6"/></svg>,
                    },
                    {
                      label: 'Instruction\nCard',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="7" y1="13" x2="13" y2="13"/></svg>,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 28, scale: 0.88 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-5% 0px' }}
                      transition={{ delay: i * 0.14, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center gap-2 py-4 px-1"
                    >
                      <div className="text-accent/50">{item.icon}</div>
                      <p className="font-mono text-[8px] uppercase tracking-wider text-cream-muted/60 text-center whitespace-pre-line leading-relaxed">{item.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-5 py-4 border-t border-ds-border">
              {[
                {
                  label: t('trustOrganic'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                },
                {
                  label: t('trustShipping'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
                },
                {
                  label: t('trustGuarantee'),
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
                },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-cream-muted">
                  <span className="text-accent/60">{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>

            {/* Cultivation Specs */}
            {product.cultivationSpecs && (
              <CultivationSpecs specs={product.cultivationSpecs} />
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-ds-border mb-8">
            <div className="flex gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-accent text-accent'
                      : 'border-transparent text-cream-muted hover:text-cream'
                  }`}
                >
                  {t(`tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    {description.split('\n\n').map((para, i) => (
                      <p key={i} className="text-cream-muted leading-relaxed">{para}</p>
                    ))}
                  </div>
                )}
                {activeTab === 'howToUse' && (
                  <div className="space-y-3">
                    {(product.howToUseSteps ?? [
                      'Sterilize your substrate (hardwood sawdust bags work best).',
                      'Allow substrate to cool to room temperature before inoculating.',
                      'In a sterile environment, mix grain spawn into substrate at 10–20% rate.',
                      'Seal bag and colonize at 70–75°F for 2–3 weeks until fully white.',
                      'Introduce fruiting conditions: fresh air exchange + 85–95% humidity.',
                      'Harvest mushrooms just as the veil begins to separate from the cap edges.',
                    ]).map((step, i) => (
                      <div key={i} className="flex gap-4 items-start">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 border border-accent/20 text-accent font-mono text-[10px] flex items-center justify-center mt-0.5">{i + 1}</span>
                        <p className="text-cream-muted leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'science' && (
                  <div className="space-y-4 text-cream-muted">
                    <p>Pleurotus ostreatus produces significant quantities of lovastatin, a natural statin compound. Research indicates 30% dry weight protein content with all essential amino acids.</p>
                    <p>Beta-glucan content: 25–30% dry weight (primarily β-1,3 and β-1,6 glucans). These compounds are primary immunomodulators and have been studied extensively for their therapeutic potential.</p>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <p className="text-cream-muted">Reviews coming soon. Be the first to leave a review.</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>

    {/* Sticky CTA */}
    <AnimatePresence>
      {showSticky && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-xl border-t border-ds-border"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-body font-semibold text-cream text-sm truncate">{name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-accent font-bold text-sm">{formatPrice(selectedVariant.price)}</span>
                {hasDiscount && (
                  <span className="text-xs text-cream-muted/45 line-through">{formatPrice(product.compareAtPrice!)}</span>
                )}
              </div>
            </div>
            <Button size="md" disabled={!product.inStock} className="flex-shrink-0" onClick={handleAddToCart}>
              {product.inStock ? t('addToCart') : tc('outOfStock')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
}
