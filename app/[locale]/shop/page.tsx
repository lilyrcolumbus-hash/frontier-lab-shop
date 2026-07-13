'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
    id: 'fb1', slug: 'lions-mane-fruiting-block',
    name: { en: "Lion's Mane Fruiting Block", es: 'Bloque Fructificante Melena de León' },
    description: {
      en: "Skip colonization entirely — already fully colonized with our Hericium erinaceus culture. Cut it open, mist it, and watch pins form within 5–10 days. Expect 200–400g on the first flush, 2–3 flushes total.",
      es: "Sáltate la colonización — ya está completamente colonizado con nuestro cultivo de Hericium erinaceus. Córtalo, rocíalo y verás pines en 5–10 días. Espera 200–400g en el primer flush.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'lions-mane',
    price: 2999,
    variants: [{ id: 'fb1v', name: '5 lb Block', price: 2999, stock: 30, sku: 'LMF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized)', expectedYield: '200–400g per flush, 2–3 flushes', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'lions-mane', 'fruiting-block'], relatedProducts: ['lions-mane-liquid-culture'],
  },
  {
    id: 'fb2', slug: 'blue-oyster-fruiting-block',
    name: { en: 'Blue Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Azul' },
    description: {
      en: "Already colonized, already easy — the lowest-effort way to grow mushrooms at home. Cut it open, mist, and get your first pins within a week. 3–4 dense flushes at 25%+ biological efficiency.",
      es: "Ya colonizado, ya fácil — la forma de menor esfuerzo para cultivar hongos en casa. Córtalo, rocíalo y tendrás tus primeros pines en una semana.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'blue-oyster',
    price: 2999,
    variants: [{ id: 'fb2v', name: '5 lb Block', price: 2999, stock: 35, sku: 'BOF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw (pre-colonized)', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['blue-oyster-liquid-culture'],
  },
  {
    id: 'fb3', slug: 'shiitake-fruiting-block',
    name: { en: 'Shiitake Fruiting Block', es: 'Bloque Fructificante Shiitake' },
    description: {
      en: "Already colonized on supplemented hardwood sawdust — skip the 8–12 week wait a from-scratch block takes. Cold-shock it to trigger fruiting and see pins within 1–2 weeks.",
      es: "Ya colonizado en aserrín de madera dura suplementada — sáltate las 8–12 semanas de espera. Aplica choque frío para detonar la fructificación.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'shiitake',
    price: 2999,
    variants: [{ id: 'fb3v', name: '5 lb Block', price: 2999, stock: 25, sku: 'SHF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Pre-colonized — ready to cold-shock', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Supplemented hardwood sawdust block (pre-colonized)', expectedYield: '2 flushes per block', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'shiitake', 'fruiting-block'], relatedProducts: ['shiitake-liquid-culture'],
  },
  {
    id: 'fb4', slug: 'pink-oyster-fruiting-block',
    name: { en: 'Pink Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Rosa' },
    description: {
      en: "Already colonized with our fastest, most dramatic species — vivid magenta pins within days. Clusters double in size every 12 hours once fruiting starts.",
      es: "Ya colonizado con nuestra especie más rápida y dramática — pines magenta vibrantes en días. Los racimos duplican tamaño cada 12 horas.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'pink-oyster',
    price: 2999,
    variants: [{ id: 'fb4v', name: '5 lb Block', price: 2999, stock: 30, sku: 'POF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust (pre-colonized)', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['pink-oyster-liquid-culture'],
  },
  {
    id: 'fb5', slug: 'yellow-oyster-fruiting-block',
    name: { en: 'Golden Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Dorada' },
    description: {
      en: "Already colonized with our fastest-growing Oyster — vivid golden clusters within a week. Requires strong fresh air exchange for tight, ruffled formation.",
      es: "Ya colonizado con nuestra Ostra de crecimiento más rápido — racimos dorados vibrantes en una semana. Requiere buen intercambio de aire para formación compacta.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'yellow-oyster',
    price: 2999,
    variants: [{ id: 'fb5v', name: '5 lb Block', price: 2999, stock: 30, sku: 'YOF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw (pre-colonized)', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['yellow-oyster-liquid-culture'],
  },
  {
    id: 'fb6', slug: 'reishi-fruiting-block',
    name: { en: 'Reishi Fruiting Block', es: 'Bloque Fructificante Reishi' },
    description: {
      en: "Already colonized with Ganoderma lucidum. Unlike our Oyster blocks, Reishi rewards patience — 60–90+ days to a fully hardened, lacquered conk.",
      es: "Ya colonizado con Ganoderma lucidum. A diferencia de nuestros bloques de Ostra, el Reishi premia la paciencia — 60–90+ días para un sombrero laqueado completamente formado.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'reishi',
    price: 2999,
    variants: [{ id: 'fb6v', name: '5 lb Block', price: 2999, stock: 20, sku: 'REF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Pre-colonized — ready to fruit', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized)', expectedYield: '1–2 flushes over 60–90+ days', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'medicinal', 'reishi', 'fruiting-block'], relatedProducts: ['reishi-liquid-culture'],
  },
  {
    id: 'fb7', slug: 'antler-reishi-fruiting-block',
    name: { en: 'Antler Reishi Fruiting Block', es: 'Bloque Fructificante Reishi Antler' },
    description: {
      en: "Already colonized under our antler-cultivation protocol — cut it open and maintain elevated CO2 to grow dramatic stag-horn fruiting bodies instead of the classic cap.",
      es: "Ya colonizado bajo nuestro protocolo de cultivo antler — córtalo y mantén el CO2 elevado para formas de asta dramáticas en lugar del sombrero clásico.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'reishi',
    price: 2999,
    variants: [{ id: 'fb7v', name: '5 lb Block', price: 2999, stock: 15, sku: 'ARF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: 'Pre-colonized — ready to fruit', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized, antler protocol)', expectedYield: '1–2 flushes over 60–90+ days', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'medicinal', 'reishi', 'antler', 'fruiting-block'], relatedProducts: ['antler-reishi-liquid-culture'],
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
      en: "The only mushroom that stimulates Nerve Growth Factor (NGF). Culture Bank — lab-isolated Hericium erinaceus, 10cc. Colonizes supplemented hardwood grain in 5–10 days. Yields 200–400g per flush. 16G needle + alcohol swab included.",
      es: "El único hongo que estimula el Factor de Crecimiento Nervioso (NGF). Culture Bank — Hericium erinaceus aislado en laboratorio, 10cc. Coloniza en 5–10 días. Rinde 200–400g por flush. Aguja 16G + swab incluidos.",
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
      en: "The benchmark beginner species — and the one professionals keep growing. Culture Bank — lab-isolated Pleurotus ostreatus, 10cc. 25%+ biological efficiency on hardwood. 3–4 dense flushes over 8 weeks. 16G needle + alcohol swab included.",
      es: "La especie referencia para principiantes — y la que los profesionales siguen cultivando. Culture Bank — Pleurotus ostreatus aislado en laboratorio, 10cc. 25%+ eficiencia biológica en madera dura. 3–4 flushes densos en 8 semanas. Aguja 16G + swab incluidos.",
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
      en: "Fastest pinning edible mushroom in cultivation. Culture Bank — lab-isolated Pleurotus djamor, 10cc. First pins within 5 days of fruiting conditions. Vivid magenta clusters that double in size every 12 hours. 16G needle + alcohol swab included.",
      es: "El hongo comestible de pinado más rápido en cultivo. Culture Bank — Pleurotus djamor aislado en laboratorio, 10cc. Primeros pines en 5 días de fructificación. Racimos magenta vibrantes que duplican tamaño cada 12 horas. Aguja 16G + swab incluidos.",
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
      en: "Highest ergothioneine content of any Oyster species — the mitochondria-protective antioxidant synthesized only by fungi. Culture Bank — lab-isolated Pleurotus citrinopileatus, 10cc. Vivid golden clusters, 5–10 day colonization. 16G needle + alcohol swab included.",
      es: "Mayor contenido de ergotionina de cualquier especie de Ostra — el antioxidante protector de mitocondrias sintetizado solo por hongos. Culture Bank — Pleurotus citrinopileatus aislado en laboratorio, 10cc. Racimos dorados vibrantes. Aguja 16G + swab incluidos.",
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
      en: "The most clinically researched medicinal mushroom on Earth. 400+ bioactive compounds. 2,000 years in Chinese pharmacopoeia. Culture Bank — lab-isolated Ganoderma lucidum, 10cc. Experienced cultivators only. 16G needle + alcohol swab included.",
      es: "El hongo medicinal más investigado clínicamente del mundo. 400+ compuestos bioactivos. 2,000 años en la farmacopea china. Culture Bank — Ganoderma lucidum aislado en laboratorio, 10cc. Solo para cultivadores experimentados. Aguja 16G + swab incluidos.",
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
      en: "The umami king — and the mushroom with an FDA Orphan Drug designation (lentinan). Culture Bank — lab-isolated Lentinula edodes, 10cc. On sawdust blocks: 8–12 weeks to first flush. On oak logs: perennial harvest for 3–5 years. 16G needle + alcohol swab included.",
      es: "El rey del umami — y el hongo con designación de Medicamento Huérfano FDA (lentinan). Culture Bank — Lentinula edodes aislado en laboratorio, 10cc. En bloques de aserrín: 8–12 semanas al primer flush. En troncos de roble: cosecha perenne 3–5 años. Aguja 16G + swab incluidos.",
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
      en: "The athlete's mushroom — and the sustainable alternative to wild Ophiocordyceps sinensis ($20,000/kg). Culture Bank — lab-isolated Cordyceps militaris, 10cc. High cordycepin content clinically shown to increase ATP production and VO2 max. Vivid orange stromata. 16G needle + alcohol swab included.",
      es: "El hongo del atleta — y la alternativa sostenible al Ophiocordyceps sinensis silvestre ($20,000/kg). Culture Bank — Cordyceps militaris aislado en laboratorio, 10cc. Alto contenido de cordycepina que aumenta la producción de ATP y el VO2 máx. Estromatas naranjas vibrantes. Aguja 16G + swab incluidos.",
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
      en: "Ganoderma lucidum grown under elevated CO2 — producing dramatic antler-shaped fruiting bodies instead of the classic kidney cap. Same 400+ bioactive compounds as standard Reishi. Culture Bank — 10cc. Prized for tincture making and display. Advanced growers only. 16G needle + alcohol swab included.",
      es: "Ganoderma lucidum cultivado bajo CO2 elevado — produciendo dramáticos cuerpos fructificantes en forma de asta en lugar del clásico sombrero renal. Los mismos 400+ compuestos bioactivos que el Reishi estándar. Culture Bank — 10cc. Ideal para tintura y exhibición. Solo cultivadores avanzados. Aguja 16G + swab incluidos.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc8v', name: '10cc', price: 1799, stock: 20, sku: 'ARL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi', 'antler'], relatedProducts: [],
  },
  // ── Grain Spawn Bags ─────────────────────────────────────────────────────
  {
    id: 'gb1', slug: 'rye-grain-spawn-bag-3lb',
    name: { en: 'Rye Berry Grain Bag — 3lb', es: 'Bolsa de Grano Centeno — 3lb' },
    description: {
      en: "The industry-standard substrate — highest surface area of any common grain, exceptional moisture retention, works reliably across nearly every cultivated species. Autoclave-sterilized and batch-tested for sterility, hydrated and ready to inoculate.",
      es: "El sustrato estándar de la industria — mayor superficie de cualquier grano común, excelente retención de humedad. Esterilizado en autoclave y probado por lote, hidratado y listo para inocular.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb1v', name: '3 lb', price: 1999, stock: 60, sku: 'RYE-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'rye', 'beginner'], relatedProducts: [],
  },
  {
    id: 'gb2', slug: 'drippy-corn-grain-spawn-bag-3lb',
    name: { en: 'Drippy Corn Grain Bag — 3lb', es: 'Bolsa Drippy Corn (Maíz Húmedo) — 3lb' },
    description: {
      en: "Known in the grow community as \"Drippy Corn\" — high nutrient density and excellent moisture hold, built for growers scaling toward bulk substrate. Whole-kernel corn, autoclave-sterilized and batch-tested, ready to inoculate.",
      es: "Conocido en la comunidad cultivadora como \"Drippy Corn\" — alta densidad de nutrientes y excelente retención de humedad, ideal para escalar a sustrato a granel. Maíz en grano entero, esterilizado en autoclave y probado por lote, listo para inocular.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb2v', name: '3 lb', price: 1999, stock: 55, sku: 'CRN-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'corn', 'drippy-corn', 'beginner'], relatedProducts: [],
  },
  {
    id: 'gb3', slug: 'milo-grain-spawn-bag-3lb',
    name: { en: 'Milo (Sorghum) Grain Bag — 3lb', es: 'Bolsa de Grano Milo (Sorgo) — 3lb' },
    description: {
      en: "Small, uniform kernels create thousands of inoculation points per bag — fast, even colonization. Autoclave-sterilized and batch-tested for sterility, a favorite for growers running multiple bags at once.",
      es: "Granos pequeños y uniformes crean miles de puntos de inoculación por bolsa — colonización rápida y pareja. Esterilizado en autoclave y probado por lote, favorito de cultivadores que corren varias bolsas a la vez.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb3v', name: '3 lb', price: 1999, stock: 65, sku: 'MLO-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'milo', 'beginner'], relatedProducts: [],
  },
  {
    id: 'gb4', slug: 'millet-grain-spawn-bag-3lb',
    name: { en: 'Millet Grain Bag — 3lb', es: 'Bolsa de Grano Mijo — 3lb' },
    description: {
      en: "The smallest kernel we carry — highest surface-area-to-volume ratio of any grain, meaning more contact points for mycelium and a lower natural contamination load than larger grains. Autoclave-sterilized and batch-tested for sterility.",
      es: "El grano más pequeño de nuestra línea — mayor relación superficie-volumen, más puntos de contacto para el micelio y menor riesgo de contaminación que granos más grandes. Esterilizado en autoclave y probado por lote.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb4v', name: '3 lb', price: 1999, stock: 45, sku: 'MLT-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'millet', 'intermediate'], relatedProducts: [],
  },
  {
    id: 'gb5', slug: 'oat-grain-spawn-bag-3lb',
    name: { en: 'Oat Groat Grain Bag — 3lb', es: 'Bolsa de Grano Avena — 3lb' },
    description: {
      en: "Consistently the fastest-colonizing grain in side-by-side grows — ideal for aggressive Oyster strains. Autoclave-sterilized and batch-tested for sterility. Rewards precise hydration for best results.",
      es: "El grano de colonización más rápida en pruebas comparativas — ideal para cepas agresivas de Ostra. Esterilizado en autoclave y probado por lote. Requiere hidratación precisa para mejores resultados.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb5v', name: '3 lb', price: 1999, stock: 40, sku: 'OAT-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'oats', 'intermediate'], relatedProducts: [],
  },
  // ── All-in-One Grow Bags ─────────────────────────────────────────────────
  {
    id: 'aio1', slug: 'lions-mane-all-in-one-grow-bag',
    name: { en: "Lion's Mane All-in-One Grow Bag", es: 'Bolsa Todo-en-Uno Melena de León' },
    description: {
      en: "The whole grow in one bag — no separate spawn, no bulk substrate to mix. Inject directly, incubate, cut, and fruit from the same 5lb bag of autoclave-sterilized Master's Mix.",
      es: "Todo el cultivo en una sola bolsa — sin spawn por separado. Inyecta, incuba, corta y fructifica desde la misma bolsa de 5lb de Master's Mix esterilizado en autoclave.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'lions-mane',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio1v', name: '5 lb', price: 2499, stock: 40, sku: 'LMA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'lions-mane', 'intermediate'], relatedProducts: ['lions-mane-liquid-culture'],
  },
  {
    id: 'aio2', slug: 'blue-oyster-all-in-one-grow-bag',
    name: { en: 'Blue Oyster All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Ostra Azul' },
    description: {
      en: "The whole grow in one bag — inject, incubate, cut, fruit, all from the same 5lb bag of autoclave-sterilized Master's Mix. Built for Blue Oyster's forgiving, aggressive colonization style.",
      es: "Todo el cultivo en una sola bolsa. Ideal para el estilo de colonización agresivo e indulgente de la Ostra Azul.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'blue-oyster',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio2v', name: '5 lb', price: 2499, stock: 45, sku: 'BOA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'oyster', 'beginner'], relatedProducts: ['blue-oyster-liquid-culture'],
  },
  {
    id: 'aio3', slug: 'shiitake-all-in-one-grow-bag',
    name: { en: 'Shiitake All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Shiitake' },
    description: {
      en: "Inject, incubate, and fruit Shiitake from a single 5lb bag of autoclave-sterilized Master's Mix — no log inoculation or years-long wait required.",
      es: "Inyecta, incuba y fructifica Shiitake desde una sola bolsa de 5lb de Master's Mix esterilizado en autoclave — sin inoculación de troncos.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'shiitake',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio3v', name: '5 lb', price: 2499, stock: 30, sku: 'SHA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'shiitake', 'intermediate'], relatedProducts: ['shiitake-liquid-culture'],
  },
  {
    id: 'aio4', slug: 'pink-oyster-all-in-one-grow-bag',
    name: { en: 'Pink Oyster All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Ostra Rosa' },
    description: {
      en: "The fastest path from syringe to harvest we offer. Inject this 5lb bag of autoclave-sterilized Master's Mix and cut it open in as little as 10–14 days.",
      es: "El camino más rápido de jeringa a cosecha. Inyecta esta bolsa de 5lb de Master's Mix esterilizado en autoclave y ábrela en tan solo 10–14 días.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'pink-oyster',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio4v', name: '5 lb', price: 2499, stock: 35, sku: 'POA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'oyster', 'beginner'], relatedProducts: ['pink-oyster-liquid-culture'],
  },
  {
    id: 'aio5', slug: 'yellow-oyster-all-in-one-grow-bag',
    name: { en: 'Golden Oyster All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Ostra Dorada' },
    description: {
      en: "The whole grow in one bag — inject, incubate, cut, and fruit our fastest-colonizing Oyster from the same 5lb bag of autoclave-sterilized Master's Mix.",
      es: "Todo el cultivo en una sola bolsa — inyecta, incuba, corta y fructifica nuestra Ostra de colonización más rápida desde la misma bolsa de 5lb de Master's Mix esterilizado en autoclave.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'yellow-oyster',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio5v', name: '5 lb', price: 2499, stock: 40, sku: 'YOA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'oyster', 'beginner'], relatedProducts: ['yellow-oyster-liquid-culture'],
  },
  {
    id: 'aio6', slug: 'reishi-all-in-one-grow-bag',
    name: { en: 'Reishi All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Reishi' },
    description: {
      en: "The whole grow in one bag — inject, incubate, cut, and fruit Reishi from the same 5lb bag of autoclave-sterilized Master's Mix. A slow, patient grow — not a beginner species.",
      es: "Todo el cultivo en una sola bolsa — inyecta, incuba, corta y fructifica Reishi desde la misma bolsa de 5lb de Master's Mix esterilizado en autoclave. Un cultivo lento y paciente — no es para principiantes.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'reishi',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio6v', name: '5 lb', price: 2499, stock: 25, sku: 'REA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'medicinal', 'reishi'], relatedProducts: ['reishi-liquid-culture'],
  },
  {
    id: 'aio7', slug: 'antler-reishi-all-in-one-grow-bag',
    name: { en: 'Antler Reishi All-in-One Grow Bag', es: 'Bolsa Todo-en-Uno Reishi Antler' },
    description: {
      en: "The whole grow in one bag — inject, incubate, cut, and fruit under our antler-cultivation protocol from the same 5lb bag of autoclave-sterilized Master's Mix. Advanced growers only.",
      es: "Todo el cultivo en una sola bolsa — inyecta, incuba, corta y fructifica bajo nuestro protocolo de cultivo antler desde la misma bolsa de 5lb de Master's Mix esterilizado en autoclave. Solo cultivadores avanzados.",
    },
    category: 'substrate', subcategory: 'All-in-One Bags', species: 'reishi',
    price: 2499, compareAtPrice: 2799,
    variants: [{ id: 'aio7v', name: '5 lb', price: 2499, stock: 15, sku: 'ARA-5LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['all-in-one', 'medicinal', 'reishi', 'antler'], relatedProducts: ['antler-reishi-liquid-culture'],
  },
  // ── Sterile Bulk Substrate (no injection port — mix with your own grain spawn) ──
  {
    id: 'bs1', slug: 'lions-mane-bulk-substrate',
    name: { en: "Lion's Mane Sterile Bulk Substrate", es: 'Sustrato a Granel Esterilizado Melena de León' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Built for Lion's Mane's longer colonization window.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Pensado para la Melena de León.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'lions-mane',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs1v', name: '5 lb', price: 2299, stock: 35, sku: 'LMB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'lions-mane', 'intermediate'], relatedProducts: ['lions-mane-liquid-culture'],
  },
  {
    id: 'bs2', slug: 'blue-oyster-bulk-substrate',
    name: { en: 'Blue Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Azul' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Blue Oyster's forgiving style makes it the easiest bulk substrate to learn on.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. El más fácil para aprender la técnica de mezcla.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'blue-oyster',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs2v', name: '5 lb', price: 2299, stock: 40, sku: 'BOB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['blue-oyster-liquid-culture'],
  },
  {
    id: 'bs3', slug: 'shiitake-bulk-substrate',
    name: { en: 'Shiitake Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Shiitake' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Colonization runs longer than Oyster species by nature.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. La colonización toma más tiempo que las Ostras.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'shiitake',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs3v', name: '5 lb', price: 2299, stock: 25, sku: 'SHB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'shiitake', 'intermediate'], relatedProducts: ['shiitake-liquid-culture'],
  },
  {
    id: 'bs4', slug: 'pink-oyster-bulk-substrate',
    name: { en: 'Pink Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Rosa' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Pairs with our fastest, most dramatic species.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Combina con nuestra especie más rápida y dramática.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'pink-oyster',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs4v', name: '5 lb', price: 2299, stock: 35, sku: 'POB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['pink-oyster-liquid-culture'],
  },
  {
    id: 'bs5', slug: 'yellow-oyster-bulk-substrate',
    name: { en: 'Golden Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Dorada' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Built for Golden Oyster's fast, aggressive colonization style.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Pensado para el estilo de colonización rápido de la Ostra Dorada.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'yellow-oyster',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs5v', name: '5 lb', price: 2299, stock: 30, sku: 'YOB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['yellow-oyster-liquid-culture'],
  },
  {
    id: 'bs6', slug: 'reishi-bulk-substrate',
    name: { en: 'Reishi Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Reishi' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Not a fast grow — 60–90+ days from cutting to a fully hardened conk.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. No es un cultivo rápido — 60–90+ días hasta un sombrero completamente endurecido.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'reishi',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs6v', name: '5 lb', price: 2299, stock: 20, sku: 'REB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'medicinal', 'reishi'], relatedProducts: ['reishi-liquid-culture'],
  },
  {
    id: 'bs7', slug: 'antler-reishi-bulk-substrate',
    name: { en: 'Antler Reishi Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Reishi Antler' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn — no injection port, just open and mix. Limit fresh air exchange during fruiting to grow antlers instead of a normal cap.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Limita el intercambio de aire durante la fructificación para lograr astas.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'reishi',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs7v', name: '5 lb', price: 2299, stock: 15, sku: 'ARB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'medicinal', 'reishi', 'antler'], relatedProducts: ['antler-reishi-liquid-culture'],
  },
]

const CATEGORIES = [
  { key: 'culture-bank', label: 'Culture Bank' },
  { key: 'substrate',    label: 'Substrate' },
  { key: 'kit',          label: 'Grow Kits' },
  { key: 'wellness',     label: 'Wellness' },
  { key: 'all',          label: 'All Products' },
] as const

type CategoryKey = typeof CATEGORIES[number]['key']
const CATEGORY_KEYS: readonly string[] = CATEGORIES.map((c) => c.key)

const SUBSTRATE_STAGES = [
  {
    subcategory: 'Grain Bags',
    eyebrow: 'Stage 1 — small inoculant',
    title: 'Grain Bags',
    note: 'Inject with a Liquid Culture syringe. Becomes grain spawn once colonized — used to inoculate everything below.',
  },
  {
    subcategory: 'Bulk Substrate',
    eyebrow: 'Stage 2 — no injection port',
    title: 'Sterile Bulk Substrate',
    note: 'Open it and hand-mix in grain spawn you already have. No syringe needed.',
  },
  {
    subcategory: 'All-in-One Bags',
    eyebrow: 'Stage 3 — inject directly',
    title: 'All-in-One Grow Bags',
    note: 'Inoculate and fruit from the same bag — no separate transfer step.',
  },
  {
    subcategory: 'Fruiting Blocks',
    eyebrow: 'Stage 4 — ready now',
    title: 'Fruiting Blocks',
    note: 'Already colonized. Cut, mist, and harvest — no colonizing wait.',
  },
] as const

function ShopPageContent() {
  const t = useTranslations('shop')
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>(
    categoryParam && CATEGORY_KEYS.includes(categoryParam) ? (categoryParam as CategoryKey) : 'culture-bank'
  )
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    if (categoryParam && CATEGORY_KEYS.includes(categoryParam)) setActiveCategory(categoryParam as CategoryKey)
  }, [categoryParam])

  const filtered = useMemo(() => {
    let items: typeof PRODUCTS
    if (activeCategory === 'all') items = PRODUCTS
    else if (activeCategory === 'culture-bank') items = PRODUCTS.filter((p) => p.subcategory === 'Liquid Culture')
    else items = PRODUCTS.filter((p) => p.category === activeCategory)
    if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
    return items
  }, [activeCategory, sortBy])

  const substrateStageGroups = useMemo(() => {
    if (activeCategory !== 'substrate') return []
    return SUBSTRATE_STAGES.map((stage) => {
      let items = PRODUCTS.filter((p) => p.subcategory === stage.subcategory)
      if (sortBy === 'price-low') items = [...items].sort((a, b) => a.price - b.price)
      if (sortBy === 'price-high') items = [...items].sort((a, b) => b.price - a.price)
      return { ...stage, items }
    }).filter((group) => group.items.length > 0)
  }, [activeCategory, sortBy])

  return (
    <div className="pt-20 min-h-screen">
      {/* Culture Bank hero banner */}
      {activeCategory === 'culture-bank' && (
        <div className="bg-elevated border-b border-ds-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-2">Culture Bank</p>
              <h1 className="font-body font-bold text-3xl sm:text-4xl text-cream tracking-tight mb-2">Live Mycelium — Lab Isolated</h1>
              <p className="text-cream-muted max-w-md">8 species. 10cc syringes. Colonizes grain in 5–10 days — up to 3× faster than spores. Each packet includes 16G needle + alcohol swab + instruction card.</p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              {[['8', 'Species'], ['10cc', 'Syringe'], ['3×', 'Faster than spores']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p className="font-body font-bold text-2xl text-accent">{val}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted mt-0.5">{label}</p>
                </div>
              ))}
            </div>
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
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : activeCategory === 'substrate' ? (
          <div className="space-y-14">
            {substrateStageGroups.map((group, i) => (
              <div key={group.subcategory}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-1">{group.eyebrow}</p>
                    <h2 className="font-body font-bold text-2xl text-cream tracking-tight">{group.title}</h2>
                    <p className="text-cream-muted text-sm mt-1 max-w-xl">{group.note}</p>
                  </div>
                  {i < substrateStageGroups.length - 1 && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="hidden sm:block text-cream-muted/40 flex-shrink-0" aria-hidden="true">
                      <path d="M12 5v14M12 19l-5-5M12 19l5-5" />
                    </svg>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {i < substrateStageGroups.length - 1 && <div className="mt-14 border-b border-ds-border" />}
              </div>
            ))}
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

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageContent />
    </Suspense>
  )
}
