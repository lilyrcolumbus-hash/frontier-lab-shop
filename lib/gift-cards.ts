import { randomBytes } from 'crypto'

/**
 * Gift card codes.
 *
 * Ambiguous characters (0/O, 1/I) are left out because these get read aloud and typed by hand.
 * Generated from crypto random bytes rather than Math.random — a guessable code is money.
 */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateGiftCardCode(): string {
  const bytes = randomBytes(16)
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length])
  // Grouped in fours, the way a card is printed.
  return [chars.slice(0, 4), chars.slice(4, 8), chars.slice(8, 12), chars.slice(12, 16)]
    .map((group) => group.join(''))
    .join('-')
}
