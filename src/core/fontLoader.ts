// Lazy-injects Google Fonts <link> tags on demand.
// Tracks which family+weight combos are already loaded to avoid duplicate requests.

import type { FontWeight } from "./types"

const loaded = new Set<string>()

function cacheKey(family: string, weights: FontWeight[]): string {
  return `${family}:${[...weights].sort().join(",")}`
}

export function loadGoogleFont(family: string, weights: FontWeight[] = [400, 700]): Promise<void> {
  const key = cacheKey(family, weights)
  if (loaded.has(key)) return Promise.resolve()
  loaded.add(key)

  const encoded = family.replace(/ /g, "+")
  const wStr = weights.join(";")
  const href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${wStr}&display=swap`

  return new Promise(resolve => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => resolve() // silent fail — font just won't apply
    document.head.appendChild(link)
  })
}

// Validates that a family name resolves on Google Fonts by attempting to load it.
// Returns true if loaded successfully (doesn't guarantee it's a real font name —
// Google Fonts returns 200 even for unknown families, so we probe the FontFace API).
export async function validateGoogleFont(family: string): Promise<boolean> {
  await loadGoogleFont(family, [400])
  try {
    // Wait a tick for the stylesheet to parse, then check if the font is usable.
    await document.fonts.load(`400 16px '${family}'`)
    const faces = [...document.fonts.values()]
    return faces.some(f => f.family.replace(/['"]/g, "") === family && f.status === "loaded")
  } catch {
    return false
  }
}
