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
    scienceContent: {
      en: "Antler Reishi is Ganoderma lucidum cultivated under deliberately elevated CO2 concentrations (above 5,000 ppm), which suppresses cap formation and drives vertical antler or stag-horn growth. The result is biologically identical to standard Reishi in compound profile — the same 400+ bioactives, the same ganoderic acid concentrations — but in a morphologically distinct form with unique practical advantages.\n\nThe antler form exposes significantly more tissue surface area per gram than a flat kidney-shaped cap. For dual-extraction tincture preparation, this means better solvent penetration, higher extraction efficiency of triterpenoids (alcohol-soluble) and beta-glucans (water-soluble), and more consistent batch-to-batch yield. Professional tincture makers consistently prefer antler form for this reason.\n\nAll the clinical evidence for Ganoderma lucidum applies: ganoderic acid inhibition of HMG-CoA reductase and ACE, beta-glucan immunomodulation, cortisol regulation via the HPA axis, NK cell activation, and hepatoprotective effects. See the standard Reishi listing for full clinical references. The antler form is the same medicine — presented differently.",
      es: "El Reishi Antler es Ganoderma lucidum cultivado bajo concentraciones de CO2 deliberadamente elevadas (por encima de 5,000 ppm), que suprimen la formación del sombrero y dirigen el crecimiento vertical en forma de asta. El resultado es biológicamente idéntico al Reishi estándar en perfil de compuestos — los mismos 400+ bioactivos, las mismas concentraciones de ácidos ganodéricos — pero en una forma morfológicamente distinta.\n\nLa forma antler expone significativamente más superficie de tejido por gramo que un sombrero renal plano. Para la preparación de tintura de doble extracción, esto significa mejor penetración del solvente, mayor eficiencia de extracción de triterpenoides (solubles en alcohol) y beta-glucanos (solubles en agua). Los fabricantes profesionales de tinturas consistentemente prefieren la forma antler por esta razón.",
    },
    keyBenefits: [
      { icon: 'shield', label: 'Same 400+ Bioactives', detail: 'Biologically identical to classic Reishi — same ganoderic acids, beta-glucans, and immunomodulating proteins' },
      { icon: 'leaf', label: 'Superior Extraction', detail: 'Antler form exposes more surface area per gram — higher tincture yield of both triterpenoids and beta-glucans' },
      { icon: 'activity', label: 'Adaptogen', detail: 'Reduces cortisol via HPA axis regulation; clinically studied for stress resilience, sleep quality, and fatigue' },
      { icon: 'heart', label: 'Advanced Cultivator', detail: 'Requires sustained CO2 above 5,000 ppm throughout fruiting — the most technically demanding Ganoderma grow' },
    ],
  },
}

const SPORE_HOW_TO_USE_STEPS = [
  'Let syringe warm to room temperature for 1–2 hours before use.',
  'Shake vigorously for 30 seconds to distribute spores evenly throughout the suspension.',
  'Sterilize your agar pour (MEA, WA, or PDA) or grain jar port with the included alcohol swab.',
  'Inoculate agar plates or grain jars with 0.5–1cc per plate/jar.',
  'Seal and incubate at 70–80°F in darkness. Spore germination takes 3–10 days — you will see white mycelium forming.',
  'Once you see healthy sectors growing on agar, use a sterile scalpel to transfer the most vigorous sectors to fresh agar for isolation — or directly to liquid culture.',
  'Colonization on agar plates typically completes in 14–28 days. Transfer selected isolates to grain for bulk production.',
]

