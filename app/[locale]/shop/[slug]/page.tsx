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
    category: 'spawn', subcategory: 'Grain Spawn', species: 'blue-oyster', scientificName: 'Pleurotus ostreatus',
    price: 1499, compareAtPrice: 1999,
    variants: [
      { id: 'v1-sm', name: '1 lb', price: 1499, stock: 50, sku: 'BOS-1LB' },
      { id: 'v1-md', name: '5 lbs', price: 5999, stock: 30, sku: 'BOS-5LB' },
      { id: 'v1-lg', name: '10 lbs', price: 9999, stock: 15, sku: 'BOS-10LB' },
    ],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '2–3 weeks', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '1–3 flushes, 25% biological efficiency', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'oyster', 'organic'], relatedProducts: [],
  },
  'liquid-culture-extraction-lid-wide-mouth': {
    id: 'eq1', slug: 'liquid-culture-extraction-lid-wide-mouth',
    name: { en: 'Liquid Culture Extraction Lid — Wide Mouth', es: 'Tapa de Extracción de Cultivo Líquido — Boca Ancha' },
    description: {
      en: "Extract sterile liquid culture straight from the jar — no needle, no opening the lid, no contamination risk. This lid combines three things in one: a self-healing injection port for inoculating, a 0.2-micron filter patch for clean gas exchange during colonization, and a shut-off valve with attached tubing for drawing off liquid culture once it's ready.\n\nFits Wide Mouth (86mm opening) Mason jars — both 16oz and 32oz, since the mouth size is standardized independent of jar volume. Food-grade, autoclavable, reusable across many cycles.\n\nEach lid: injection port · 0.2-micron filter patch · shut-off valve · attached tubing.",
      es: "Extrae cultivo líquido estéril directo del frasco — sin aguja, sin abrir la tapa, sin riesgo de contaminación. Esta tapa combina tres cosas en una: puerto de inyección autosellante para inocular, parche filtrante de 0.2 micras para intercambio de aire limpio durante la colonización, y una válvula de corte con manguera para sacar el cultivo líquido cuando esté listo.\n\nSirve para frascos Mason Wide Mouth (abertura de 86mm) — tanto 16oz como 32oz, ya que el ancho de la boca es el mismo sin importar el volumen del frasco. Grado alimenticio, esterilizable en autoclave, reutilizable.\n\nCada tapa incluye: puerto de inyección · parche filtrante de 0.2 micras · válvula de corte · manguera.",
    },
    category: 'equipment', subcategory: 'Jar Lids',
    price: 2304, compareAtPrice: undefined,
    variants: [{ id: 'eq1v', name: 'Wide Mouth (16oz/32oz)', price: 2304, stock: 40, sku: 'LCEL-WM' }],
    images: [],
    isOrganic: false, inStock: true, tags: ['equipment', 'lid', 'wide-mouth'], relatedProducts: [],
    howToUseSteps: [
      'Autoclave the lid along with your jar and substrate before first use (15 PSI, ~30-45 min for a jar this size).',
      'Fill your Wide Mouth jar (16oz or 32oz) with sterilized substrate or nutrient media, then screw on the lid.',
      "Sterilize the injection port with an alcohol swab and let it dry before each use.",
      'Inject liquid culture or spores through the self-healing port to inoculate.',
      'Incubate as normal — the 0.2-micron filter handles gas exchange without letting contaminants in.',
      "Once colonized, open the shut-off valve and draw sterile liquid culture out through the tubing with a syringe — no need to open the jar.",
      'Close the valve after extraction. Reusable for multiple inoculation/extraction cycles after autoclaving between uses.',
    ],
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
      en: "The only mushroom on Earth that stimulates Nerve Growth Factor (NGF) — the protein your brain needs to grow and repair neurons. Culture Bank — 10cc of lab-isolated Hericium erinaceus mycelium in nutrient broth, selected for dense pom-pom formation and vigorous colonization.\n\nColonizes supplemented hardwood grain in 5–10 days — up to 3× faster than spores. Yields 200–400g per flush on supplemented hardwood blocks. Fruit at 65–75°F with 90–95% humidity and strong fresh air exchange. CO2 buildup causes icicle-form instead of the classic pom-pom — a sign to increase FAE.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El único hongo del mundo que estimula el Factor de Crecimiento Nervioso (NGF) — la proteína que tu cerebro necesita para crecer y reparar neuronas. Culture Bank — 10cc de micelio de Hericium erinaceus aislado en laboratorio, seleccionado para formación de pompón denso y colonización vigorosa.\n\nColoniza grano de madera dura suplementada en 5–10 días — hasta 3× más rápido que esporas. Rinde 200–400g por flush. Fructificar a 18–24°C con 90–95% humedad y buen intercambio de aire fresco.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'lions-mane', scientificName: 'Hericium erinaceus',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc1v', name: '10cc', price: 1799, stock: 40, sku: 'LML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'lions-mane'], relatedProducts: ['lions-mane-fruiting-block'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Hericium erinaceus is the only mushroom known to contain hericenones (in the fruiting body) and erinacines (in the mycelium) — two structurally distinct compound families that both cross the blood-brain barrier and stimulate the synthesis of Nerve Growth Factor (NGF). NGF is the protein responsible for the growth, maintenance, and survival of neurons; without it, neurons atrophy and die.\n\nA 2009 double-blind, placebo-controlled trial (Mori et al., Phytotherapy Research) showed significant cognitive improvement in adults with mild cognitive impairment after 16 weeks of daily Lion's Mane supplementation — with regression upon cessation, confirming the effect was compound-dependent.\n\nSubsequent research has identified benefits in: reducing anxiety and depression (Inanaga 2014, 4-week RCT), peripheral nerve regeneration (myelin sheath repair), and reduction of amyloid-beta plaques associated with Alzheimer's disease in animal models. Currently under investigation in Phase II clinical trials for neurodegenerative disease prevention.",
      es: "Hericium erinaceus es el único hongo conocido que contiene hericenones (en el cuerpo fructificante) y erinacinas (en el micelio) — dos familias de compuestos estructuralmente distintos que cruzan la barrera hematoencefálica y estimulan la síntesis del Factor de Crecimiento Nervioso (NGF). El NGF es la proteína responsable del crecimiento, mantenimiento y supervivencia de las neuronas.\n\nUn ensayo doble ciego controlado con placebo (Mori et al., 2009) mostró mejora cognitiva significativa en adultos con deterioro cognitivo leve después de 16 semanas de suplementación diaria. Investigación posterior ha identificado beneficios en: reducción de ansiedad y depresión, regeneración de nervios periféricos, y reducción de placas amiloide-beta en modelos animales.",
    },
    keyBenefits: [
      { icon: 'brain', label: 'Nerve Growth Factor', detail: 'Hericenones + erinacines stimulate NGF synthesis — the only mushroom with this property, confirmed in double-blind RCTs' },
      { icon: 'activity', label: 'Cognitive Protection', detail: 'Clinically studied for mild cognitive impairment, Alzheimer prevention, and neuropathic pain in Phase II trials' },
      { icon: 'sun', label: 'Anxiety & Mood', detail: 'Significant reduction in anxiety and depression scores after 4 weeks — RCT published in Biomedical Research (2010)' },
      { icon: 'zap', label: 'Nerve Regeneration', detail: 'Promotes myelin sheath repair and peripheral nerve regrowth — studied for recovery from nerve injury' },
    ],
  },
  'blue-oyster-liquid-culture': {
    id: 'lc2', slug: 'blue-oyster-liquid-culture',
    name: { en: 'Blue Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Azul' },
    description: {
      en: "The benchmark beginner species — and the one professional growers keep coming back to. Pleurotus ostreatus is the most forgiving edible mushroom in cultivation: tolerates temperature swings, thrives on cheap substrates, and produces 3–4 dense flushes with 25%+ biological efficiency on hardwood. Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for aggressive colonization and high pin density.\n\nColonizes grain in 5–10 days. Fruit at 55–65°F with 85–95% humidity. Grows on hardwood sawdust, straw, or coffee grounds. First pins appear 7–14 days after fruiting conditions are introduced.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "La especie referencia para principiantes — y la que los cultivadores profesionales siguen usando. Pleurotus ostreatus es el hongo comestible más indulgente en cultivo: tolera cambios de temperatura, prospera en sustratos económicos y produce 3–4 flushes densos con 25%+ de eficiencia biológica. Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para colonización agresiva y alta densidad de pines.\n\nColoniza grano en 5–10 días. Fructificar a 13–18°C con 85–95% humedad.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'blue-oyster', scientificName: 'Pleurotus ostreatus',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc2v', name: '10cc', price: 1799, stock: 50, sku: 'BOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: ['blue-oyster-grain-spawn'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus ostreatus is one of the most nutritionally complete foods in nature. At 30% protein by dry weight — with all essential amino acids and a PDCAAS score comparable to beef — it outperforms virtually every plant-based protein source.\n\nThe primary medicinal compounds are beta-1,3 and beta-1,6 glucans (25–30% dry weight), which activate macrophages and natural killer cells through Dectin-1 receptor binding. This mechanism is well-established in over 300 peer-reviewed studies. Additionally, P. ostreatus naturally produces lovastatin (mevinolin) — the same compound used in pharmaceutical cholesterol drugs — at levels shown to reduce LDL by 7–10% in controlled studies.\n\nErgothioneine content is particularly high: this sulfur-containing amino acid is synthesized only by fungi and certain bacteria. Humans actively transport it into cells via a specific transporter (OCTN1), where it concentrates in mitochondria and protects against oxidative damage. Plasma ergothioneine levels are increasingly used as a longevity biomarker.",
      es: "Pleurotus ostreatus es uno de los alimentos más completos nutricionalmente. Con 30% de proteína en peso seco — todos los aminoácidos esenciales y una puntuación PDCAAS comparable a la carne de res — supera prácticamente a cualquier fuente proteica vegetal.\n\nLos principales compuestos medicinales son los beta-glucanos 1,3 y 1,6 (25–30% peso seco), que activan macrófagos y células NK mediante la unión al receptor Dectina-1. Adicionalmente, produce lovastatina natural a niveles que reducen el LDL en 7–10% en estudios controlados.\n\nEl contenido de ergotionina es especialmente alto: este aminoácido sulforado sintetizado solo por hongos se concentra en las mitocondrias y protege contra el daño oxidativo.",
    },
    keyBenefits: [
      { icon: 'shield', label: 'Immune Activation', detail: 'Beta-glucans (25–30% dry weight) bind Dectin-1 receptors on macrophages and NK cells — 300+ peer-reviewed studies' },
      { icon: 'heart', label: 'Cholesterol Balance', detail: 'Natural lovastatin reduces LDL by 7–10% in controlled studies — same mechanism as pharmaceutical statins' },
      { icon: 'leaf', label: 'Mitochondrial Defense', detail: 'Ergothioneine concentrates in mitochondria and protects against oxidative damage — a longevity biomarker' },
      { icon: 'zap', label: 'Complete Protein', detail: '30% protein by dry weight, all essential amino acids, PDCAAS score comparable to beef' },
    ],
  },
  'pink-oyster-liquid-culture': {
    id: 'lc3', slug: 'pink-oyster-liquid-culture',
    name: { en: 'Pink Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Rosa' },
    description: {
      en: "The fastest pinning edible mushroom in cultivation — and the most dramatic. Pleurotus djamor produces vivid magenta-pink clusters that appear within 5 days of fruiting conditions and double in size every 12 hours. Harvest before the edges begin to wave. Culture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for intense color retention and explosive pin density.\n\nColonizes grain in 5–10 days. Loves warmth (75–85°F) — thrives in subtropical home environments without climate control. High humidity (85–90%) tent recommended. From inoculation to first harvest in as little as 3–4 weeks total.\n\nNote: the dramatic pink color fades with heat when cooking — harvest young and cook quickly for best color and flavor.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo comestible con el pinado más rápido en cultivo — y el más dramático. Pleurotus djamor produce racimos magenta-rosados vibrantes que aparecen a los 5 días de las condiciones de fructificación y duplican tamaño cada 12 horas. Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para retención de color intenso y alta densidad de pines.\n\nColoniza grano en 5–10 días. Le encanta el calor (24–29°C). De inoculación a primera cosecha en tan solo 3–4 semanas.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'pink-oyster', scientificName: 'Pleurotus djamor',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc3v', name: '10cc', price: 1799, stock: 40, sku: 'POL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust, sugarcane bagasse', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus djamor shares the core beta-glucan profile of Blue Oyster but with a notably higher concentration of phenolic antioxidants — compounds that neutralize reactive oxygen species (ROS) and reduce systemic inflammation. A 2021 study (Food Chemistry) measured P. djamor's DPPH radical scavenging activity at 78%, higher than most edible Pleurotus species.\n\nLike other Oyster mushrooms, Pink Oyster contains natural lovastatin for cholesterol balance, ergothioneine for mitochondrial protection, and complete protein with all essential amino acids. The distinctive magenta pigment (from terpene and carotenoid precursors) fades when cooked but represents a concentrated source of antioxidant phytocompounds in raw or lightly dried preparations.\n\nThe extremely fast colonization and fruiting of P. djamor makes it valuable not just as a food source but as a bioremediation agent — studies show high efficacy in breaking down agricultural waste and petroleum-contaminated soil through lignin-degrading enzymes (laccase, manganese peroxidase).",
      es: "Pleurotus djamor comparte el perfil central de beta-glucanos de la Ostra Azul pero con una concentración notablemente mayor de antioxidantes fenólicos. Un estudio de 2021 (Food Chemistry) midió la actividad captadora de radicales DPPH de P. djamor en 78%, mayor que la mayoría de las especies de Pleurotus comestibles.\n\nComo otras Ostras, contiene lovastatina natural, ergotionina y proteína completa con todos los aminoácidos esenciales. El pigmento magenta característico representa una fuente concentrada de fitocompuestos antioxidantes en preparaciones crudas o ligeramente secadas.",
    },
    keyBenefits: [
      { icon: 'sun', label: 'Antioxidant Power', detail: '78% DPPH radical scavenging activity — among the highest of any edible Pleurotus species measured' },
      { icon: 'heart', label: 'Cholesterol Control', detail: 'Natural lovastatin reduces LDL through the same proven mechanism as pharmaceutical statin drugs' },
      { icon: 'shield', label: 'Immune Support', detail: 'Beta-glucan polysaccharides activate macrophages and NK cells via Dectin-1 receptor binding' },
      { icon: 'leaf', label: 'Anti-inflammatory', detail: 'High phenolic compound content neutralizes ROS and reduces systemic inflammation at the cellular level' },
    ],
  },
  'yellow-oyster-liquid-culture': {
    id: 'lc4', slug: 'yellow-oyster-liquid-culture',
    name: { en: 'Golden Oyster Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Ostra Dorada' },
    description: {
      en: "Sunlight in mushroom form — and the Oyster species with the highest ergothioneine content. Ergothioneine is a potent antioxidant synthesized only by fungi and certain bacteria; it concentrates in human mitochondria and protects against oxidative damage linked to aging and neurodegeneration. Pleurotus citrinopileatus also contains mevinolin (a natural lovastatin analog) for cholesterol balance.\n\nCulture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for vivid golden-yellow coloration and tight, ruffled cluster formation. Colonizes grain in 5–10 days. Requires strong fresh air exchange — CO2 buildup causes long stems and small caps. Fruit at 64–77°F with 85–90% humidity.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "Luz del sol en forma de hongo — y la especie de Ostra con mayor contenido de ergotionina. La ergotionina es un potente antioxidante sintetizado solo por hongos que se concentra en las mitocondrias humanas y protege contra el daño oxidativo ligado al envejecimiento. Culture Bank — 10cc de micelio aislado en laboratorio, seleccionado para color dorado intenso y formación de racimos compactos.\n\nColoniza grano en 5–10 días. Requiere buen intercambio de aire fresco. Fructificar a 18–25°C con 85–90% humedad.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'yellow-oyster', scientificName: 'Pleurotus citrinopileatus',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc4v', name: '10cc', price: 1799, stock: 35, sku: 'YOL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '5–10 days', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'liquid-culture', 'oyster'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus citrinopileatus is the richest dietary source of ergothioneine among all cultivated Oyster species — a distinction that has attracted significant scientific attention. Ergothioneine (EGT) is a sulfur-containing amino acid synthesized exclusively by fungi and certain bacteria. Unlike most antioxidants, EGT is actively transported into human cells via the OCTN1 transporter, where it concentrates in mitochondria, the nucleus, and erythrocytes. Its role in protecting against oxidative stress linked to neurodegeneration, cardiovascular disease, and aging is the subject of over 100 published studies.\n\nPlasma EGT levels decline with age and are consistently lower in patients with Parkinson's disease, mild cognitive impairment, and cardiovascular disease — suggesting it may function as a longevity vitamin. A 2020 epidemiological study (Singapore Chinese Health Study, n=663) found that dietary mushroom consumption was inversely associated with mild cognitive impairment, with a 50% reduced odds ratio at 2+ portions per week.\n\nAdditionally, P. citrinopileatus contains mevinolin (natural lovastatin analog) and high beta-glucan content, providing complementary cardiovascular and immune benefits.",
      es: "Pleurotus citrinopileatus es la fuente dietética más rica en ergotionina entre todas las especies de Ostra cultivadas. La EGT es un aminoácido azufrado sintetizado exclusivamente por hongos que se concentra activamente en las mitocondrias, el núcleo y los eritrocitos humanos.\n\nLos niveles plasmáticos de EGT disminuyen con la edad y son consistentemente más bajos en pacientes con Parkinson, deterioro cognitivo leve y enfermedades cardiovasculares. Un estudio epidemiológico de 2020 (Singapore Chinese Health Study, n=663) encontró que el consumo de hongos se asoció inversamente con el deterioro cognitivo leve, con una reducción del 50% en la razón de probabilidades con 2+ porciones semanales.",
    },
    keyBenefits: [
      { icon: 'sun', label: 'Longevity Antioxidant', detail: 'Highest ergothioneine of any Oyster species — transported into human mitochondria via dedicated OCTN1 transporter' },
      { icon: 'brain', label: 'Cognitive Defense', detail: 'Low plasma ergothioneine linked to Parkinson\'s and MCI; 50% lower cognitive impairment odds with weekly consumption (2020 RCT)' },
      { icon: 'heart', label: 'Cholesterol Control', detail: 'Mevinolin (natural lovastatin analog) reduces LDL through the same mechanism as pharmaceutical statins' },
      { icon: 'shield', label: 'Immune Support', detail: 'Beta-glucan polysaccharides and B-vitamin complex support immune function and cellular energy metabolism' },
    ],
  },
  'reishi-liquid-culture': {
    id: 'lc5', slug: 'reishi-liquid-culture',
    name: { en: 'Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi' },
    description: {
      en: "The most clinically researched medicinal mushroom on Earth. Over 2,000 years in Chinese pharmacopoeia. 400+ identified bioactive compounds including ganoderic acids (triterpenoids), beta-glucan polysaccharides, and immunomodulating proteins. Clinical evidence supports: immune modulation, anti-tumor activity, cortisol regulation, blood pressure reduction, liver protection, and anti-anxiety effects.\n\nCulture Bank — 10cc of lab-isolated Ganoderma lucidum mycelium in nutrient broth, selected for high triterpenoid content and reliable fruiting body formation. Colonizes grain in 5–10 days; full development to harvest takes 90–120 days — this is not a fast grow. Patience is the primary skill required.\n\nThe lacquered red-orange fruiting body is too bitter and woody to eat — best processed as a dual-extract tincture (water + alcohol) to capture both beta-glucans and triterpenoids. Not recommended for beginners.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo medicinal más investigado clínicamente del mundo. Más de 2,000 años en la farmacopea china. 400+ compuestos bioactivos identificados incluyendo ácidos ganodéricos, polisacáridos beta-glucanos y proteínas inmunomoduladoras. Evidencia clínica: modulación inmune, actividad antitumoral, regulación de cortisol, reducción de presión arterial, protección hepática y efectos ansiolíticos.\n\nCulture Bank — 10cc de micelio de Ganoderma lucidum aislado en laboratorio, seleccionado para alto contenido de triterpenoides. Coloniza grano en 5–10 días; desarrollo completo a cosecha tarda 90–120 días. No recomendado para principiantes.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'reishi', scientificName: 'Ganoderma lucidum',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc5v', name: '10cc', price: 1799, stock: 30, sku: 'REL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Ganoderma lucidum contains the most complex pharmacological profile of any known medicinal mushroom: over 400 identified bioactive compounds across six primary categories — polysaccharides (beta-glucans), triterpenoids (ganoderic acids), proteins, steroids, alkaloids, and fatty acids.\n\nThe triterpenoids are unique to Reishi among cultivated medicinal fungi. Ganoderic acids A, B, C, and D have demonstrated direct inhibition of HMG-CoA reductase (the same target as pharmaceutical statins), angiotensin-converting enzyme (ACE) for blood pressure, and 5-alpha-reductase. Over 100 individual ganoderic acid structures have been isolated and characterized.\n\nAdaptogenic effects are mediated through the HPA (hypothalamic-pituitary-adrenal) axis. Clinical studies show Reishi supplementation reduces salivary cortisol, improves sleep quality (via effects on adenosine receptors), and reduces fatigue in cancer patients (JAMA Oncology, 2016). The beta-glucan fraction is responsible for immune modulation — meta-analyses show significant enhancement of NK cell activity and Th1/Th2 balance. For cancer applications, Reishi is used as an adjunct (not primary) therapy; a 2016 Cochrane systematic review found insufficient evidence to recommend as primary treatment but noted meaningful supportive effects.",
      es: "Ganoderma lucidum contiene el perfil farmacológico más complejo de cualquier hongo medicinal conocido: más de 400 compuestos bioactivos identificados en seis categorías principales — polisacáridos, triterpenoides (ácidos ganodéricos), proteínas, esteroides, alcaloides y ácidos grasos.\n\nLos triterpenoides son únicos del Reishi entre los hongos medicinales cultivados. Los ácidos ganodéricos A, B, C y D han demostrado inhibición directa de HMG-CoA reductasa (mismo objetivo que las estatinas farmacéuticas) y la enzima convertidora de angiotensina (ECA) para la presión arterial.\n\nLos efectos adaptogénicos se median a través del eje HPA. Estudios clínicos muestran que la suplementación con Reishi reduce el cortisol salival, mejora la calidad del sueño y reduce la fatiga en pacientes con cáncer (JAMA Oncology, 2016).",
    },
    keyBenefits: [
      { icon: 'shield', label: '400+ Bioactives', detail: 'The most pharmacologically complex medicinal mushroom — ganoderic acids, beta-glucans, and immunomodulating proteins' },
      { icon: 'leaf', label: 'Cortisol & Stress', detail: 'Reduces salivary cortisol and regulates the HPA axis — clinical evidence for adaptogenic effects with consistent use' },
      { icon: 'activity', label: 'Immune & Anti-tumor', detail: 'NK cell activation and Th1/Th2 immune balance confirmed in meta-analyses; adjunct use in oncology studied' },
      { icon: 'heart', label: 'Cardiovascular & Sleep', detail: 'Ganoderic acids inhibit HMG-CoA reductase and ACE; adenosine receptor effects improve sleep quality (JAMA Oncology 2016)' },
    ],
  },
  'shiitake-liquid-culture': {
    id: 'lc6', slug: 'shiitake-liquid-culture',
    name: { en: 'Shiitake Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Shiitake' },
    description: {
      en: "The umami king — cultivated for over 1,000 years in East Asia and the only edible mushroom with an FDA Orphan Drug designation (lentinan, for cancer immunotherapy). Lentinula edodes also contains eritadenine (lowers LDL cholesterol) and AHCC — a compound used in Japanese hospitals alongside chemotherapy.\n\nCulture Bank — 10cc of lab-isolated mycelium in nutrient broth, selected for thick caps, dense gills, and the rich smoky flavor profile chefs demand. Colonizes grain in 5–10 days. Two paths from here: sawdust blocks yield first pins in 8–12 weeks; oak logs colonize over 6–12 months and then produce perennial flushes for 3–5 years with dramatically superior flavor and texture.\n\nPro tip: trigger fruiting with a cold-shock soak (50°F water for 12–24 hours) once substrate is fully colonized.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El rey del umami — cultivado durante más de 1,000 años en Asia Oriental y el único hongo comestible con designación de Medicamento Huérfano FDA (lentinan). Culture Bank — 10cc de micelio de Lentinula edodes aislado en laboratorio, seleccionado para sombreros gruesos y el perfil de sabor umami ahumado que exigen los chefs.\n\nColoniza grano en 5–10 días. En bloques de aserrín: primeros pines en 8–12 semanas. En troncos de roble: cosecha perenne 3–5 años con sabor y textura superiores. Pro tip: detonar fructificación con baño frío (10°C por 12–24 horas).\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'shiitake', scientificName: 'Lentinula edodes',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc6v', name: '10cc', price: 1799, stock: 45, sku: 'SHL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '5–10 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust blocks or oak logs', expectedYield: 'Multiple flushes (perennial on logs)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'liquid-culture', 'shiitake'], relatedProducts: [],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Lentinula edodes is the most studied edible mushroom in the world, and uniquely, the only edible species with a compound holding FDA Orphan Drug designation. Lentinan — a highly purified beta-1,3-glucan — received this designation for use as a cancer immunotherapy adjunct. It is administered intravenously in Japanese hospitals alongside chemotherapy, with meta-analyses showing improved survival outcomes in gastric cancer (Hazard Ratio 0.67, 95% CI 0.52–0.86).\n\nEritadenine is a unique Shiitake-exclusive compound that lowers plasma cholesterol through a distinct mechanism from statins: it inhibits the enzyme that converts dietary cholesterol into its storage form. Clinical trials show reductions of 15–25% in total cholesterol after 7 days of daily consumption.\n\nAHCC (Active Hexose Correlated Compound) is a proprietary preparation derived from Shiitake mycelia, used as a standard adjunct to chemotherapy in Japan. A 2016 randomized trial (n=87) showed AHCC significantly improved NK cell activity vs. placebo in patients with advanced cancer. Shiitake also contains lenthionine — the compound responsible for its distinctive aroma — which has demonstrated platelet aggregation inhibition (anticoagulant effect) in laboratory studies.",
      es: "Lentinula edodes es el hongo comestible más estudiado del mundo y el único con un compuesto con designación de Medicamento Huérfano FDA. El Lentinan — un beta-1,3-glucano altamente purificado — se administra intravenosamente en hospitales japoneses junto a la quimioterapia, con meta-análisis que muestran mejoras en la supervivencia en cáncer gástrico (HR 0.67).\n\nLa eritadenina es un compuesto exclusivo del Shiitake que reduce el colesterol plasmático a través de un mecanismo distinto al de las estatinas, con reducciones del 15–25% en colesterol total después de 7 días de consumo diario.\n\nEl AHCC (compuesto de hexosa activa correlacionada), derivado del micelio de Shiitake, es un adjunto estándar de quimioterapia en Japón con evidencia publicada de mejora en la actividad de células NK.",
    },
    keyBenefits: [
      { icon: 'shield', label: 'FDA Orphan Drug', detail: 'Lentinan holds FDA Orphan Drug status — administered IV in Japanese hospitals alongside chemotherapy for gastric cancer' },
      { icon: 'heart', label: 'Cholesterol Reduction', detail: 'Eritadenine uniquely inhibits dietary cholesterol conversion — 15–25% reduction in total cholesterol in 7-day clinical trials' },
      { icon: 'activity', label: 'Cancer Adjunct (AHCC)', detail: 'AHCC from Shiitake mycelium significantly improves NK cell activity vs. placebo in published oncology RCTs' },
      { icon: 'leaf', label: 'Antiviral Compounds', detail: 'Lentinan and lenthionine demonstrate activity against HIV, hepatitis B, and influenza in controlled laboratory studies' },
    ],
  },
  'cordyceps-militaris-liquid-culture': {
    id: 'lc7', slug: 'cordyceps-militaris-liquid-culture',
    name: { en: 'Cordyceps Militaris Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Cordyceps Militaris' },
    description: {
      en: "The athlete's mushroom — and the only cultivatable alternative to wild Ophiocordyceps sinensis, which trades at $20,000 per kg on Asian markets. Cordyceps militaris produces the same key bioactives (cordycepin, adenosine) through a completely sustainable lab process, with no wild harvesting required.\n\nCordycepin mimics adenosine in the body, increasing ATP production at the cellular level. Randomized trials show improvements in VO2 max, time to exhaustion, and lactate clearance in trained athletes. Also studied for immune modulation, kidney protection, and libido support.\n\nCulture Bank — 10cc of lab-isolated C. militaris mycelium in nutrient broth, selected for high cordycepin production and vivid orange stroma formation. Colonizes cooked grain in 14–21 days — slower than Oysters but worth the wait. Requires a 12h light/dark cycle during fruiting to trigger stroma development.\n\nWarning: Cordyceps is an advanced grow with strict environmental requirements. Not recommended as a first species.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "El hongo del atleta — y la única alternativa cultivable al Ophiocordyceps sinensis silvestre, que se comercializa a $20,000 por kg en mercados asiáticos. Cordyceps militaris produce los mismos bioactivos clave (cordycepina, adenosina) mediante un proceso de laboratorio completamente sostenible.\n\nLa cordycepina mimetiza la adenosina en el cuerpo, aumentando la producción de ATP celular. Ensayos aleatorios muestran mejoras en VO2 máx, tiempo hasta el agotamiento y aclaramiento de lactato en atletas entrenados.\n\nCulture Bank — 10cc de micelio de C. militaris aislado en laboratorio, seleccionado para alta producción de cordycepina y formación de estromatos naranjas vibrantes. Coloniza grano cocido en 14–21 días. Requiere ciclo luz/oscuridad 12h para detonar la formación de estromatos.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'cordyceps', scientificName: 'Cordyceps militaris',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc7v', name: '10cc', price: 1799, stock: 25, sku: 'CML-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '14–21 days (on grain/rice)', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Cooked grain (wheat berries, brown rice)', expectedYield: '50–150g dry per substrate', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'cordyceps', 'performance'], relatedProducts: [],
    howToUseSteps: CORDYCEPS_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Cordycepin (3'-deoxyadenosine) is the primary bioactive compound in Cordyceps militaris — a structural analog of adenosine that competes for adenosine receptors throughout the body. Its most studied effect is on cellular energy metabolism: by mimicking adenosine, cordycepin enhances ATP synthesis in mitochondria, increases oxygen utilization efficiency, and delays lactate accumulation in muscle tissue during exercise.\n\nA landmark 2010 randomized, double-blind, placebo-controlled trial (Chen et al., Journal of Alternative and Complementary Medicine) showed an 11.8% improvement in VO2 max in healthy older adults after 12 weeks of Cordyceps supplementation vs. placebo. A 2017 study in healthy young adults (University of Georgia) showed similar improvements in time-trial performance and lactate threshold.\n\nBeyond athletic performance, cordycepin has demonstrated: nephroprotective effects (kidney function protection, studied in chronic kidney disease models), immunomodulation via beta-glucan polysaccharides, and anti-tumor activity through apoptosis induction in cancer cell lines. Wild Ophiocordyceps sinensis contains the same bioactives but costs $20,000/kg — C. militaris cultivated on grain produces equivalent cordycepin concentrations at a fraction of the cost.",
      es: "La cordycepina (3'-desoxiadenosina) es el principal compuesto bioactivo de Cordyceps militaris — un análogo estructural de la adenosina que compite por sus receptores en todo el cuerpo. Su efecto más estudiado es sobre el metabolismo energético celular: mejora la síntesis de ATP mitocondrial, aumenta la eficiencia de utilización del oxígeno y retrasa la acumulación de lactato en el músculo durante el ejercicio.\n\nUn ensayo clave de 2010 (Chen et al., Journal of Alternative and Complementary Medicine) mostró una mejora del 11.8% en el VO2 máx en adultos mayores sanos después de 12 semanas de suplementación. Un estudio de 2017 en adultos jóvenes sanos mostró mejoras similares en el rendimiento en prueba de tiempo y el umbral de lactato.",
    },
    keyBenefits: [
      { icon: 'zap', label: 'ATP Synthesis', detail: 'Cordycepin mimics adenosine to enhance mitochondrial ATP production — the fundamental energy currency of every cell' },
      { icon: 'activity', label: '11.8% VO2 Max Gain', detail: 'Double-blind RCT (2010): 11.8% improvement in VO2 max vs. placebo after 12 weeks in healthy adults' },
      { icon: 'heart', label: 'Kidney Protection', detail: 'Nephroprotective compounds studied in chronic kidney disease models — traditional use confirmed by modern research' },
      { icon: 'shield', label: 'Immune + Anti-tumor', detail: 'Beta-glucan polysaccharides enhance NK cell activity; cordycepin induces apoptosis in cancer cell lines in vitro' },
    ],
  },
  'antler-reishi-liquid-culture': {
    id: 'lc8', slug: 'antler-reishi-liquid-culture',
    name: { en: 'Antler Reishi Liquid Culture Syringe', es: 'Jeringa de Cultivo Líquido Reishi Antler' },
    description: {
      en: "Ganoderma multipileum — a distinct species within the Ganoderma lucidum complex, sold and studied under the \"G. lucidum\" name until DNA sequencing separated it out in 2009. Grown under elevated CO2, it takes to dramatic antler and stag-horn fruiting body formation more readily than standard G. lucidum strains, instead of the classic kidney-shaped cap. Shares the same core bioactive compound classes — ganoderic acids, beta-glucan polysaccharides, immunomodulating proteins — as standard Reishi, though as a separate species exact concentrations haven't been directly compared. Different species, different growing experience.\n\nThe antler form is prized by tincture makers for its increased surface area (more exposed tissue per gram), easier processing, and striking visual presentation for display or gifting. Higher CO2 during the full fruiting cycle suppresses cap formation and drives vertical antler growth — managing this precisely is what makes this grow uniquely satisfying for advanced cultivators.\n\nCulture Bank — 10cc of lab-isolated Ganoderma multipileum mycelium in nutrient broth, grown under our antler-cultivation protocol. Colonizes grain in 5–10 days. Maintain CO2 above 5,000 ppm throughout fruiting by limiting fresh air exchange — the opposite of most species.\n\nNote: if FAE is too high, the culture will revert to cap formation. Advanced growers only.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card. Refrigerate upon arrival. Viable up to 2 months refrigerated.",
      es: "Ganoderma multipileum — una especie distinta dentro del complejo Ganoderma lucidum, vendida y estudiada bajo el nombre \"G. lucidum\" hasta que la secuenciación de ADN la separó en 2009. Cultivado bajo CO2 elevado, forma astas y cuernos de ciervo más fácilmente que las cepas estándar de G. lucidum, en lugar del clásico sombrero renal. Comparte las mismas clases principales de compuestos bioactivos — ácidos ganodéricos, polisacáridos beta-glucanos, proteínas inmunomoduladoras — que el Reishi estándar, aunque al ser una especie separada las concentraciones exactas no se han comparado directamente. Especie distinta, experiencia de cultivo distinta.\n\nLa forma antler es apreciada por los fabricantes de tinturas por su mayor superficie (más tejido expuesto por gramo) y presentación visual impactante. Mantener CO2 por encima de 5,000 ppm durante toda la fructificación limitando el intercambio de aire — lo opuesto a la mayoría de las especies.\n\nCulture Bank — 10cc de micelio de Ganoderma multipileum aislado en laboratorio, producido bajo nuestro protocolo de cultivo antler. Solo cultivadores avanzados.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms. Refrigerar al recibir. Viable hasta 2 meses refrigerado.",
    },
    category: 'spawn', subcategory: 'Liquid Culture', species: 'antler-reishi', scientificName: 'Ganoderma multipileum',
    price: 1799, compareAtPrice: 1999,
    variants: [{ id: 'lc8v', name: '10cc', price: 1799, stock: 20, sku: 'ARL-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '5–10 days (on grain)', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'liquid-culture', 'reishi', 'antler'], relatedProducts: ['reishi-liquid-culture'],
    howToUseSteps: LC_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Antler Reishi is Ganoderma multipileum, a species within the broader Ganoderma lucidum complex that was only formally separated from G. lucidum in 2009 through ITS DNA sequencing — before that, it was sold and studied under the \"G. lucidum\" name alongside several related Asian lingzhi species. Cultivated under deliberately elevated CO2 concentrations (above 5,000 ppm), it suppresses cap formation and drives vertical antler or stag-horn growth — vendors report it takes to antler form more readily than typical G. lucidum strains under the same conditions.\n\nThe antler form exposes significantly more tissue surface area per gram than a flat kidney-shaped cap. For dual-extraction tincture preparation, this means better solvent penetration, higher extraction efficiency of triterpenoids (alcohol-soluble) and beta-glucans (water-soluble), and more consistent batch-to-batch yield. Professional tincture makers consistently prefer antler form for this reason.\n\nAs a member of the Ganoderma lucidum species complex, G. multipileum shares the same core pharmacological categories documented for standard Reishi — ganoderic acid inhibition of HMG-CoA reductase and ACE, beta-glucan immunomodulation, cortisol regulation via the HPA axis, NK cell activation, and hepatoprotective effects — though as a distinct species, exact compound concentrations haven't been directly compared head-to-head in published studies. See the standard Reishi listing for full clinical references specific to G. lucidum.",
      es: "El Reishi Antler es Ganoderma multipileum, una especie dentro del complejo más amplio de Ganoderma lucidum que se separó formalmente de G. lucidum recién en 2009 mediante secuenciación de ADN (ITS) — antes de eso, se vendía y estudiaba bajo el nombre \"G. lucidum\" junto a varias especies relacionadas de lingzhi asiático. Cultivado bajo concentraciones de CO2 deliberadamente elevadas (por encima de 5,000 ppm), suprime la formación del sombrero y dirige el crecimiento vertical en forma de asta — los vendedores reportan que forma astas más fácilmente que las cepas típicas de G. lucidum bajo las mismas condiciones.\n\nLa forma antler expone significativamente más superficie de tejido por gramo que un sombrero renal plano. Para la preparación de tintura de doble extracción, esto significa mejor penetración del solvente y mayor eficiencia de extracción de triterpenoides y beta-glucanos.\n\nComo miembro del complejo Ganoderma lucidum, G. multipileum comparte las mismas categorías farmacológicas centrales documentadas para el Reishi estándar — inhibición de HMG-CoA reductasa y ACE por ácidos ganodéricos, inmunomodulación por beta-glucanos, regulación de cortisol vía eje HPA — aunque al ser una especie distinta, las concentraciones exactas de compuestos no se han comparado directamente en estudios publicados.",
    },
    keyBenefits: [
      { icon: 'shield', label: 'Shared Bioactive Classes', detail: 'Same core compound classes as classic Reishi — ganoderic acids, beta-glucans, and immunomodulating proteins — as part of the Ganoderma lucidum complex' },
      { icon: 'leaf', label: 'Superior Extraction', detail: 'Antler form exposes more surface area per gram — higher tincture yield of both triterpenoids and beta-glucans' },
      { icon: 'activity', label: 'Adaptogen', detail: 'Ganoderma triterpenoids reduce cortisol via HPA axis regulation; documented across the species complex for stress resilience and sleep quality' },
      { icon: 'heart', label: 'Advanced Cultivator', detail: 'Requires sustained CO2 above 5,000 ppm throughout fruiting — the most technically demanding Ganoderma grow' },
    ],
  },
}

const GRAIN_HOW_TO_USE_STEPS = [
  'Let the bag reach room temperature before opening or injecting — cold substrate slows colonization.',
  'Sterilize the injection port with the included alcohol swab and let it dry completely.',
  'Inject 2.5–5cc of liquid culture (or 1–2cc of spore solution) directly through the self-healing port.',
  'Press the swabbed area firmly over the injection point — the port seals itself around the needle hole.',
  'Gently massage the bag to spread the inoculation point through the grain without shaking excessively.',
  'Incubate at 70–75°F in darkness. Watch for contamination (green, black, or pink patches) before colonization completes.',
  'Once fully colonized (white throughout), use as spawn: break up and mix into bulk substrate at a 1:5–1:10 ratio, or transfer directly to a monotub.',
]

const GRAIN_SPECS_BASE = {
  bagSize: '3 lb — 10 × 6 × 6 in bag',
  sterilization: 'Autoclaved 15 PSI / 100 min — verified per batch with biological indicators + temp/pressure logging',
  moisture: '~50% — hydrated and ready to inoculate',
  recommendedInoculation: '2.5–5cc liquid culture or 1–2cc spore solution',
  shelfLife: '4–6 months, stored cool and dark',
}

const GRAIN_PRODUCTS: Record<string, Product> = {
  'rye-grain-spawn-bag-3lb': {
    id: 'gb1', slug: 'rye-grain-spawn-bag-3lb',
    name: { en: 'Rye Berry Sterile Grain Bag — 3lb', es: 'Bolsa de Grano Esterilizado Centeno — 3lb' },
    description: {
      en: "The grain every serious grower reaches for first. Rye berries carry the highest surface area of any large grain we carry, holding moisture evenly through the full colonization cycle — no dry pockets, no stalled mycelium. It works reliably across nearly every cultivated species, which is why it's the default substrate in most commercial spawn operations.\n\nOur 3lb bags come pre-hydrated to ~50% moisture and sterilized in a commercial autoclave at 15 PSI, then batch-tested with biological indicators before shipping. Inject directly through the self-healing filter patch — no repackaging, no additional prep.\n\nEach bag: 3lb sterilized rye berries · 0.2-micron filter patch · self-healing injection port · shrooms instruction card. Store cool and dark until use.",
      es: "El grano al que recurre primero todo cultivador serio. El centeno tiene la mayor superficie de cualquier grano grande, reteniendo humedad de forma pareja durante toda la colonización. Funciona de forma confiable en casi cualquier especie cultivada.\n\nNuestras bolsas de 3lb vienen pre-hidratadas al ~50% de humedad y esterilizadas en autoclave comercial a 15 PSI, luego probadas por lote antes de enviar.\n\nCada bolsa: 3lb de centeno esterilizado · parche filtrante de 0.2 micras · puerto de inyección autosellante · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb1v', name: '3 lb', price: 1999, stock: 60, sku: 'RYE-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'rye', 'beginner'], relatedProducts: ['blue-oyster-liquid-culture'],
    howToUseSteps: GRAIN_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Rye berries (Secale cereale) owe their cultivation dominance to kernel geometry: an elongated, grooved hull that maximizes surface area relative to volume while still holding structural integrity under autoclave pressure. That surface area translates directly into inoculation points — the locations where mycelium first establishes and begins radiating outward.\n\nEqually important is rye's starch-to-moisture behavior. Its hull absorbs water slowly and releases it slowly, which is why properly hydrated rye rarely turns anaerobic or mushy — the two failure modes that stall colonization in other grains. This forgiving moisture curve is the primary reason rye remains the substrate taught in nearly every cultivation course.",
      es: "El centeno (Secale cereale) domina el cultivo por la geometría de su grano: una cáscara alargada y acanalada que maximiza la superficie relativa al volumen. Esa superficie se traduce directamente en puntos de inoculación.\n\nIgual de importante es su comportamiento de humedad: absorbe y libera agua lentamente, por lo que rara vez se vuelve anaeróbico o pastoso — los dos modos de falla que detienen la colonización en otros granos.",
    },
    grainBagSpecs: { ...GRAIN_SPECS_BASE, colonizationEstimate: '10–14 days once inoculated' },
  },
  'drippy-corn-grain-spawn-bag-3lb': {
    id: 'gb2', slug: 'drippy-corn-grain-spawn-bag-3lb',
    name: { en: 'Drippy Corn Sterile Grain Bag — 3lb', es: 'Bolsa Esterilizada Drippy Corn (Maíz Húmedo) — 3lb' },
    description: {
      en: "Known across the grow community as \"Drippy Corn\" — whole-kernel corn packs more stored energy per bag than any other grain in our lineup, built for growers scaling from a single spawn bag into large-format bulk substrate. Its starch content keeps the substrate hydrated deep into colonization, even in drier grow spaces where leaner grains dry out.\n\nEach bag is sterilized in a commercial autoclave at 15 PSI and pre-hydrated to spec, then batch-tested with biological indicators before it ships — ready to inject the moment it arrives. Corn's larger kernel size means slightly slower initial colonization than small-grain options, but it pays that back with substrate volume — one bag of corn expands further as bulk spawn than the equivalent weight in rye or millet.\n\nEach bag: 3lb sterilized whole corn · 0.2-micron filter patch · self-healing injection port · shrooms instruction card. Store cool and dark until use.",
      es: "Conocido en la comunidad cultivadora como \"Drippy Corn\" — el maíz en grano entero contiene más energía almacenada por bolsa que cualquier otro grano de nuestra línea, pensado para escalar de una bolsa a sustrato a granel de gran formato. Su contenido de almidón mantiene el sustrato hidratado incluso en espacios de cultivo más secos.\n\nCada bolsa se esteriliza en autoclave comercial a 15 PSI e hidrata a especificación, luego se prueba por lote con indicadores biológicos antes de enviarse — lista para inyectar apenas llega.\n\nCada bolsa: 3lb de maíz esterilizado · parche filtrante de 0.2 micras · puerto de inyección autosellante · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb2v', name: '3 lb', price: 1999, stock: 55, sku: 'CRN-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'corn', 'drippy-corn', 'beginner'], relatedProducts: [],
    howToUseSteps: GRAIN_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Whole corn's nutritional density comes from its endosperm — a starch-and-protein reserve several times larger per kernel than rye or millet. That reserve is what lets colonized corn spawn punch above its weight when mixed into bulk substrate: a 1:8 spawn ratio with corn delivers more usable nutrition per bag than the same ratio with a smaller grain.\n\nThe tradeoff is kernel size: fewer, larger inoculation points mean mycelium takes a few more days to establish full network coverage compared to millet or milo. Growers who prioritize bulk-substrate economics over speed consistently choose corn.",
      es: "La densidad nutricional del maíz proviene de su endospermo — una reserva de almidón y proteína varias veces mayor por grano que el centeno o el mijo. Esa reserva es lo que permite que el spawn de maíz rinda más al mezclarse en sustrato a granel.\n\nLa contrapartida es el tamaño del grano: menos puntos de inoculación implican que el micelio tarda algunos días más en cubrir toda la red, comparado con mijo o milo.",
    },
    grainBagSpecs: { ...GRAIN_SPECS_BASE, colonizationEstimate: '10–14 days once inoculated' },
  },
  'milo-grain-spawn-bag-3lb': {
    id: 'gb3', slug: 'milo-grain-spawn-bag-3lb',
    name: { en: 'Milo (Sorghum) Sterile Grain Bag — 3lb', es: 'Bolsa de Grano Esterilizado Milo (Sorgo) — 3lb' },
    description: {
      en: "Small, uniform sorghum kernels create thousands of inoculation points per bag — fast, even colonization. Milo is the substrate of choice for growers running multiple bags at once, favored across the cultivation community for its speed and consistency.\n\nBecause the kernels are small and consistent in size, hydration is easier to get right on a first attempt than with oats or corn — one of the more forgiving grains for a first grain bag. Every bag is sterilized in a commercial autoclave at 15 PSI and batch-tested with biological indicators before it ships, so you're never gambling on sterility. Expect visible colonization within a week under normal incubation conditions.\n\nEach bag: 3lb sterilized milo · 0.2-micron filter patch · self-healing injection port · shrooms instruction card. Store cool and dark until use.",
      es: "Granos de sorgo pequeños y uniformes crean miles de puntos de inoculación por bolsa — colonización rápida y pareja. Favorito de cultivadores que corren varias bolsas a la vez.\n\nAl ser granos pequeños y consistentes, la hidratación es más fácil de acertar en un primer intento que con avena o maíz. Cada bolsa se esteriliza en autoclave comercial a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse.\n\nCada bolsa: 3lb de milo esterilizado · parche filtrante de 0.2 micras · puerto de inyección autosellante · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb3v', name: '3 lb', price: 1999, stock: 65, sku: 'MLO-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'milo', 'beginner'], relatedProducts: ['pink-oyster-liquid-culture'],
    howToUseSteps: GRAIN_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Sorghum's small, rounded kernel gives it one of the highest inoculation-point densities per pound of any common spawn grain — more individual grains means more discrete sites where mycelium first establishes, which is what drives faster visible colonization in the first week.\n\nMilo is also cheaper to produce at scale than rye or oats, which is why it's the substrate most cited in grower communities (Shroomery, r/MushroomGrowers) for running many bags at once — the same autoclave and hydration protocol applies across every grain we carry, so sterility and moisture consistency don't change.",
      es: "El grano pequeño y redondeado del sorgo le da una de las densidades de puntos de inoculación más altas por libra de cualquier grano común — más granos individuales significa más sitios donde el micelio se establece primero.\n\nEl milo también es más barato de producir a escala que el centeno o la avena, por eso es el sustrato más citado en comunidades de cultivo para correr muchas bolsas a la vez.",
    },
    grainBagSpecs: { ...GRAIN_SPECS_BASE, colonizationEstimate: '7–10 days once inoculated' },
  },
  'millet-grain-spawn-bag-3lb': {
    id: 'gb4', slug: 'millet-grain-spawn-bag-3lb',
    name: { en: 'Millet Sterile Grain Bag — 3lb', es: 'Bolsa de Grano Esterilizado Mijo — 3lb' },
    description: {
      en: "The smallest kernel we carry — and the highest surface-area-to-volume ratio of any grain in our lineup. More surface area means more contact points for mycelium to establish from, which is why millet consistently colonizes faster than rye or corn at the same inoculation volume. It also carries a naturally lower endospore load than larger grains, giving mycelium a cleaner head start against competing microbes.\n\nThe tradeoff is handling: millet's small, light kernels shift and settle more than larger grains, so a gentler hand when massaging the bag pays off in more even coverage. Every bag is sterilized in a commercial autoclave at 15 PSI and batch-tested with biological indicators before it ships. Recommended for growers past their first few grows.\n\nEach bag: 3lb sterilized millet · 0.2-micron filter patch · self-healing injection port · shrooms instruction card. Store cool and dark until use.",
      es: "El grano más pequeño de nuestra línea — y la mayor relación superficie-volumen. Más superficie significa más puntos de contacto para que el micelio se establezca, por lo que el mijo coloniza consistentemente más rápido que el centeno o el maíz. También tiene una carga natural de endosporas más baja, dando al micelio una ventaja más limpia frente a microbios competidores.\n\nLa contrapartida es el manejo: los granos pequeños y livianos se acomodan de forma distinta, así que una mano más suave al masajear la bolsa da mejores resultados. Cada bolsa se esteriliza en autoclave comercial a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse.\n\nCada bolsa: 3lb de mijo esterilizado · parche filtrante de 0.2 micras · puerto de inyección autosellante · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb4v', name: '3 lb', price: 1999, stock: 45, sku: 'MLT-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'millet', 'intermediate'], relatedProducts: ['lions-mane-liquid-culture'],
    howToUseSteps: GRAIN_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Millet's kernel diameter is roughly a third that of rye, which — for a fixed bag weight — multiplies the total number of individual grains, and therefore the number of discrete inoculation points, several times over. This is the direct mechanical reason small-grain substrates colonize faster than large-grain ones at equal inoculation volume.\n\nMillet also measures lower in natural bacterial endospore load than wheat-family grains (rye, wheat, barley), reducing the population of heat-resistant contaminants that can survive autoclave sterilization and compete with mycelium during the early colonization window.",
      es: "El diámetro del grano de mijo es aproximadamente un tercio del centeno, lo que — a igual peso de bolsa — multiplica el número total de granos individuales y, por lo tanto, de puntos de inoculación.\n\nEl mijo también tiene una carga natural de endosporas bacterianas más baja que los granos de la familia del trigo, reduciendo contaminantes resistentes al calor que sobreviven la esterilización.",
    },
    grainBagSpecs: { ...GRAIN_SPECS_BASE, colonizationEstimate: '5–9 days once inoculated' },
  },
  'oat-grain-spawn-bag-3lb': {
    id: 'gb5', slug: 'oat-grain-spawn-bag-3lb',
    name: { en: 'Oat Groat Sterile Grain Bag — 3lb', es: 'Bolsa de Grano Esterilizado Avena — 3lb' },
    description: {
      en: "Consistently the fastest-colonizing grain in side-by-side comparisons — oat groats are the top pick for aggressive Oyster strains that reward every day shaved off colonization time. Their loose hull structure lets mycelium establish and spread with less resistance than denser grains.\n\nThat same loose structure is why oats reward precision: over-hydrate and they turn mushy before colonization finishes; under-hydrate and growth stalls. Our bags ship pre-hydrated to the correct moisture target so you're starting from spec, not guessing — and every bag is sterilized in a commercial autoclave at 15 PSI, batch-tested with biological indicators before it ships.\n\nEach bag: 3lb sterilized oat groats · 0.2-micron filter patch · self-healing injection port · shrooms instruction card. Store cool and dark until use.",
      es: "Consistentemente el grano de colonización más rápida en comparaciones directas — la avena es la primera opción para cepas agresivas de Ostra. Su estructura de cáscara suelta permite que el micelio se establezca y expanda con menos resistencia.\n\nEsa misma estructura hace que la avena exija precisión: con exceso de humedad se vuelve pastosa antes de terminar de colonizar; con poca, el crecimiento se detiene. Nuestras bolsas se envían pre-hidratadas al punto correcto, y cada bolsa se esteriliza en autoclave comercial a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse.\n\nCada bolsa: 3lb de avena esterilizada · parche filtrante de 0.2 micras · puerto de inyección autosellante · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Grain Bags',
    price: 1999, compareAtPrice: 2299,
    variants: [{ id: 'gb5v', name: '3 lb', price: 1999, stock: 40, sku: 'OAT-3LB' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['grain-bag', 'oats', 'intermediate'], relatedProducts: ['blue-oyster-liquid-culture', 'pink-oyster-liquid-culture'],
    howToUseSteps: GRAIN_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Oat groats retain their bran layer, which is more porous and less dense than the hull structures of rye or corn. That porosity lowers mechanical resistance to hyphal growth, which is the primary driver behind oats' consistent lead in colonization-speed comparisons.\n\nThe same porosity makes oats considerably more sensitive to moisture content than denser grains — small deviations from the ~50% target compound quickly into either anaerobic mush or stalled dry patches, which is why oats are generally recommended after a grower has dialed in hydration technique on a more forgiving grain.",
      es: "La avena conserva su capa de salvado, más porosa y menos densa que la cáscara del centeno o el maíz. Esa porosidad reduce la resistencia mecánica al crecimiento de las hifas, lo que explica su ventaja constante en velocidad de colonización.\n\nEsa misma porosidad hace que la avena sea más sensible al contenido de humedad — pequeñas desviaciones del ~50% objetivo se acumulan rápido en zonas anaeróbicas o secas, por lo que se recomienda después de dominar la hidratación en un grano más indulgente.",
    },
    grainBagSpecs: { ...GRAIN_SPECS_BASE, colonizationEstimate: '5–8 days once inoculated' },
  },
}

const FRUITING_HOW_TO_USE_STEPS = [
  'Unbox and inspect — the block should be solid white with mycelium, no green, black, or pink patches.',
  'Cut a 2–3 inch X or cross slit into the front of the bag, over the filter patch or wherever you want fruiting to begin.',
  'Mist the opening 2–3× daily to hold 85–95% humidity without soaking the block itself.',
  'Set it somewhere with indirect light and real fresh air exchange — stagnant CO2 is the #1 cause of leggy or stalled pins.',
  'Pins appear in 5–10 days. Once caps form, mist morning and evening only, avoiding direct contact with the caps.',
  "Harvest when caps flatten and the edges just begin to curl upward (Oysters) or the spines fully extend (Lion's Mane). Twist and pull at the base.",
  'Rehydrate by soaking the block 1–12 hours, then rest 5–7 days for a second flush. Expect 2–3 total flushes per block.',
]

const REISHI_FRUITING_HOW_TO_USE_STEPS = [
  'Unbox and inspect — the block should be solid white with mycelium, no green, black, or pink patches.',
  'Cut a 2–3 inch X or cross slit into the front of the bag, over the filter patch.',
  'Mist the opening 2–3× daily to hold 85–90% humidity without soaking the block itself.',
  'Set it somewhere with indirect light and steady fresh air exchange at 70–80°F — Reishi is far more patient than Oyster or Lion\'s Mane.',
  'A white, coral-like growth appears first (the antler stage) before it starts forming a cap — this is normal, not a sign of a problem.',
  'The lacquered red-orange cap fully forms and hardens over 60–90+ days. Do not rush harvest — ganoderic acid content builds as the cap matures.',
  'Harvest once the growing white margin stops expanding and the surface has fully hardened. Expect 1–2 flushes total, spaced months apart.',
]

const ANTLER_FRUITING_HOW_TO_USE_STEPS = [
  'Unbox and inspect — the block should be solid white with mycelium, no green, black, or pink patches.',
  'Cut a 2–3 inch X or cross slit into the front of the bag, over the filter patch.',
  'Mist the opening 2× daily to hold 85–90% humidity without soaking the block itself.',
  'Unlike our other fruiting blocks, limit fresh air exchange — keep it in a mostly sealed tub or bag to maintain CO2 above 5,000 ppm. High airflow causes it to revert to a normal kidney-shaped cap instead of antlers.',
  'Set it at 70–82°F. Growth is slow and coral-like at first, branching upward into antler form over several weeks.',
  'If you see a flat cap starting to form instead of branching antlers, seal the container further to raise CO2.',
  'Harvest once the antler tips stop elongating and the surface begins to harden, typically 60–90+ days after cutting. Expect 1–2 flushes.',
]

const BULK_SPECS_BASE = {
  bagSize: '5 lb — sterile hardwood substrate',
  sterilization: 'Autoclaved 15 PSI / 120 min — verified per batch with biological indicators + temp/pressure logging',
  moisture: '~60% — hydrated and ready for spawn',
  recommendedInoculation: '1 lb colonized grain spawn per 5 lb bag (spawn sold separately)',
  shelfLife: '2–3 months, stored cool and dark',
}

const BULK_HOW_TO_USE_STEPS = [
  'Let the bag reach room temperature before opening — cold substrate slows colonization.',
  'Working in a clean, sanitized area (or still-air box), cut the bag open and add 1 lb of fully colonized grain spawn for every 5 lb of substrate. This bag has no injection port — you need grain spawn on hand already, not a liquid culture syringe.',
  'Massage and mix gently through the bag or a clean container until the grain spawn is distributed evenly throughout the substrate.',
  'Reseal or transfer to a clean fruiting container. Incubate at 70–75°F in darkness until fully colonized white throughout, typically 2–3 weeks.',
  'Once colonized, introduce fruiting conditions: fresh air exchange + 85–95% humidity.',
  'Mist 2–3× daily and harvest when caps flatten and the edges just begin to curl upward.',
  "Don't have grain spawn yet? Pair this bag with one of our Grain Bags — inject it with a Liquid Culture syringe first, then use it to inoculate this substrate.",
]

const BULK_REISHI_HOW_TO_USE_STEPS = [
  'Let the bag reach room temperature before opening — cold substrate slows colonization.',
  'Working in a clean, sanitized area (or still-air box), cut the bag open and add 1 lb of fully colonized grain spawn for every 5 lb of substrate. This bag has no injection port — you need grain spawn on hand already, not a liquid culture syringe.',
  'Massage and mix gently through the bag or a clean container until the grain spawn is distributed evenly throughout the substrate.',
  'Reseal or transfer to a clean fruiting container. Incubate at 70–75°F in darkness until fully colonized white throughout, typically 3–4 weeks — Reishi runs slower than Oyster species.',
  'Once colonized, introduce fruiting conditions: 70–80°F with 85–90% humidity and steady fresh air exchange.',
  'A white, coral-like antler stage appears first, developing into the lacquered red-orange conk over 60–90+ days. Do not rush harvest.',
  'Harvest once the growing white margin stops expanding and the surface has fully hardened. Expect 1–2 flushes total, spaced months apart.',
]

const BULK_ANTLER_HOW_TO_USE_STEPS = [
  'Let the bag reach room temperature before opening — cold substrate slows colonization.',
  'Working in a clean, sanitized area (or still-air box), cut the bag open and add 1 lb of fully colonized grain spawn for every 5 lb of substrate. This bag has no injection port — you need grain spawn on hand already, not a liquid culture syringe.',
  'Massage and mix gently through the bag or a clean container until the grain spawn is distributed evenly throughout the substrate.',
  'Reseal or transfer to a clean fruiting container. Incubate at 70–75°F in darkness until fully colonized white throughout, typically 3–4 weeks.',
  'Once colonized, move to fruiting — but unlike our other substrate bags, limit fresh air exchange to hold CO2 above 5,000 ppm and drive antler-shaped growth instead of a normal cap.',
  'Growth is slow and coral-like at first, branching upward into antler form over several weeks at 70–82°F.',
  'Harvest once the antler tips stop elongating and the surface begins to harden, typically 60–90+ days after fruiting begins. Expect 1–2 flushes.',
]

const FRUITING_PRODUCTS: Record<string, Product> = {
  'lions-mane-fruiting-block': {
    id: 'fb1', slug: 'lions-mane-fruiting-block',
    name: { en: "Lion's Mane Fruiting Block", es: 'Bloque Fructificante Melena de León' },
    description: {
      en: "Skip colonization entirely — this block is already fully colonized with our Hericium erinaceus culture, selected for dense pom-pom formation. Cut it open, mist it, and watch pins form within 5–10 days. No injection, no incubation period, no risk of contamination on your end.\n\nSupplemented hardwood sawdust, autoclave-sterilized and colonized in our lab under HEPA-filtered positive pressure. Fruit at 65–75°F with 90–95% humidity and strong fresh air exchange — CO2 buildup causes icicle-form spines instead of the classic pom-pom.\n\nExpect 200–400g on the first flush, with 2–3 total flushes per block over 4–6 weeks.",
      es: "Sáltate la colonización por completo — este bloque ya está completamente colonizado con nuestro cultivo de Hericium erinaceus, seleccionado para formación de pompón denso. Córtalo, rocíalo y verás pines formarse en 5–10 días. Sin inyección, sin incubación, sin riesgo de contaminación de tu parte.\n\nAserrín de madera dura suplementada, esterilizado en autoclave y colonizado en nuestro laboratorio bajo presión positiva con filtración HEPA. Fructificar a 18–24°C con 90–95% humedad y buen intercambio de aire fresco.\n\nEspera 200–400g en el primer flush, con 2–3 flushes totales por bloque en 4–6 semanas.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'lions-mane', scientificName: 'Hericium erinaceus',
    price: 2999,
    variants: [{ id: 'fb1v', name: '5 lb Block', price: 2999, stock: 30, sku: 'LMF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized)', expectedYield: '200–400g per flush, 2–3 flushes', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'lions-mane', 'fruiting-block'], relatedProducts: ['lions-mane-liquid-culture'],
    howToUseSteps: FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['lions-mane-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['lions-mane-liquid-culture'].keyBenefits,
  },
  'blue-oyster-fruiting-block': {
    id: 'fb2', slug: 'blue-oyster-fruiting-block',
    name: { en: 'Blue Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Azul' },
    description: {
      en: "Already colonized, already easy — this is the lowest-effort way to grow mushrooms at home. Our Blue Oyster block arrives fully colonized with Pleurotus ostreatus on hardwood sawdust and straw. Cut it open, mist, and get your first pins within a week.\n\nBlue Oyster is famously forgiving — the block tolerates temperature swings and inconsistent misting better than any other species we carry, which is why it's the block we recommend for a first-timer or a gift. Expect 3–4 dense flushes at 25%+ biological efficiency over 6–8 weeks.\n\nEach block: 5lb pre-colonized Blue Oyster substrate, sealed and ready to fruit. Store in a cool spot out of direct sun until you're ready to cut it open.",
      es: "Ya colonizado, ya fácil — la forma de menor esfuerzo para cultivar hongos en casa. Nuestro bloque de Ostra Azul llega completamente colonizado con Pleurotus ostreatus sobre aserrín y paja. Córtalo, rocíalo y tendrás tus primeros pines en una semana.\n\nLa Ostra Azul es famosamente indulgente — tolera cambios de temperatura y riego inconsistente mejor que cualquier otra especie. Espera 3–4 flushes densos con 25%+ de eficiencia biológica en 6–8 semanas.\n\nCada bloque: 5lb de sustrato de Ostra Azul pre-colonizado, sellado y listo para fructificar.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'blue-oyster', scientificName: 'Pleurotus ostreatus',
    price: 2999,
    variants: [{ id: 'fb2v', name: '5 lb Block', price: 2999, stock: 35, sku: 'BOF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw (pre-colonized)', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['blue-oyster-liquid-culture'],
    howToUseSteps: FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['blue-oyster-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['blue-oyster-liquid-culture'].keyBenefits,
  },
  'shiitake-fruiting-block': {
    id: 'fb3', slug: 'shiitake-fruiting-block',
    name: { en: 'Shiitake Fruiting Block', es: 'Bloque Fructificante Shiitake' },
    description: {
      en: "Already colonized on supplemented hardwood sawdust — skip the 8–12 week wait that a from-scratch Shiitake block normally takes. Cold-shock it (50°F water, 12–24 hours) once it arrives to trigger fruiting, and you'll see pins within 1–2 weeks of that soak.\n\nThe umami king rewards patience with flavor no Oyster species matches — thick caps, deep smoky aroma, and the texture chefs specifically ask for. Expect 2 solid flushes per block.\n\nEach block: 5lb pre-colonized Shiitake substrate, sealed and ready to cold-shock and fruit. Store in a cool spot out of direct sun until you're ready.",
      es: "Ya colonizado en aserrín de madera dura suplementada — sáltate las 8–12 semanas de espera que normalmente toma un bloque de Shiitake desde cero. Aplica un baño de choque frío (10°C, 12–24 horas) al recibirlo para detonar la fructificación, y verás pines en 1–2 semanas.\n\nEl rey del umami recompensa la paciencia con un sabor que ninguna Ostra iguala — sombreros gruesos, aroma ahumado profundo y la textura que los chefs piden. Espera 2 flushes sólidos por bloque.\n\nCada bloque: 5lb de sustrato de Shiitake pre-colonizado, sellado y listo para choque frío y fructificación.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'shiitake', scientificName: 'Lentinula edodes',
    price: 2999,
    variants: [{ id: 'fb3v', name: '5 lb Block', price: 2999, stock: 25, sku: 'SHF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Pre-colonized — ready to cold-shock', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Supplemented hardwood sawdust block (pre-colonized)', expectedYield: '2 flushes per block', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'shiitake', 'fruiting-block'], relatedProducts: ['shiitake-liquid-culture'],
    howToUseSteps: FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['shiitake-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['shiitake-liquid-culture'].keyBenefits,
  },
  'pink-oyster-fruiting-block': {
    id: 'fb4', slug: 'pink-oyster-fruiting-block',
    name: { en: 'Pink Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Rosa' },
    description: {
      en: "Already colonized with our fastest, most dramatic species — cut this block open and you'll see vivid magenta pins within days, not weeks. Pleurotus djamor clusters double in size every 12 hours once fruiting starts, so check daily once pins appear.\n\nLoves warmth (75–85°F) and needs no special climate control in most homes. Harvest before the wavy edges appear for the best color and flavor — the pink fades fast once cooked, so plan to cook the same day you pick.\n\nEach block: 5lb pre-colonized Pink Oyster substrate, sealed and ready to fruit. Store in a cool spot out of direct sun until you're ready to cut it open.",
      es: "Ya colonizado con nuestra especie más rápida y dramática — corta este bloque y verás pines magenta vibrantes en días, no semanas. Los racimos de Pleurotus djamor duplican tamaño cada 12 horas una vez que empieza la fructificación.\n\nAma el calor (24–29°C) y no necesita control climático especial. Cosecha antes de que aparezcan los bordes ondulados para mejor color y sabor — el rosa se desvanece rápido al cocinar.\n\nCada bloque: 5lb de sustrato de Ostra Rosa pre-colonizado, sellado y listo para fructificar.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'pink-oyster', scientificName: 'Pleurotus djamor',
    price: 2999,
    variants: [{ id: 'fb4v', name: '5 lb Block', price: 2999, stock: 30, sku: 'POF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust (pre-colonized)', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['pink-oyster-liquid-culture'],
    howToUseSteps: FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['pink-oyster-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['pink-oyster-liquid-culture'].keyBenefits,
  },
  'yellow-oyster-fruiting-block': {
    id: 'fb5', slug: 'yellow-oyster-fruiting-block',
    name: { en: 'Golden Oyster Fruiting Block', es: 'Bloque Fructificante Ostra Dorada' },
    description: {
      en: "Already colonized with Pleurotus citrinopileatus, selected for vivid golden-yellow color and tight, ruffled cluster formation. Cut it open, mist it, and expect pins within a week — Golden Oyster is one of the fastest fruiters in our lineup.\n\nSupplemented hardwood sawdust, autoclave-sterilized and colonized in our lab under HEPA-filtered positive pressure. Fruit at 64–77°F with 85–90% humidity and strong fresh air exchange — CO2 buildup causes long stems and small caps instead of the tight golden clusters this species is known for.\n\nExpect 3 flushes at roughly 20% biological efficiency over 4–6 weeks.",
      es: "Ya colonizado con Pleurotus citrinopileatus, seleccionado por su color dorado intenso y formación de racimos compactos. Córtalo, rocíalo y espera pines en una semana — la Ostra Dorada es una de las fructificadoras más rápidas de nuestra línea.\n\nAserrín de madera dura suplementada, esterilizado en autoclave y colonizado en nuestro laboratorio bajo presión positiva con filtración HEPA. Fructificar a 18–25°C con 85–90% humedad y buen intercambio de aire — el CO2 acumulado causa tallos largos y sombreros pequeños.\n\nEspera 3 flushes con ~20% de eficiencia biológica en 4–6 semanas.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'yellow-oyster', scientificName: 'Pleurotus citrinopileatus',
    price: 2999,
    variants: [{ id: 'fb5v', name: '5 lb Block', price: 2999, stock: 30, sku: 'YOF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: 'Pre-colonized — ready now', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw (pre-colonized)', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'kit', 'oyster', 'fruiting-block'], relatedProducts: ['yellow-oyster-liquid-culture'],
    howToUseSteps: FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['yellow-oyster-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['yellow-oyster-liquid-culture'].keyBenefits,
  },
  'reishi-fruiting-block': {
    id: 'fb6', slug: 'reishi-fruiting-block',
    name: { en: 'Reishi Fruiting Block', es: 'Bloque Fructificante Reishi' },
    description: {
      en: "Skip colonization entirely — this block is already fully colonized with our Ganoderma lucidum culture. Unlike our Oyster and Lion's Mane blocks, cutting it open won't give you mushrooms within a week — Reishi is not a fast grow. Expect a white, coral-like antler stage first, developing into the classic lacquered red-orange conk over 60–90+ days.\n\nSupplemented hardwood sawdust, autoclave-sterilized and colonized in our lab. Fruit at 70–80°F with 85–90% humidity and steady fresh air exchange. Do not rush the harvest — ganoderic acid content builds as the cap fully hardens.\n\nExpect 1–2 flushes total, spaced months apart. The fruiting body is too woody and bitter to eat — best processed as a dual-extract tincture once harvested.",
      es: "Sáltate la colonización por completo — este bloque ya está completamente colonizado con nuestro cultivo de Ganoderma lucidum. A diferencia de nuestros bloques de Ostra y Melena de León, abrirlo no te dará hongos en una semana — el Reishi no es un cultivo rápido. Espera primero una etapa blanca tipo coral, que se desarrolla en el clásico sombrero laqueado rojo-naranja en 60–90+ días.\n\nAserrín de madera dura suplementada, esterilizado en autoclave y colonizado en nuestro laboratorio. Fructificar a 21–27°C con 85–90% humedad. No apresures la cosecha — el contenido de ácidos ganodéricos aumenta mientras el sombrero termina de endurecerse.\n\nEspera 1–2 flushes totales, espaciados por meses. El cuerpo fructífero es demasiado leñoso y amargo para comer — mejor procesado como tintura de doble extracción.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'reishi', scientificName: 'Ganoderma lucidum',
    price: 2999,
    variants: [{ id: 'fb6v', name: '5 lb Block', price: 2999, stock: 20, sku: 'REF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: 'Pre-colonized — ready to fruit', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized)', expectedYield: '1–2 flushes over 60–90+ days', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'medicinal', 'reishi', 'fruiting-block'], relatedProducts: ['reishi-liquid-culture'],
    howToUseSteps: REISHI_FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['reishi-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['reishi-liquid-culture'].keyBenefits,
  },
  'antler-reishi-fruiting-block': {
    id: 'fb7', slug: 'antler-reishi-fruiting-block',
    name: { en: 'Antler Reishi Fruiting Block', es: 'Bloque Fructificante Reishi Antler' },
    description: {
      en: "Already colonized under our antler-cultivation protocol — Ganoderma multipileum, a distinct species within the Ganoderma lucidum complex, grown to produce dramatic stag-horn fruiting bodies instead of the classic kidney cap. Shares the same core bioactive compound classes as standard Reishi, in a completely different growing experience.\n\nCut it open and maintain elevated CO2 (above 5,000 ppm) throughout fruiting by limiting fresh air exchange — the opposite of most fruiting blocks. Too much airflow and it reverts to a normal cap instead of branching antlers. Fruit at 70–82°F with 85–90% humidity.\n\nExpect 60–90+ days to full antler development, 1–2 flushes total. Advanced growers only — this is the most technically demanding block we sell.",
      es: "Ya colonizado bajo nuestro protocolo de cultivo antler — Ganoderma multipileum, una especie distinta dentro del complejo Ganoderma lucidum, cultivado para producir dramáticos cuerpos fructificantes en forma de asta en lugar del sombrero renal clásico. Comparte las mismas clases principales de compuestos bioactivos que el Reishi estándar, en una experiencia de cultivo completamente distinta.\n\nCórtalo y mantén el CO2 elevado (por encima de 5,000 ppm) durante toda la fructificación limitando el intercambio de aire — lo opuesto a la mayoría de los bloques. Demasiado flujo de aire y revertirá a un sombrero normal en vez de astas. Fructificar a 21–28°C con 85–90% humedad.\n\nEspera 60–90+ días para el desarrollo completo de las astas, 1–2 flushes totales. Solo cultivadores avanzados — es el bloque técnicamente más exigente que vendemos.",
    },
    category: 'kit', subcategory: 'Fruiting Blocks', species: 'antler-reishi', scientificName: 'Ganoderma multipileum',
    price: 2999,
    variants: [{ id: 'fb7v', name: '5 lb Block', price: 2999, stock: 15, sku: 'ARF-5LB' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: 'Pre-colonized — ready to fruit', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust (pre-colonized, antler protocol)', expectedYield: '1–2 flushes over 60–90+ days', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['kit', 'medicinal', 'reishi', 'antler', 'fruiting-block'], relatedProducts: ['antler-reishi-liquid-culture'],
    howToUseSteps: ANTLER_FRUITING_HOW_TO_USE_STEPS,
    scienceContent: LC_PRODUCTS['antler-reishi-liquid-culture'].scienceContent,
    keyBenefits: LC_PRODUCTS['antler-reishi-liquid-culture'].keyBenefits,
  },
}

const BULK_PRODUCTS: Record<string, Product> = {
  'lions-mane-bulk-substrate': {
    id: 'bs1', slug: 'lions-mane-bulk-substrate',
    name: { en: "Lion's Mane Sterile Bulk Substrate", es: 'Sustrato a Granel Esterilizado Melena de León' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Built for Lion's Mane's longer colonization window and dense pom-pom formation.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag, incubate, then fruit from the same container — no separate grain-to-bulk transfer container needed.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Lion's Mane Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Pensado para la ventana de colonización más larga de la Melena de León y su formación de pompón denso.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa, incuba, y fructifica desde el mismo contenedor.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Melena de León.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'lions-mane', scientificName: 'Hericium erinaceus',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs1v', name: '5 lb', price: 2299, stock: 35, sku: 'LMB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'lions-mane', 'intermediate'], relatedProducts: ['lions-mane-liquid-culture', 'rye-grain-spawn-bag-3lb'],
    howToUseSteps: BULK_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '2–3 weeks once inoculated' },
  },
  'blue-oyster-bulk-substrate': {
    id: 'bs2', slug: 'blue-oyster-bulk-substrate',
    name: { en: 'Blue Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Azul' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Blue Oyster's forgiving, aggressive colonization style makes this the easiest bulk substrate to learn hand-mixing technique on.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag, incubate, then fruit from the same container.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Blue Oyster Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. El estilo de colonización indulgente y agresivo de la Ostra Azul la hace la más fácil para aprender la técnica de mezcla a mano.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa, incuba, y fructifica desde el mismo contenedor.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Ostra Azul.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'blue-oyster', scientificName: 'Pleurotus ostreatus',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs2v', name: '5 lb', price: 2299, stock: 40, sku: 'BOB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['blue-oyster-liquid-culture', 'rye-grain-spawn-bag-3lb'],
    howToUseSteps: BULK_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '10–16 days once inoculated' },
  },
  'shiitake-bulk-substrate': {
    id: 'bs3', slug: 'shiitake-bulk-substrate',
    name: { en: 'Shiitake Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Shiitake' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Colonization runs longer than Oyster species (Shiitake is a slower grower by nature).\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag, incubate, then trigger fruiting with a cold-shock soak once fully colonized.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Shiitake Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. La colonización toma más tiempo que las Ostras (el Shiitake crece más lento por naturaleza).\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa, incuba, y detona la fructificación con un baño de choque frío una vez colonizado.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Shiitake.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'shiitake', scientificName: 'Lentinula edodes',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs3v', name: '5 lb', price: 2299, stock: 25, sku: 'SHB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'shiitake', 'intermediate'], relatedProducts: ['shiitake-liquid-culture', 'rye-grain-spawn-bag-3lb'],
    howToUseSteps: BULK_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '3–4 weeks once inoculated' },
  },
  'pink-oyster-bulk-substrate': {
    id: 'bs4', slug: 'pink-oyster-bulk-substrate',
    name: { en: 'Pink Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Rosa' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Pairs with our fastest, most dramatic species — vivid magenta clusters within days of fruiting.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag and incubate in a warm spot — Pink Oyster loves heat.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Pink Oyster Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Combina con nuestra especie más rápida y dramática — racimos magenta vibrantes a días de fructificar.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa e incuba en un lugar cálido — la Ostra Rosa ama el calor.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Ostra Rosa.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'pink-oyster', scientificName: 'Pleurotus djamor',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs4v', name: '5 lb', price: 2299, stock: 35, sku: 'POB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['pink-oyster-liquid-culture', 'rye-grain-spawn-bag-3lb'],
    howToUseSteps: BULK_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '8–12 days once inoculated' },
  },
  'yellow-oyster-bulk-substrate': {
    id: 'bs5', slug: 'yellow-oyster-bulk-substrate',
    name: { en: 'Golden Oyster Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Ostra Dorada' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Built for Golden Oyster's fast, aggressive colonization style.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag and incubate — expect strong fresh air exchange needs once fruiting starts, or you'll get long stems instead of tight golden clusters.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Golden Oyster Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Pensado para el estilo de colonización rápido y agresivo de la Ostra Dorada.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa — necesitará buen intercambio de aire una vez inicie la fructificación, o tendrás tallos largos en vez de racimos dorados compactos.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Ostra Dorada.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'yellow-oyster', scientificName: 'Pleurotus citrinopileatus',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs5v', name: '5 lb', price: 2299, stock: 30, sku: 'YOB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'oyster', 'beginner'], relatedProducts: ['yellow-oyster-liquid-culture', 'rye-grain-spawn-bag-3lb'],
    howToUseSteps: BULK_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '8–12 days once inoculated' },
  },
  'reishi-bulk-substrate': {
    id: 'bs6', slug: 'reishi-bulk-substrate',
    name: { en: 'Reishi Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Reishi' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. Colonization runs 3–4 weeks, and fruiting takes far longer still: 60–90+ days from cutting to a fully hardened conk. Not a fast grow, and not recommended as a first bulk substrate.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. Mix in 1lb of colonized grain spawn per 5lb bag and incubate.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and a Reishi Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. La colonización toma 3–4 semanas, y la fructificación toma mucho más: 60–90+ días desde el corte hasta un sombrero completamente endurecido. No es un cultivo rápido, y no se recomienda como primer sustrato a granel.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. Mezcla 1lb de grain spawn colonizado por cada 5lb de bolsa e incuba.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Reishi.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'reishi', scientificName: 'Ganoderma lucidum',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs6v', name: '5 lb', price: 2299, stock: 20, sku: 'REB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'medicinal', 'reishi'], relatedProducts: ['reishi-liquid-culture'],
    howToUseSteps: BULK_REISHI_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '3–4 weeks once inoculated' },
  },
  'antler-reishi-bulk-substrate': {
    id: 'bs7', slug: 'antler-reishi-bulk-substrate',
    name: { en: 'Antler Reishi Sterile Bulk Substrate', es: 'Sustrato a Granel Esterilizado Reishi Antler' },
    description: {
      en: "Sterile, autoclaved hardwood substrate for growers who already have colonized grain spawn on hand — no injection port here, just open and mix. This one grows Ganoderma multipileum, a distinct species within the Ganoderma lucidum complex naturally inclined toward antler formation. Colonization runs 3–4 weeks like standard Reishi; the difference is entirely in fruiting, where you limit fresh air exchange to grow dramatic antler-shaped bodies instead of a normal cap.\n\nEvery bag is sterilized at 15 PSI and batch-tested with biological indicators before it ships. The most technically demanding bulk substrate we sell — advanced growers only.\n\nDon't have grain spawn yet? Pair this with one of our Grain Bags and an Antler Reishi Liquid Culture syringe.\n\nEach bag: 5lb sterile hardwood substrate · 0.2-micron filter patch · shrooms instruction card. Store cool and dark until use.",
      es: "Sustrato de madera dura esterilizado en autoclave para cultivadores que ya tienen grain spawn colonizado — sin puerto de inyección, solo abrir y mezclar. Este cultiva Ganoderma multipileum, una especie distinta dentro del complejo Ganoderma lucidum con tendencia natural a formar astas. La colonización toma 3–4 semanas como el Reishi estándar; la diferencia está toda en la fructificación, donde limitas el intercambio de aire para lograr formas de asta dramáticas en vez de un sombrero normal.\n\nCada bolsa se esteriliza a 15 PSI y se prueba por lote con indicadores biológicos antes de enviarse. El sustrato a granel técnicamente más exigente que vendemos — solo cultivadores avanzados.\n\n¿No tienes grain spawn todavía? Combina esta bolsa con uno de nuestros Grain Bags y una jeringa de Cultivo Líquido de Reishi Antler.\n\nCada bolsa: 5lb de sustrato de madera dura esterilizado · parche filtrante de 0.2 micras · tarjeta de instrucciones shrooms.",
    },
    category: 'substrate', subcategory: 'Bulk Substrate', species: 'antler-reishi', scientificName: 'Ganoderma multipileum',
    price: 2299, compareAtPrice: 2799,
    variants: [{ id: 'bs7v', name: '5 lb', price: 2299, stock: 15, sku: 'ARB-BULK' }],
    images: [],
    isOrganic: true, inStock: true, tags: ['bulk-substrate', 'medicinal', 'reishi', 'antler'], relatedProducts: ['antler-reishi-liquid-culture'],
    howToUseSteps: BULK_ANTLER_HOW_TO_USE_STEPS,
    grainBagSpecs: { ...BULK_SPECS_BASE, colonizationEstimate: '3–4 weeks once inoculated' },
  },
}

const TABS = ['description', 'howToUse', 'science', 'reviews'] as const

export default function ProductPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const product = PRODUCTS[params.slug] ?? LC_PRODUCTS[params.slug] ?? GRAIN_PRODUCTS[params.slug] ?? FRUITING_PRODUCTS[params.slug] ?? BULK_PRODUCTS[params.slug]
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
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream">{name}</h1>
              {product.scientificName && (
                <p className="font-mono text-sm text-cream-muted italic mt-1">{product.scientificName}</p>
              )}

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

            {/* Grain bag / all-in-one bag contents */}
            {(product.subcategory === 'Grain Bags' || product.subcategory === 'All-in-One Bags') && (
              <div className="rounded-2xl border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the bag</p>
                </div>
                <div className="grid grid-cols-4 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: product.subcategory === 'All-in-One Bags' ? "5lb\nMaster's Mix" : '3lb\nSterile Grain',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: '0.2μm\nFilter Patch',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
                    },
                    {
                      label: 'Self-Healing\nInjection Port',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><path d="M15 5h4v4"/></svg>,
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

            {/* Bulk substrate contents (no injection port — opened and hand-mixed with grain spawn) */}
            {product.subcategory === 'Bulk Substrate' && (
              <div className="rounded-2xl border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the bag</p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '5lb\nSterile Substrate',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: '0.2μm\nFilter Patch',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
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

            {/* Fruiting block contents */}
            {product.subcategory === 'Fruiting Blocks' && (
              <div className="rounded-2xl border border-ds-border overflow-hidden">
                <div className="px-4 py-2.5 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream-muted">What&apos;s in the box</p>
                </div>
                <div className="grid grid-cols-3 divide-x divide-ds-border bg-surface">
                  {[
                    {
                      label: '5lb\nColonized Block',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
                    },
                    {
                      label: 'Fruiting-Ready\nFilter Bag',
                      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>,
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

            {/* Grain Bag Specs */}
            {product.grainBagSpecs && (
              <div className="rounded-2xl border border-ds-border overflow-hidden">
                <div className="px-4 py-3 bg-elevated border-b border-ds-border">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cream-muted">{product.subcategory === 'Grain Bags' ? 'Grain Bag Specs' : 'Substrate Specs'}</p>
                </div>
                <div className="grid grid-cols-2 divide-x divide-y divide-ds-border">
                  {[
                    { label: 'Bag Size', value: product.grainBagSpecs.bagSize, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="16" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> },
                    { label: 'Colonization', value: product.grainBagSpecs.colonizationEstimate, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                    { label: 'Sterilization', value: product.grainBagSpecs.sterilization, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                    { label: 'Moisture', value: product.grainBagSpecs.moisture, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg> },
                    { label: 'Recommended Inoculation', value: product.grainBagSpecs.recommendedInoculation, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4l5.5 5.5-9 9-3 .5.5-3 6-6z"/><path d="M12 6.5l5 5"/></svg> },
                    { label: 'Shelf Life', value: product.grainBagSpecs.shelfLife, icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
                  ].map((row, i) => (
                    <motion.div
                      key={row.label}
                      className="flex flex-col gap-1.5 p-4 bg-surface"
                      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                      whileInView={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                      viewport={{ once: true, margin: '-10% 0px' }}
                      transition={{ duration: 0.5, delay: 0.12 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="text-accent/55">{row.icon}</div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream-muted/50">{row.label}</p>
                      <p className="text-sm text-cream font-medium leading-snug">{row.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Benefits */}
        {product.keyBenefits && product.keyBenefits.length > 0 && (
          <div className="mt-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-cream-muted mb-6">Key Benefits</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {product.keyBenefits.map((b, i) => (
                <motion.div
                  key={b.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-ds-border bg-surface p-5 space-y-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/8 flex items-center justify-center text-accent">
                    {b.icon === 'brain' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>}
                    {b.icon === 'shield' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                    {b.icon === 'heart' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
                    {b.icon === 'leaf' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>}
                    {b.icon === 'activity' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
                    {b.icon === 'zap' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
                    {b.icon === 'sun' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>}
                    {b.icon === 'droplet' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-cream text-sm mb-1">{b.label}</p>
                    <p className="text-cream-muted text-xs leading-relaxed">{b.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

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
                    {product.scienceContent ? (
                      product.scienceContent[locale].split('\n\n').map((para, i) => (
                        <p key={i} className="leading-relaxed">{para}</p>
                      ))
                    ) : (
                      <p>Detailed scientific research available soon.</p>
                    )}
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
