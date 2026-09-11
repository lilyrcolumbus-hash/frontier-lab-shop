# FRONTIER LAB — logo oficial (fijo)

Wordmark apilado + hélice de ADN en el hueco de la "I" de FRONTIER.
Este es el logo canónico. Vive en **dos repos** y debe ser el mismo en los dos:
- `openart-agent/data/brands/frontier-lab-logo/`  (este)
- `FRONTIER LAB/public/brand/`  (sitio web) + `components/ui/Logo.tsx` (render en vivo)

## Tipografía
- **FRONTIER** — Inter **ExtraBold / 800**, tracking +2 % (0.02em)
- **LAB** — Inter **Bold / 700**, tracking +34 % (0.34em), tamaño ≈ 47 % del alto de FRONTIER
- Apilado: LAB alineado a la derecha (su borde derecho coincide con el de FRONTIER), pegado debajo, line-height ~0.9

## Hélice (variante w1 — fija)
- Reemplaza la "I". Doble hélice + travesaños, silueta vertical angosta: lee como "I" y como ADN.
- Alto = altura de mayúscula de FRONTIER, a ras (vértice sup. en la línea de mayúscula, inf. en la base).
- Geometría (viewBox 100×320): trazo 16 · amplitud 24 · onda completa (2 cruces) · 4 travesaños en t = 0.18/0.32/0.68/0.82 (trazo ×0.8) · remates redondos.

## Colores y 4 variantes
| Variante | Wordmark | Hélice | Uso |
|---|---|---|---|
| `black`       | #141414 | #141414 | monocromo sobre fondo claro |
| `white`       | #FFFFFF | #FFFFFF | monocromo sobre fondo oscuro |
| `black-gold`  | #141414 | #9E6820 | fondo claro, acento premium (frente, web, hero) |
| `white-gold`  | #FFFFFF | #9E6820 | fondo oscuro, acento premium |

Dorado = **#9E6820** (ámbar del brand guide, "acento premium").

## Archivos
- `frontier-lab-logo-{black,white,black-gold,white-gold}.png` — logo completo, transparente
- `frontier-lab-logo-preview.png` — las 4 sobre fondo claro/oscuro
- `frontier-helix-{black,gold,white}.svg` / `.png` — hélice sola (trazo), transparente
- `frontier-helix-editable.svg` — **hélice como UN path relleno** para Canva: se importa como una
  sola forma → cambiar color, tamaño y rotación libremente. `-preview.png` la muestra en 2 colores.
- `canva-recipe.png` / `.js` — cómo rearmar el wordmark en Canva (texto Inter) + colocar la hélice
- `generate.js` — regenera el logo y la hélice de trazo: `node generate.js <carpeta destino>`
- `helix-canva.js` — regenera `frontier-helix-editable.svg`

## Dónde va
Todos los lugares donde aparezca el logo de Frontier Lab: sitio web (Header/Footer/emails),
etiquetas de producto, tarjetas, listings, redes. Nunca la versión vieja (Helvetica Neue).