const SPORE_PRODUCTS: Record<string, Product> = {
  'lions-mane-spore-syringe': {
    id: 'sp1', slug: 'lions-mane-spore-syringe',
    name: { en: "Lion's Mane Spore Syringe", es: 'Jeringa de Esporas Melena de León' },
    description: {
      en: "Hericium erinaceus spore suspension — 10cc, lab-prepared. The spore syringe is where serious cultivation begins: agar work, isolate selection, and building your own liquid culture library. At $12.99 it is the most economical entry into Lion's Mane genetics.\n\nSpores germinate in 3–10 days on MEA or WA agar. Isolate the fastest-growing, densest sectors before transferring to grain. Unlike liquid culture, spores carry genetic diversity — you may discover a phenotype that outperforms commercial isolates.\n\nBest for: mycologists doing agar work, researchers preserving strains, and cultivators building a personal LC library. If you want to grow directly to harvest without agar work, our Liquid Culture Syringe (5–10 day grain colonization) is the faster path.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Hericium erinaceus — 10cc, preparada en laboratorio. La jeringa de esporas es donde comienza el cultivo serio: trabajo en agar, selección de aislados y construcción de tu propia biblioteca de cultivo líquido. A $12.99 es la entrada más económica a la genética de Melena de León.\n\nLas esporas germinan en 3–10 días en agar MEA o WA. Aisla los sectores de crecimiento más rápido y denso antes de transferir a grano. A diferencia del cultivo líquido, las esporas llevan diversidad genética — puedes descubrir un fenotipo superior.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'lions-mane',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp1v', name: '10cc', price: 1299, stock: 40, sku: 'LMS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '14–28 days (on grain)', fruitingTempF: '65–75°F', fruitingTempC: '18–24°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '200–400g per flush', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'lions-mane'], relatedProducts: ['lions-mane-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Hericium erinaceus spores contain the full genetic blueprint for both hericenones and erinacines synthesis — the two compound families unique to this species that stimulate Nerve Growth Factor (NGF). Working from spores rather than liquid culture gives you access to the full genetic diversity of the species, not just the clonal genetics of a single isolate.\n\nFrom a cultivation science perspective, spore-to-agar work is the foundation of strain improvement. By plating spores, observing sector formation, and selecting for density, growth rate, and morphology, you are performing rudimentary selective breeding — the same process used by commercial mushroom genetics labs.\n\nAll therapeutic compound data for Lion's Mane applies: hericenone-B and erinacine-A are the primary NGF-stimulating compounds, with supporting research from Mori et al. (2009), Inanaga (2010), and multiple in vitro studies on amyloid-beta inhibition and myelin sheath regeneration.",
      es: "Las esporas de Hericium erinaceus contienen el plano genético completo para la síntesis de hericenones y erinacinas — las dos familias de compuestos únicas de esta especie que estimulan el Factor de Crecimiento Nervioso (NGF). Trabajar desde esporas en lugar de cultivo líquido te da acceso a la diversidad genética completa de la especie, no solo a la genética clonal de un aislado único.\n\nDesde una perspectiva de ciencia del cultivo, el trabajo de espora a agar es la base del mejoramiento de cepas. Todos los datos de compuestos terapéuticos del Lion's Mane aplican.",
    },
    keyBenefits: [
      { icon: 'brain', label: 'Full Genetic Diversity', detail: "Access the complete gene pool of H. erinaceus — spores carry natural variation that clonal LC can't provide" },
      { icon: 'leaf', label: 'Agar Work Foundation', detail: 'Perfect starting point for isolation, strain selection, and building a personal Lion\'s Mane LC library' },
      { icon: 'activity', label: 'NGF Compound Blueprint', detail: 'Every spore carries the genetics for hericenone + erinacine synthesis — the only mushroom with verified NGF-stimulating compounds' },
      { icon: 'zap', label: 'Most Economical Entry', detail: 'At $12.99 — the lowest cost path to Lion\'s Mane genetics. Upgrade to LC once you\'ve isolated your best phenotype' },
    ],
  },
  'blue-oyster-spore-syringe': {
    id: 'sp2', slug: 'blue-oyster-spore-syringe',
    name: { en: 'Blue Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Azul' },
    description: {
      en: "Pleurotus ostreatus spore suspension — 10cc, lab-prepared. Blue Oyster is the most forgiving species for learning sterile technique, which makes this spore syringe the ideal entry point for beginners starting their first agar work.\n\nSpores germinate in 5–10 days on MEA or WA agar — faster than most species, and with less contamination risk due to Blue Oyster's naturally aggressive colonization. Select the most vigorous, densest sectors before transferring to grain. The species' resilience means contamination rejection is high, making it a reliable learning environment.\n\nFor experienced cultivators: Blue Oyster spores often show phenotypic variation in cold tolerance, cap size, and colonization speed — ideal for selecting and freezing high-performance isolates.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Pleurotus ostreatus — 10cc, preparada en laboratorio. La Ostra Azul es la especie más tolerante para aprender técnica estéril, lo que hace que esta jeringa de esporas sea el punto de entrada ideal para principiantes en su primer trabajo en agar.\n\nLas esporas germinan en 5–10 días en agar MEA o WA — más rápido que la mayoría de las especies, y con menor riesgo de contaminación.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'blue-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp2v', name: '10cc', price: 1299, stock: 50, sku: 'BOS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–21 days (on grain)', fruitingTempF: '55–65°F', fruitingTempC: '13–18°C', idealSubstrate: 'Hardwood sawdust, straw, coffee grounds', expectedYield: '3–4 flushes, 25%+ BE', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['blue-oyster-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus ostreatus spores are an exceptional teaching tool for mycology. The species produces abundant spores with high germination rates, rapid agar colonization, and aggressive contamination rejection — all of which make it the most reliable species for learning sterile technique from scratch.\n\nFrom a genetics standpoint, Blue Oyster shows significant phenotypic variation across spore populations. Research on Pleurotus ostreatus genetics (Saez et al., 2019) has identified variation in cold tolerance, melanin production (cap color), and biological efficiency across strains. Selecting for these traits on agar before transferring to grain is a legitimate strain improvement methodology used by commercial spawn labs.\n\nBeta-glucan content in P. ostreatus ranges from 25–35% of dry weight — among the highest of any cultivated species — with immunomodulating and LDL-lowering effects documented in randomized trials.",
      es: "Las esporas de Pleurotus ostreatus son una herramienta de enseñanza excepcional para la micología. La especie produce abundantes esporas con altas tasas de germinación, colonización rápida de agar y rechazo agresivo de contaminación — todo lo cual la hace la especie más confiable para aprender técnica estéril desde cero.\n\nEl contenido de beta-glucanos en P. ostreatus varía del 25–35% del peso seco — entre los más altos de cualquier especie cultivada — con efectos inmunomoduladores y reductores de LDL documentados en ensayos aleatorios.",
    },
    keyBenefits: [
      { icon: 'leaf', label: 'Best for Beginners', detail: 'Fastest germination, most aggressive colonization, highest contamination resistance — ideal first agar work' },
      { icon: 'shield', label: 'Beta-Glucan Rich', detail: '25–35% beta-glucan content by dry weight — among highest of any cultivated mushroom; immunomodulating + LDL-lowering' },
      { icon: 'activity', label: 'Phenotypic Diversity', detail: 'Spore populations show variation in cold tolerance, cap color, and BE — excellent for selecting high-performance isolates' },
      { icon: 'brain', label: 'Strain Building', detail: 'Use your best isolate to build a permanent LC stock — then never buy Blue Oyster genetics again' },
    ],
  },
  'pink-oyster-spore-syringe': {
    id: 'sp3', slug: 'pink-oyster-spore-syringe',
    name: { en: 'Pink Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Rosa' },
    description: {
      en: "Pleurotus djamor spore suspension — 10cc, lab-prepared. Pink Oyster is the fastest-growing Pleurotus species — and that speed carries through from spore to harvest. Germination on agar takes as little as 3–7 days, with full colonization of grain in 14–21 days.\n\nThe species is native to tropical and subtropical climates, which means it thrives at temperatures (75–85°F) that other Oysters struggle with. If your cultivation space runs warm, Pink Oyster outperforms every other species on this list.\n\nSpore selection note: Pink Oyster shows high phenotypic variation for cap color intensity. On agar, select sectors with the most vivid pink coloration — these tend to produce the most photogenic flushes and the most marketable fruiting bodies.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Pleurotus djamor — 10cc, preparada en laboratorio. La Ostra Rosa es la especie de Pleurotus de crecimiento más rápido — y esa velocidad se mantiene desde espora hasta cosecha. Germinación en agar en 3–7 días, colonización completa de grano en 14–21 días.\n\nNota de selección de esporas: la Ostra Rosa muestra alta variación fenotípica en la intensidad del color del sombrero. En agar, seleccionar sectores con la coloración rosa más vibrante.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'pink-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp3v', name: '10cc', price: 1299, stock: 40, sku: 'POS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–21 days (on grain)', fruitingTempF: '75–85°F', fruitingTempC: '24–29°C', idealSubstrate: 'Straw, hardwood sawdust', expectedYield: '3 flushes, 20–25% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['pink-oyster-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus djamor is a pantropical species with one of the fastest mycelial growth rates of any cultivated mushroom, attributed to high cellulase and laccase enzyme production that rapidly breaks down lignocellulosic substrates. This enzymatic efficiency makes it one of the most sustainable food-production organisms known — converting agricultural waste (straw, sugarcane bagasse, cottonseed hulls) into high-quality protein at 20–25% biological efficiency.\n\nProtein content of Pink Oyster fruiting bodies ranges from 10–30% of dry weight, with a complete essential amino acid profile and high digestibility (>80%). The magenta pigment is a water-soluble carotenoid that degrades rapidly with heat — cooked Pink Oyster turns pale, but the flavor intensifies.\n\nBeta-glucan content: 18–25% of dry weight. Less studied clinically than Lion's Mane or Reishi, but emerging research on Pleurotus species broadly supports immunomodulation and cholesterol management.",
      es: "Pleurotus djamor es una especie pantropical con una de las tasas de crecimiento micelar más rápidas de cualquier hongo cultivado, atribuida a la alta producción de enzimas celulasa y lacasa. El contenido de proteínas de los cuerpos fructificantes de la Ostra Rosa varía del 10–30% del peso seco, con un perfil completo de aminoácidos esenciales y alta digestibilidad (>80%).\n\nEl pigmento magenta es un carotenoide soluble en agua que se degrada rápidamente con el calor — la Ostra Rosa cocida se vuelve pálida, pero el sabor se intensifica.",
    },
    keyBenefits: [
      { icon: 'zap', label: 'Fastest Growing Oyster', detail: 'Germination in 3–7 days, full grain colonization in 14–21 days — the speed champion of the Pleurotus genus' },
      { icon: 'sun', label: 'Warm Climate Specialist', detail: 'Thrives at 75–85°F — outperforms all other Oysters in warm grow spaces where Blue Oyster would struggle' },
      { icon: 'leaf', label: 'High Protein, Complete AA', detail: '10–30% protein by dry weight with complete essential amino acids — one of the most nutritionally efficient mushrooms cultivated' },
      { icon: 'activity', label: 'Color Selection Potential', detail: 'Significant phenotypic variation in cap color intensity — select the most vivid pink sectors on agar for photogenic harvests' },
    ],
  },
  'golden-oyster-spore-syringe': {
    id: 'sp4', slug: 'golden-oyster-spore-syringe',
    name: { en: 'Golden Oyster Spore Syringe', es: 'Jeringa de Esporas Ostra Dorada' },
    description: {
      en: "Pleurotus citrinopileatus spore suspension — 10cc, lab-prepared. Golden Oyster is the visual standout of the Pleurotus family — clusters of vivid yellow caps that photograph like sunbursts. The spore syringe is the best way to find your own high-color phenotype.\n\nGermination takes 5–10 days on MEA agar. The key selection criterion: vibrant yellow coloration. On agar, sectors with brighter coloration tend to produce fruiting bodies with more intense golden pigmentation. This is color selection at the genetic level — something only possible from spores, not clonal LC.\n\nGolden Oyster fruits at a slightly warmer range than Blue Oyster (64–77°F), making it a natural fit for cultivation spaces that run warm. Strong fresh air exchange during fruiting is essential — CO2 buildup bleaches cap color.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Pleurotus citrinopileatus — 10cc, preparada en laboratorio. La Ostra Dorada es el más visual de la familia Pleurotus — racimos de vibrantes sombreros amarillos. La jeringa de esporas es la mejor manera de encontrar tu propio fenotipo de alto color.\n\nCriterio de selección clave: coloración amarilla vibrante. En agar, los sectores con mayor coloración tienden a producir cuerpos fructificantes más dorados.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'yellow-oyster',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp4v', name: '10cc', price: 1299, stock: 35, sku: 'GOS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'beginner', colonizationTime: '14–21 days (on grain)', fruitingTempF: '64–77°F', fruitingTempC: '18–25°C', idealSubstrate: 'Hardwood sawdust, straw', expectedYield: '3 flushes, 20% BE', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['beginner', 'spore-syringe', 'oyster'], relatedProducts: ['golden-oyster-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Pleurotus citrinopileatus, the Golden Oyster mushroom, is native to deciduous forests of eastern Asia, particularly Japan and China, where it grows on dead elm and poplar trees. Its vivid yellow coloration comes from flavonoid pigments, which begin to degrade at temperatures above 140°F — another reason to cook it gently or use raw in cold preparations.\n\nNutritional profile: comparable to other Pleurotus species, with 15–25% protein by dry weight, 40–50% carbohydrates (primarily beta-glucans), and essential amino acids including all 9 essential for humans. The beta-glucan fraction in P. citrinopileatus has been studied for immunostimulating properties, including macrophage activation and NK cell enhancement in murine models (Xu et al., 2012).\n\nColor selection from spore populations: the intensity of yellow-orange pigmentation is a heritable trait with moderate heritability. Agar-based selection for high-color sectors is a validated commercial practice for premium growers targeting specialty restaurant and farmers market sales.",
      es: "Pleurotus citrinopileatus, la Ostra Dorada, es nativa de los bosques caducifolios del este de Asia. Su vibrante coloración amarilla proviene de pigmentos flavonoides que comienzan a degradarse a temperaturas superiores a 60°C.\n\nPerfil nutricional: comparable a otras especies de Pleurotus, con 15–25% de proteína en peso seco, 40–50% de carbohidratos (principalmente beta-glucanos). La selección de color de poblaciones de esporas es una práctica comercial validada para cultivadores premium.",
    },
    keyBenefits: [
      { icon: 'sun', label: 'Color Selection Possible', detail: 'The only way to breed for more intense golden pigmentation — spore variation makes color selection achievable from agar plates' },
      { icon: 'leaf', label: 'Warm Range Performer', detail: 'Fruits at 64–77°F — outperforms Blue Oyster in warmer environments while maintaining 3-flush productivity' },
      { icon: 'shield', label: 'Beta-Glucan Immune Support', detail: 'P. citrinopileatus beta-glucans shown to activate macrophages and enhance NK cell activity in controlled studies' },
      { icon: 'brain', label: 'Build Your Own LC', detail: "Isolate your best golden phenotype on agar → create LC → never buy Golden Oyster genetics again" },
    ],
  },
  'reishi-spore-syringe': {
    id: 'sp5', slug: 'reishi-spore-syringe',
    name: { en: 'Reishi Spore Syringe', es: 'Jeringa de Esporas Reishi' },
    description: {
      en: "Ganoderma lucidum spore suspension — 10cc, lab-prepared. Reishi is the most revered medicinal mushroom in recorded history, with 2,000 years of documented use in Chinese medicine. The spore syringe is the most economical entry into Reishi cultivation — at $12.99, the lowest cost path to Ganoderma genetics.\n\nReishi from spores requires patience: germination takes 7–14 days on agar, grain colonization 21–35 days. This extended timeline is normal — Reishi is a slow, methodical mushroom that rewards patient cultivators. The extra time on agar gives you the opportunity to select the most vigorous sectors, which will produce better fruiting bodies than unselected spores.\n\nRecommended for experienced cultivators comfortable with extended colonization times and CO2 management during fruiting. If you want faster results, our Liquid Culture Syringe colonizes grain in 5–10 days.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Ganoderma lucidum — 10cc, preparada en laboratorio. El Reishi es el hongo medicinal más venerado en la historia registrada, con 2,000 años de uso documentado en la medicina china. La jeringa de esporas es la entrada más económica al cultivo de Reishi.\n\nReishi desde esporas requiere paciencia: germinación 7–14 días en agar, colonización de grano 21–35 días. El tiempo extra en agar da la oportunidad de seleccionar los sectores más vigorosos.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'reishi',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp5v', name: '10cc', price: 1299, stock: 30, sku: 'RES-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days (on grain)', fruitingTempF: '70–80°F', fruitingTempC: '21–27°C', idealSubstrate: 'Hardwood logs or supplemented sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'reishi'], relatedProducts: ['reishi-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Ganoderma lucidum has the most extensive body of human clinical research of any mushroom species. Over 400 bioactive compounds have been identified, with three primary therapeutic categories studied in peer-reviewed trials: triterpenoids (ganoderic acids A, B, C, D, H, K — alcohol-soluble), beta-glucan polysaccharides (water-soluble), and immunomodulating proteins (LZ-8 and related lectins).\n\nWorking from spores gives access to natural genetic variation in G. lucidum populations. Research on Ganoderma genetics (Loyd et al., 2018) has identified significant variation in ganoderic acid concentrations across isolates — suggesting that agar-based selection for mycelial density and growth rate may indirectly select for higher triterpene content.\n\nThe cultivation process from spores also allows extended agar-to-LC development that is standard in commercial medicinal mushroom production. The patience required to work from spores is, in a sense, appropriate for a mushroom used for 2,000 years as a symbol of longevity.",
      es: "Ganoderma lucidum tiene el cuerpo más extenso de investigación clínica humana de cualquier especie de hongo. Más de 400 compuestos bioactivos han sido identificados, con tres categorías terapéuticas primarias: triterpenoides (ácidos ganodéricos — solubles en alcohol), polisacáridos beta-glucanos (solubles en agua), y proteínas inmunomoduladoras.\n\nTrabajar desde esporas da acceso a la variación genética natural en las poblaciones de G. lucidum. La investigación sobre genética de Ganoderma ha identificado variación significativa en las concentraciones de ácido ganodérico entre aislados.",
    },
    keyBenefits: [
      { icon: 'shield', label: 'Most Studied Medicinal Mushroom', detail: '400+ bioactives, 2,000 years of documented use, and the largest clinical trial base of any mushroom species' },
      { icon: 'heart', label: 'Economical Genetics Access', detail: 'At $12.99 — the lowest cost entry to Ganoderma. Develop your own high-ganoderic-acid isolate through agar selection' },
      { icon: 'activity', label: 'Genetic Variation for Selection', detail: 'Ganoderma spore populations show variation in ganoderic acid concentration — agar selection may identify premium medicinal strains' },
      { icon: 'brain', label: 'Advanced Cultivator Project', detail: 'The 21–35 day agar-to-grain timeline is a feature, not a flaw — Reishi rewards patience with superior medicinal fruiting bodies' },
    ],
  },
  'shiitake-spore-syringe': {
    id: 'sp6', slug: 'shiitake-spore-syringe',
    name: { en: 'Shiitake Spore Syringe', es: 'Jeringa de Esporas Shiitake' },
    description: {
      en: "Lentinula edodes spore suspension — 10cc, lab-prepared. Shiitake is the second most cultivated mushroom in the world — and working from spores is how the best commercial cultivators develop proprietary high-yield strains with superior flavor profiles.\n\nGermination on MEA agar takes 7–14 days. Shiitake mycelium is dense, ropy, and distinctive — easy to identify and select from on agar plates. The key selection criteria: fastest growth rate, densest mycelial mats, and minimal sectoring. Transfer selected isolates to supplemented oak sawdust blocks or oak logs for fruiting.\n\nFlavor note: Shiitake cultivated on oak sawdust develops more complex umami than on wheat straw — the substrate influences the flavor profile. Spore-derived isolates allowed to develop on agar before grain often produce superior flavor compared to fast-colonization LC inoculations.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Lentinula edodes — 10cc, preparada en laboratorio. El Shiitake es el segundo hongo más cultivado del mundo — y trabajar desde esporas es cómo los mejores cultivadores comerciales desarrollan cepas propias de alto rendimiento con perfiles de sabor superiores.\n\nLa germinación en agar MEA tarda 7–14 días. El micelio de Shiitake es denso, fibroso y distintivo.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'shiitake',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp6v', name: '10cc', price: 1299, stock: 45, sku: 'SHS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'intermediate', colonizationTime: '21–35 days (on grain)', fruitingTempF: '55–75°F', fruitingTempC: '13–24°C', idealSubstrate: 'Hardwood sawdust blocks or oak logs', expectedYield: 'Multiple flushes (perennial on logs)', indoorOutdoor: 'both' },
    isOrganic: true, inStock: true, tags: ['edible', 'spore-syringe', 'shiitake'], relatedProducts: ['shiitake-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Lentinula edodes contains lentinan — a beta-1,3/1,6-glucan and one of the most studied polysaccharides in medicinal mycology. Lentinan has been approved as an adjunct cancer therapy in Japan since 1985, administered IV in combination with chemotherapy. Oral administration (as in whole mushroom consumption) shows immunostimulating effects, though at lower potency than IV delivery.\n\nEritadenine, also unique to Shiitake, is a nucleotide analog that inhibits an enzyme in the phospholipid metabolism pathway, reducing total cholesterol and LDL levels. A meta-analysis of 7 trials (Ren et al., 2017) confirmed significant cholesterol-lowering effect at standard dietary doses.\n\nFrom spores, you can develop Shiitake strains optimized for your specific substrate, grow room temperature, and target flavor profile. The genetic diversity in L. edodes is significant — wild-type isolates often outperform commercial strains on traditional oak log cultivation.",
      es: "Lentinula edodes contiene lentinano — un beta-1,3/1,6-glucano y uno de los polisacáridos más estudiados en micología medicinal. El lentinano ha sido aprobado como terapia adjunta contra el cáncer en Japón desde 1985.\n\nDesde esporas, puedes desarrollar cepas de Shiitake optimizadas para tu sustrato específico, temperatura de sala de cultivo y perfil de sabor objetivo. La diversidad genética en L. edodes es significativa — los aislados silvestres a menudo superan a las cepas comerciales en el cultivo de troncos de roble tradicionales.",
    },
    keyBenefits: [
      { icon: 'heart', label: 'Lentinan — Cancer Adjunct', detail: 'Beta-1,3/1,6-glucan approved in Japan as chemotherapy adjunct since 1985; the most clinically validated mushroom polysaccharide' },
      { icon: 'shield', label: 'Cholesterol Management', detail: 'Eritadenine inhibits phospholipid metabolism → reduces LDL + total cholesterol; confirmed in meta-analysis of 7 RCTs' },
      { icon: 'activity', label: 'Strain Development', detail: 'Develop proprietary high-yield Shiitake isolates through agar selection — the method used by the best commercial spawn labs' },
      { icon: 'leaf', label: 'Superior Flavor from Spores', detail: 'Spore-derived isolates allowed agar development often produce more complex umami than fast-colonization LC inoculations' },
    ],
  },
  'cordyceps-militaris-spore-syringe': {
    id: 'sp7', slug: 'cordyceps-militaris-spore-syringe',
    name: { en: 'Cordyceps Militaris Spore Syringe', es: 'Jeringa de Esporas Cordyceps Militaris' },
    description: {
      en: "Cordyceps militaris spore suspension — 10cc, lab-prepared. For mycologists who want to develop their own Cordyceps isolates from the ground up. Germination on agar takes 7–14 days — select fast-growing, orange-tinged sectors before transferring to grain.\n\nCordyceps militaris from spores is advanced work. The species is sensitive to contamination and requires precise environmental control. But the reward is significant: by developing your own isolate on agar, you can select for faster stromata formation, brighter orange coloration, and higher cordycepin content — the adenosine analog responsible for Cordyceps' ATP production benefits.\n\nNote: Cordyceps militaris requires a 12h light/dark cycle to trigger stroma formation — this is not optional. Once grain is colonized, maintain high humidity (90–95%), 60–72°F, and consistent light schedule. Stromata develop over 30–60 days.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Cordyceps militaris — 10cc, preparada en laboratorio. Para micólogos que quieren desarrollar sus propios aislados de Cordyceps desde cero. La germinación en agar tarda 7–14 días.\n\nNota: Cordyceps militaris requiere un ciclo de luz/oscuridad de 12h para desencadenar la formación de estroma — esto no es opcional.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'cordyceps',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp7v', name: '10cc', price: 1299, stock: 25, sku: 'CMS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days (on grain)', fruitingTempF: '60–75°F', fruitingTempC: '15–24°C', idealSubstrate: 'Cooked grain (wheat berries, brown rice)', expectedYield: '50–150g dry per substrate', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'cordyceps'], relatedProducts: ['cordyceps-militaris-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Cordyceps militaris contains cordycepin (3-deoxyadenosine) — an adenosine analog that is the primary bioactive compound driving the species' performance-enhancement reputation. Cordycepin acts as a competitive inhibitor of adenosine deaminase and integrates into adenosine pathways, influencing ATP production, oxygen utilization, and cellular energy metabolism.\n\nA 2010 randomized trial (Chen et al.) found significant improvements in VO2 max and lactate threshold in elderly subjects after 12 weeks of Cordyceps supplementation. A 2016 study in Journal of Dietary Supplements found increased time to exhaustion and improved oxygen utilization in healthy adults. The adenosine analog mechanism is distinct from caffeine — it works at the cellular level rather than through CNS stimulation.\n\nFrom spores, selecting for faster orange stroma formation and brighter coloration on agar is a validated proxy for higher cordycepin content — research has shown correlation between stroma pigmentation intensity and cordycepin concentration (Dong et al., 2014). This is the strongest argument for spore-based Cordyceps cultivation over simple LC inoculation.",
      es: "Cordyceps militaris contiene cordycepina (3-desoxiadenosina) — un análogo de adenosina que es el compuesto bioactivo primario. La cordycepina actúa como inhibidor competitivo de la adenosina deaminasa, influyendo en la producción de ATP, utilización de oxígeno y metabolismo energético celular.\n\nDesde esporas, seleccionar para la formación más rápida de estroma naranja y coloración más brillante en agar es un proxy validado para mayor contenido de cordycepina — la investigación ha mostrado correlación entre la intensidad de pigmentación de estroma y la concentración de cordycepina.",
    },
    keyBenefits: [
      { icon: 'zap', label: 'Cordycepin Selection', detail: 'Brighter orange agar sectors correlate with higher cordycepin content — spore selection outperforms random LC inoculation for medicinal use' },
      { icon: 'activity', label: 'VO2 Max + ATP Production', detail: 'Adenosine analog mechanism: increases oxygen utilization at cellular level; RCT-confirmed improvement in VO2 max and time to exhaustion' },
      { icon: 'brain', label: 'Advanced Genetics Work', detail: "Develop proprietary high-cordycepin Cordyceps isolates — the methodology used by commercial medicinal spawn labs" },
      { icon: 'shield', label: 'Non-CNS Performance', detail: 'Works via adenosine pathway, not caffeine/CNS stimulation — energy enhancement without jitteriness or sleep disruption' },
    ],
  },
  'antler-reishi-spore-syringe': {
    id: 'sp8', slug: 'antler-reishi-spore-syringe',
    name: { en: 'Antler Reishi Spore Syringe', es: 'Jeringa de Esporas Reishi Antler' },
    description: {
      en: "Ganoderma lucidum (antler strain) spore suspension — 10cc, lab-prepared. Working from Antler Reishi spores allows you to develop your own high-ganoderic-acid isolate optimized for antler formation under high CO2 — a project that takes months but produces genetics you own permanently.\n\nGermination takes 7–14 days on MEA agar. The critical selection step: once sectors form, culture them under elevated CO2 (place plates in a sealed container with minimal fresh air) and select sectors that grow fastest under CO2-stress. These sectors carry the genetics most predisposed to antler formation at scale.\n\nThis is a long project. Agar → LC → grain colonization (21–35 days) → fruiting under high CO2 (30–60 days for antler development). But the result is a proprietary Antler Reishi strain that produces consistently dramatic antler formation — without ever buying genetics again.\n\nAdvanced cultivators and tincture makers only.\n\nEach packet: 10cc syringe · 16G sterile needle · alcohol prep swab · shrooms instruction card.",
      es: "Suspensión de esporas de Ganoderma lucidum (cepa antler) — 10cc, preparada en laboratorio. Trabajar desde esporas de Reishi Antler te permite desarrollar tu propio aislado de alto contenido en ácido ganodérico optimizado para la formación de astas bajo CO2 elevado.\n\nPaso de selección crítico: una vez que se forman los sectores, cultívalos bajo CO2 elevado y selecciona los sectores que crecen más rápido bajo estrés de CO2.\n\nSolo cultivadores avanzados y fabricantes de tintura.\n\nCada paquete: jeringa 10cc · aguja estéril 16G · swab de alcohol · tarjeta de instrucciones shrooms.",
    },
    category: 'spawn', subcategory: 'Spore Syringe', species: 'reishi',
    price: 1299, compareAtPrice: 1499,
    variants: [{ id: 'sp8v', name: '10cc', price: 1299, stock: 20, sku: 'ARS-10CC' }],
    images: [],
    cultivationSpecs: { difficulty: 'advanced', colonizationTime: '21–35 days (on grain)', fruitingTempF: '70–82°F', fruitingTempC: '21–28°C', idealSubstrate: 'Supplemented hardwood sawdust', expectedYield: '1–2 flushes (medicinal use)', indoorOutdoor: 'indoor' },
    isOrganic: true, inStock: true, tags: ['medicinal', 'spore-syringe', 'reishi', 'antler'], relatedProducts: ['antler-reishi-liquid-culture'],
    howToUseSteps: SPORE_HOW_TO_USE_STEPS,
    scienceContent: {
      en: "Antler Reishi spores carry the genetics for Ganoderma lucidum's full 400+ bioactive compound profile — with the added potential to select specifically for CO2-responsive growth, which is the phenotypic trait that drives antler formation. This CO2-selection methodology has been documented in commercial Antler Reishi production research (Kim et al., 2012) and is the basis for developing high-performance antler-forming strains.\n\nAll clinical research on Ganoderma lucidum applies: ganoderic acid inhibition of HMG-CoA reductase and ACE, beta-glucan immunomodulation, cortisol regulation via HPA axis, NK cell activation, and hepatoprotective effects documented in multiple Phase II trials.\n\nThe antler form's elevated surface area provides superior extraction efficiency for dual-extraction tincture production — 15–20% higher triterpene yield per gram compared to equivalent cap material, based on commercial extraction studies. Developing your own antler-optimized strain from spores is the foundation of a premium tincture operation.",
      es: "Las esporas de Reishi Antler llevan la genética para el perfil completo de 400+ compuestos bioactivos de Ganoderma lucidum — con el potencial adicional de seleccionar específicamente para el crecimiento responsivo al CO2, que es el rasgo fenotípico que impulsa la formación de astas.\n\nToda la investigación clínica sobre Ganoderma lucidum aplica. La forma antler proporciona 15–20% mayor rendimiento de triterpenos por gramo en comparación con el material de sombrero equivalente, según estudios de extracción comercial.",
    },
    keyBenefits: [
      { icon: 'leaf', label: 'CO2-Responsive Selection', detail: 'Select for fastest CO2-stress growth on agar — the validated proxy for antler-formation genetics at scale' },
      { icon: 'shield', label: 'Premium Tincture Genetics', detail: '15–20% higher triterpene extraction yield from antler form vs cap — develop the strain that powers your tincture operation' },
      { icon: 'activity', label: 'Same 400+ Bioactives', detail: 'Full Ganoderma lucidum compound profile in the spore blueprint — ganoderic acids, beta-glucans, immunomodulating proteins' },
      { icon: 'heart', label: 'Permanent Genetics Investment', detail: "Months of development — then you own the strain forever. The only spore syringe that builds a proprietary medicinal asset" },
    ],
  },
}

const TABS = ['description', 'howToUse', 'science', 'reviews'] as const

export default function ProductPage({ params }: { params: { slug: string } }) {
  const locale = useLocale() as 'en' | 'es'
  const t = useTranslations('shop.product')
  const tc = useTranslations('common')

  const product = PRODUCTS[params.slug] ?? LC_PRODUCTS[params.slug] ?? SPORE_PRODUCTS[params.slug]
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
