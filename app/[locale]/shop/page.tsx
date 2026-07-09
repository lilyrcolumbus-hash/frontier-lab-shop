'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

const PRODUCTS: Product[] = [
  {
    id: '1', slug: 'blue-oyster-grain-spawn',
    name: { en: 'Blue Oyster Grain Spawn', es: 'Spawn de Grano Ostra Azul' },
    description: { en: 'Premium Blue Oyster grain spawn on sterilized rye berries. Lab-tested, certified organic.', es: 'Spawn de grano premium de Ostra Azul en bayas de centeno esterilizadas.' },
    category: 'spawn', subcategory: 'Grain Spawn', species: 'blue-oyster',
    price: 1499, compareAtPrice: 1999,
    variants: [{ id: 'v1', name: 'Standard', price: 1499, stock: 50, sku: 'BOS-STD' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '1–3 flushes', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster'], relatedProducts: [],
  },
  {
    id: '2', slug: 'lions-mane-fruiting-block',
    name: { en: "Lion's Mane Fruiting Block", es: 'Bloque Fructificante Melena de León' },
    description: { en: "Ready-to-fruit Lion's Mane block. Fully colonized — open and mist.", es: 'Bloque de Melena de León listo para fructificar. Completamente colonizado.' },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'lions-mane',
    price: 3499, compareAtPrice: undefined,
    variants: [{ id: 'v2', name: 'Standard', price: 3499, stock: 25, sku: 'LMB-STD' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Already colonized', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood', expectedYield: '200–400g', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'kit'], relatedProducts: [],
  },
  {
    id: '3', slug: 'beginners-grow-kit-bundle',
    name: { en: "Beginner's Complete Grow Kit", es: 'Kit de Cultivo Completo para Principiantes' },
    description: { en: "Everything to grow your first mushrooms: spawn, substrate, dome, mister, and guide.", es: 'Todo lo que necesitas para tu primer cultivo: spawn, sustrato, cúpula, atomizador y guía.' },
    category: 'bundle', subcategory: 'Beginner Bundles', species: 'blue-oyster',
    price: 4999, compareAtPrice: 6999,
    variants: [{ id: 'v3', name: 'Standard', price: 4999, stock: 30, sku: 'BKT-STD' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Included', expectedYield: '150–300g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'bundle', 'best-seller'], relatedProducts: [],
  },
  {
    id: '4', slug: 'shiitake-log-kit',
    name: { en: 'Shiitake Log Inoculation Kit', es: 'Kit de Inoculación de Tronco Shiitake' },
    description: { en: 'Grow Shiitake on oak logs. Includes plug spawn, wax, and full guide. Produces 3–5 years.', es: 'Cultiva Shiitake en troncos de roble. Incluye spawn en tacos, cera y guía completa.' },
    category: 'kit', subcategory: 'Log Kits', species: 'shiitake',
    price: 2999, compareAtPrice: undefined,
    variants: [{ id: 'v4', name: 'Standard', price: 2999, stock: 40, sku: 'SLK-STD' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '6–12 months on logs', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Oak logs', expectedYield: 'Perennial', indoorOutdoor: 'outdoor' },
    isOrganic: true, inStock: true, tags: ['shiitake', 'outdoor'], relatedProducts: [],
  },
  {
    id: '5', slug: 'reishi-dual-extract-tincture',
    name: { en: 'Reishi Dual-Extract Tincture', es: 'Tintura de Doble Extracción de Reishi' },
    description: { en: '2oz dual-extract tincture. Organic Ganoderma lucidum fruiting bodies. 50:1 concentration.', es: 'Tintura de doble extracción de 60ml. Cuerpos fructificantes orgánicos de Ganoderma lucidum. Concentración 50:1.' },
    category: 'wellness', subcategory: 'Tinctures',
    price: 3999, compareAtPrice: undefined,
    variants: [{ id: 'v5', name: '2oz', price: 3999, stock: 60, sku: 'RDT-2OZ' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['reishi', 'wellness', 'tincture'], relatedProducts: [],
  },
  // ── Liquid Culture Syringes ──────────────────────────────────────────────
  {
    id: 'lc1', slug: 'lions-mane-liquid-culture',
    name: { en: "Lion's Mane Liquid Culture Syringe", es: 'Jeringa de Cultivo Líquido Melena de León' },
    description: {
      en: "The only mushroom that stimulates Nerve Growth Factor (NGF). shrooms Culture Bank — lab-isolated Hericium erinaceus, 10cc. Colonizes supplemented hardwood grain in 5–10 days. Yields 200–400g per flush. 16G needle + alcohol swab included.",
      es: "El único hongo que estimula el Factor de Crecimiento Nervioso (NGF). shrooms Culture Bank — Hericium erinaceus aislado en laboratorio, 10cc. Coloniza en 5–10 días. Rinde 200–400g por flush. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'lions-mane',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc1v', name: '10cc', price: 1799, stock: 40, sku: 'LML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'lions-mane'], relatedProducts: [],
  },
  {
    id: 'lc2', slug: 'blue-oyster-liquid-culture',
    name: { en: 'Blue Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Azul' },
    description: {
      en: "The benchmark beginner species — and the one professionals keep growing. shrooms Culture Bank — lab-isolated Pleurotus ostreatus, 10cc. 25%+ biological efficiency on hardwood. 3–4 dense flushes over 8 weeks. 16G needle + alcohol swab included.",
      es: "La especie referencia para principiantes — y la que los profesionales siguen cultivando. shrooms Culture Bank — Pleurotus ostreatus aislado en laboratorio, 10cc. 25%+ eficiencia biológica en madera dura. 3–4 flushes densos en 8 semanas. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'blue-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc2v', name: '10cc', price: 1799, stock: 50, sku: 'BOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
  },
  {
    id: 'lc3', slug: 'pink-oyster-liquid-culture',
    name: { en: 'Pink Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Rosa' },
    description: {
      en: "Fastest pinning edible mushroom in cultivation. shrooms Culture Bank — lab-isolated Pleurotus djamor, 10cc. First pins within 5 days of fruiting conditions. Vivid magenta clusters that double in size every 12 hours. 16G needle + alcohol swab included.",
      es: "El hongo comestible de pinado más rápido en cultivo. shrooms Culture Bank — Pleurotus djamor aislado en laboratorio, 10cc. Primeros pines en 5 días de fructificación. Racimos magenta vibrantes que duplican tamaño cada 12 horas. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'pink-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc3v', name: '10cc', price: 1799, stock: 40, sku: 'POL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust, sugarcane bagasse', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
  },
  {
    id: 'lc4', slug: 'yellow-oyster-liquid-culture',
    name: { en: 'Golden Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Dorada' },
    description: {
      en: "Highest ergothioneine content of any Oyster species — the mitochondria-protective antioxidant synthesized only by fungi. shrooms Culture Bank — lab-isolated Pleurotus citrinopileatus, 10cc. Vivid golden clusters, 5–10 day colonization. 16G needle + alcohol swab included.",
      es: "Mayor contenido de ergotionina de cualquier especie de Ostra — el antioxidante protector de mitocondrias sintetizado solo por hongos. shrooms Culture Bank — Pleurotus citrinopileatus aislado en laboratorio, 10cc. Racimos dorados vibrantes. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'yellow-oyster',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc4v', name: '10cc', price: 1799, stock: 35, sku: 'YOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
  },
  {
    id: 'lc5', slug: 'reishi-liquid-culture',
    name: { en: 'Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi' },
    description: {
      en: "The most clinically researched medicinal mushroom on Earth. 400+ bioactive compounds. 2,000 years in Chinese pharmacopoeia. shrooms Culture Bank — lab-isolated Ganoderma lucidum, 10cc. Experienced cultivators only. 16G needle + alcohol swab included.",
      es: "El hongo medicinal más investigado clínicamente del mundo. 400+ compuestos bioactivos. 2,000 años en la farmacopea china. shrooms Culture Bank — Ganoderma lucidum aislado en laboratorio, 10cc. Solo para cultivadores experimentados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc5v', name: '10cc', price: 1799, stock: 30, sku: 'REL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi'], relatedProducts: [],
  },
  {
    id: 'lc6', slug: 'shiitake-liquid-culture',
    name: { en: 'Shiitake Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Shiitake' },
    description: {
      en: "The umami king — and the mushroom with an FDA Orphan Drug designation (lentinan). shrooms Culture Bank — lab-isolated Lentinula edodes, 10cc. On sawdust blocks: 8–12 weeks to first flush. On oak logs: perennial harvest for 3–5 years. 16G needle + alcohol swab included.",
      es: "El rey del umami — y el hongo con designación de Medicamento Huérfano FDA (lentinan). shrooms Culture Bank — Lentinula edodes aislado en laboratorio, 10cc. En bloques de aserrín: 8–12 semanas al primer flush. En troncos de roble: cosecha perenne 3–5 años. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'shiitake',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc6v', name: '10cc', price: 1799, stock: 45, sku: 'SHL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust blocks or oak logs', expectedYield: 'Multiple flushes (perennial on logs)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'liquid-culture', 'shiitake'], relatedProducts: [],
  },
  {
    id: 'lc7', slug: 'cordyceps-militaris-liquid-culture',
    name: { en: 'Cordyceps Militaris Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Cordyceps Militaris' },
    description: {
      en: "The athlete's mushroom — and the sustainable alternative to wild Ophiocordyceps sinensis ($20,000/kg). shrooms Culture Bank — lab-isolated Cordyceps militaris, 10cc. High cordycepin content clinically shown to increase ATP production and VO2 max. Vivid orange stromata. 16G needle + alcohol swab included.",
      es: "El hongo del atleta — y la alternativa sostenible al Ophiocordyceps sinensis silvestre ($20,000/kg). shrooms Culture Bank — Cordyceps militaris aislado en laboratorio, 10cc. Alto contenido de cordycepina que aumenta la producción de ATP y el VO2 máx. Estromatas naranjas vibrantes. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'cordyceps',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc7v', name: '10cc', price: 1799, stock: 25, sku: 'CML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '14–21 days (on grain/rice)', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Cooked grain (wheat berries, brown rice)', expectedYield: '50–150g dry per substrate', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'cordyceps', 'performance'], relatedProducts: [],
  },
  {
    id: 'lc8', slug: 'antler-reishi-liquid-culture',
    name: { en: 'Antler Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi Antler' },
    description: {
      en: "Ganoderma lucidum grown under elevated CO2 — producing dramatic antler-shaped fruiting bodies instead of the classic kidney cap. Same 400+ bioactive compounds as standard Reishi. shrooms Culture Bank — 10cc. Prized for tincture making and display. Advanced growers only. 16G needle + alcohol swab included.",
      es: "Ganoderma lucidum cultivado bajo CO2 elevado — produciendo dramáticos cuerpos fructificantes en forma de asta en lugar del clásico sombrero renal. Los mismos 400+ compuestos bioactivos que el Reishi estándar. shrooms Culture Bank — 10cc. Ideal para tintura y exhibición. Solo cultivadores avanzados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc8v', name: '10cc', price: 1799, stock: 20, sku: 'ARL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi', 'antler'], relatedProducts: [],
  },
  // ── Spore Syringes ───────────────────────────────────────────────────────
  {
    id: 'sp1', slug: 'lions-mane-spore-syringe',
    name: { en: "Lion's Mane Spore Syringe", es: 'Jeringa de Esporas Melena de León' },
    description: {
      en: "shrooms Culture Bank. Hericium erinaceus spore suspension, 10cc. Slower than liquid culture (14–28 days) but ideal for agar work, creating your own LC, or genetic diversity projects. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Hericium erinaceus, 10cc. Más lenta que cultivo líquido (14–28 días) pero ideal para trabajo en agar, crear tu propio LC o proyectos de diversidad genética. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'lions-mane',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp1v', name: '10cc', price: 1299, stock: 40, sku: 'LMS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '14–28 days', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'lions-mane'], relatedProducts: ['lions-mane-liquid-culture'],
  },
  {
    id: 'sp2', slug: 'blue-oyster-spore-syringe',
    name: { en: 'Blue Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Azul' },
    description: {
      en: "shrooms Culture Bank. Pleurotus ostreatus spore suspension, 10cc. Perfect entry point for beginners learning sterile technique. Use on agar to isolate vigorous genetics before transferring to grain. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Pleurotus ostreatus, 10cc. Punto de entrada perfecto para principiantes aprendiendo técnica estéril. Usar en agar para aislar genética vigorosa antes de transferir a grano. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'blue-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp2v', name: '10cc', price: 1299, stock: 50, sku: 'BOS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–28 days', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['blue-oyster-liquid-culture'],
  },
  {
    id: 'sp3', slug: 'pink-oyster-spore-syringe',
    name: { en: 'Pink Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Rosa' },
    description: {
      en: "shrooms Culture Bank. Pleurotus djamor spore suspension, 10cc. The most affordable way to start a Pink Oyster grow. Spores germinate rapidly in warm conditions (75–85°F). 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Pleurotus djamor, 10cc. La forma más accesible de iniciar un cultivo de Ostra Rosa. Las esporas germinan rápido en condiciones cálidas (24–29°C). Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'pink-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp3v', name: '10cc', price: 1299, stock: 40, sku: 'POS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–21 days', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['pink-oyster-liquid-culture'],
  },
  {
    id: 'sp4', slug: 'golden-oyster-spore-syringe',
    name: { en: 'Golden Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Dorada' },
    description: {
      en: "shrooms Culture Bank. Pleurotus citrinopileatus spore suspension, 10cc. Use on agar to select for the most vivid golden coloration before moving to grain. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Pleurotus citrinopileatus, 10cc. Usar en agar para seleccionar la coloración dorada más vibrante antes de pasar a grano. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'yellow-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp4v', name: '10cc', price: 1299, stock: 35, sku: 'GOS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–21 days', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['yellow-oyster-liquid-culture'],
  },
  {
    id: 'sp5', slug: 'reishi-spore-syringe',
    name: { en: 'Reishi Spore Syringe', es: 'Jeringa de Esporas Reishi' },
    description: {
      en: "shrooms Culture Bank. Ganoderma lucidum spore suspension, 10cc. The most economical entry into Reishi cultivation. Recommended for agar-based selection before transferring to grain. Advanced cultivators. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Ganoderma lucidum, 10cc. La entrada más económica al cultivo de Reishi. Recomendado para selección en agar antes de transferir a grano. Cultivadores avanzados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'reishi',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp5v', name: '10cc', price: 1299, stock: 30, sku: 'RES-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: '1–2 flushes (medicinal)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'reishi'], relatedProducts: ['reishi-liquid-culture'],
  },
  {
    id: 'sp6', slug: 'shiitake-spore-syringe',
    name: { en: 'Shiitake Spore Syringe', es: 'Jeringa de Esporas Shiitake' },
    description: {
      en: "shrooms Culture Bank. Lentinula edodes spore suspension, 10cc. Best used on agar to develop vigorous isolates before inoculating sawdust blocks or oak logs. Patient cultivators are rewarded with superior flavor. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Lentinula edodes, 10cc. Mejor utilizada en agar para desarrollar aislados vigorosos antes de inocular bloques de aserrín o troncos de roble. Los cultivadores pacientes son recompensados con un sabor superior. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'shiitake',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp6v', name: '10cc', price: 1299, stock: 45, sku: 'SHS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '21–35 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust blocks or oak logs', expectedYield: 'Multiple flushes (perennial on logs)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'spore-syringe', 'shiitake'], relatedProducts: ['shiitake-liquid-culture'],
  },
  {
    id: 'sp7', slug: 'cordyceps-militaris-spore-syringe',
    name: { en: 'Cordyceps Militaris Spore Syringe', es: 'Jeringa de Esporas Cordyceps Militaris' },
    description: {
      en: "shrooms Culture Bank. Cordyceps militaris spore suspension, 10cc. For mycologists wanting to develop their own isolates. Germination on agar takes 7–14 days; select fast-growing sectors before transferring to grain. Advanced only. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Cordyceps militaris, 10cc. Para micólogos que quieren desarrollar sus propios aislados. La germinación en agar tarda 7–14 días; seleccionar sectores de crecimiento rápido antes de transferir a grano. Solo avanzados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'cordyceps',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp7v', name: '10cc', price: 1299, stock: 25, sku: 'CMS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Cooked grain (wheat berries, brown rice)', expectedYield: '50–150g dry per substrate', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'cordyceps'], relatedProducts: ['cordyceps-militaris-liquid-culture'],
  },
  {
    id: 'sp8', slug: 'antler-reishi-spore-syringe',
    name: { en: 'Antler Reishi Spore Syringe', es: 'Jeringa de Esporas Reishi Antler' },
    description: {
      en: "shrooms Culture Bank. Ganoderma lucidum (antler strain) spore suspension, 10cc. Select isolates on agar under high-CO2 conditions to confirm antler-forming genetics before scaling. Advanced cultivators. 16G needle + alcohol swab included.",
      es: "shrooms Culture Bank. Suspensión de esporas de Ganoderma lucidum (cepa antler), 10cc. Seleccionar aislados en agar bajo condiciones de alto CO2 para confirmar genética formadora de astas antes de escalar. Cultivadores avanzados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'reishi',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp8v', name: '10cc', price: 1299, stock: 20, sku: 'ARS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'reishi', 'antler'], relatedProducts: ['antler-reishi-liquid-culture'],
  },
]

const CATEGORIES = [
  { key: 'culture-bank', label: 'Culture Bank' },
  { key: 'kit',          label: 'Grow Kits' },
  { key: 'wellness',     label: 'Wellness' },
  { key: 'all',          label: 'All Products' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']

type CultureSubKey = 'all' | 'lc' | 'spore'

export default function ShopPage() {
  const t = useTranslations('shop')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('culture-bank')
  const [cultureSub, setCultureSub] = useState<CultureSubKey>('lc')
  const [sortBy, setSortBy] = useState('featured')

  const filtered = useMemo(() => {
    let items: typeof PRODUCTS
    if (activeCategory === 'all') items = PRODUCTS
    else if (activeCategory === 'culture-bank') items = PRODUCTS.filter((p) => p.subcategory === 'Liquid Culture' || p.subcategory === 'Spore Syringe')
    else items = PRODUCTS.filter((p) => p.category === activeCategory)
    if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
    return items
  }, [activeCategory, sortBy])

  return (
    <div className="pt-20 min-h-screen">
      {/* Culture Bank hero banner */}
      {activeCategory === 'culture-bank' && (
        <div className="bg-elevated border-b border-ds-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-2">shrooms Culture Bank</p>
              <h1 className="font-body font-bold text-3xl sm:text-4xl text-cream tracking-tight mb-2">Live Mycelium — Lab Isolated</h1>
              <p className="text-cream-muted max-w-md">8 species. Liquid cultures colonize in 5–10 days. Spore syringes for agar work and genetics. Every syringe: 16G needle + swab + instruction card.</p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              {[['8', 'Species'], ['10cc', 'Syringe'], ['Lab', 'Isolated']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="font-body font-bold text-2xl text-accent">{val}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Sub-filter pills */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex gap-2">
            {([
              { key: 'lc', label: 'Liquid Culture', sub: '5–10 days · $17.99' },
              { key: 'spore', label: 'Spore Syringes', sub: 'Agar work · $12.99' },
            ] as const).map(({ key, label, sub }) => (
              <button
                key={key}
                onClick={() => setCultureSub(key)}
                className={cn(
                  'flex flex-col items-start px-4 py-2.5 rounded-xl border text-left transition-all',
                  cultureSub === key
                    ? 'bg-surface border-accent text-cream shadow-sm'
                    : 'bg-transparent border-ds-border text-cream-muted hover:border-accent/40 hover:text-cream'
                )}
              >
                <span className="text-sm font-medium leading-tight">{label}</span>
                <span className="font-mono text-[10px] tracking-wide text-cream-muted mt-0.5">{sub}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Default header for other categories */}
      {activeCategory !== 'culture-bank' && (
        <div className="bg-surface border-b border-ds-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-body font-bold text-4xl text-cream tracking-tight mb-2">{t('title')}</h1>
            <p className="text-cream-muted">{t('subtitle')}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === key
                    ? 'bg-accent text-cream'
                    : 'bg-elevated text-cream-muted hover:text-cream border border-ds-border'
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-elevated border border-ds-border rounded-xl px-3 py-2 text-sm text-cream focus:outline-none focus:ring-2 focus:ring-accent/50"
          >
            <option value="featured">{t('filters.sortFeatured')}</option>
            <option value="price-low">{t('filters.sortPriceLow')}</option>
            <option value="price-high">{t('filters.sortPriceHigh')}</option>
          </select>
        </div>

        {/* Grid */}
        {activeCategory === 'culture-bank' ? (
          <div>
            {cultureSub === 'lc' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">Ready to inoculate — no agar needed</p>
                    <h2 className="font-body font-bold text-2xl text-cream tracking-tight">Liquid Culture Syringes</h2>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-sm text-cream-muted">
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      5–10 day grain colonization
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Lab isolated
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.filter((p) => p.subcategory === 'Liquid Culture').map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}

            {cultureSub === 'spore' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber mb-1">Agar work &amp; strain development</p>
                    <h2 className="font-body font-bold text-2xl text-cream tracking-tight">Spore Syringes</h2>
                  </div>
                </div>
                <p className="text-cream-muted max-w-2xl mb-8">
                  For isolating your own high-performance strains, building a personal liquid culture library, or preserving genetic diversity. Spores carry natural variation that clonal LC cannot — the foundation of serious mushroom genetics work.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.filter((p) => p.subcategory === 'Spore Syringe').map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
