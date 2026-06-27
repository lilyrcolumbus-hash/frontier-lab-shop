# Shrooms — AI Photo Prompts

Usa estos prompts en **OpenArt**, **Midjourney**, **Kling**, o cualquier generador de imágenes.
Cada prompt está listo para pegar directamente. Genera en **1:1** (cuadrado) o **4:3** para product cards.

**Negative prompt recomendado para todos:**
`cartoon, illustration, drawing, painting, CGI render, unrealistic, overexposed, washed out, white background, studio backdrop, stock photo watermark, blurry`

**Estilo base del sitio:** oscuro, dramático, bosque encantado, iluminación ámbar cálida, fondos naturales (madera, musgo, sustrato). Misma energía en todas las fotos.

---

## 🦁 Lion's Mane — *Hericium erinaceus*

**Placeholder actual:** `https://images.unsplash.com/photo-1607305387299-a3d9611cd469`

```
Close-up product photograph of a fresh Lion's Mane mushroom (Hericium erinaceus), 
dense cascading white icicle-like spines filling the entire frame, resting on dark 
weathered hardwood with scattered white mycelium threads. Dramatic chiaroscuro lighting 
from above-left, warm amber rim light glowing from behind, deep dark forest background 
with soft bokeh of moss and wood grain. Commercial e-commerce mushroom cultivation 
photography. Ultra-sharp detail on every spine, 8K resolution, food photography style.
```

---

## 🍄 Shiitake — *Lentinula edodes*

**Placeholder actual:** `https://images.unsplash.com/photo-1585155784229-aff921ccfa12`

```
Close-up product photograph of a cluster of 4-6 fresh Shiitake mushrooms (Lentinula 
edodes), rich dark brown velvety caps with pale cream gills and woody stems, arranged 
on an aged oak log with visible inoculation holes and mycelium halos. Moody single 
directional light from the side, deep dark mossy green background in soft bokeh. 
Rich earth tones, deep browns and cream. Commercial mushroom e-commerce photography, 
ultra-sharp detail, 8K, food photography.
```

---

## 🌊 Blue Oyster — *Pleurotus ostreatus*

**Placeholder actual:** `https://images.unsplash.com/photo-1504545102780-26774c1bb073`

```
Close-up product photograph of a Blue Oyster mushroom cluster (Pleurotus ostreatus), 
overlapping blue-grey fan-shaped caps in a dense fruiting body bursting from a dark 
substrate bag, delicate gills visible underneath. Cool dramatic side lighting with 
silver-blue tones, condensation droplets on the caps, deep black background. Clean, 
elegant, cool color palette. Commercial mushroom cultivation e-commerce photography, 
ultra-sharp, 8K, food photography.
```

---

## 🌸 Pink Oyster — *Pleurotus djamor*

**Placeholder actual:** `https://images.unsplash.com/photo-1773600149997-2b6af77031d7`

```
Close-up product photograph of a Pink Oyster mushroom cluster (Pleurotus djamor), 
vibrant magenta-pink ruffled fan-shaped caps in a dense lush flush, bursting from a 
dark brown substrate block. Warm dramatic backlighting creating a translucent hot-pink 
glow through the delicate cap edges, deep black background. Vivid saturated magentas 
and pinks against absolute darkness, lush and organic. Commercial mushroom cultivation 
e-commerce photography, ultra-sharp, 8K, food photography.
```

---

## ✨ Yellow Oyster — *Pleurotus citrinopileatus*

**Placeholder actual:** `https://images.unsplash.com/photo-1748118869505-e75f25812a70`

```
Close-up product photograph of a Yellow Oyster mushroom cluster (Pleurotus 
citrinopileatus), bright golden-yellow ruffled delicate caps in a dense bouquet-like 
cluster growing from dark hardwood substrate. Warm amber key light from the right side, 
very dark near-black background with faint deep green bokeh. Vivid golden-sunlight glow 
against deep darkness. Commercial mushroom cultivation e-commerce photography, 
ultra-sharp, 8K, food photography.
```

---

## 🔴 Reishi — *Ganoderma lucidum*

**Placeholder actual:** `https://images.unsplash.com/photo-1504470695779-75300268aa0e`

```
Close-up product photograph of a mature Reishi mushroom (Ganoderma lucidum), 
distinctive kidney-shaped shelf mushroom with a shiny lacquered dark mahogany-red top 
surface and cream-white porous underside, growing dramatically from an aged dark 
hardwood log. Dramatic single spotlight from directly above, deep black background, 
warm amber accent light catching the lacquered cap surface. Ancient, medicinal, 
powerful mood. Commercial e-commerce photography, ultra-sharp macro detail, 8K.
```

---

## Workflow recomendado en OpenArt

1. Abre **OpenArt** → **Image Generator** → modelo **FLUX Pro** o **Stable Diffusion XL**
2. Pega el prompt de la especie que quieras
3. Pega el negative prompt en el campo negativo
4. Ratio: **1:1** (800×800) para thumbnails, **4:3** (1200×900) para hero images
5. Genera 4 variaciones → elige la mejor
6. Sube a Cloudinary → reemplaza la URL en el código

**Cuando tengas la foto lista**, actualiza la URL en estos archivos:
- `components/home/SpeciesSpotlight.tsx` → `thumbnailUrl`
- `app/[locale]/encyclopedia/page.tsx` → `imageUrl` + `thumbnailUrl`
