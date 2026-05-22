// TypographyStore: persiste escolha de heading/body font por layout no localStorage.
// CustomFontRegistry: lista global de fontes adicionadas pelo usuário (compartilhada entre layouts).
//
// O store aplica as vars CSS --font-heading e --font-body no :root cada vez que muda.

import type { LayoutTypography, FontRole, FontWeight } from "./types"
import { loadGoogleFont } from "./fontLoader"

const CUSTOM_FONTS_KEY = "mybuddy-custom-fonts"

// Fontes curadas — carregadas sob demanda ao abrir o dropdown.
export const CURATED_FONTS: { family: string; weights: FontWeight[] }[] = [
  { family: "DynaPuff", weights: [400, 500, 600, 700] },
  { family: "Inter", weights: [400, 500, 600, 700] },
  { family: "Poppins", weights: [400, 500, 600, 700] },
  { family: "Nunito", weights: [400, 500, 600, 700] },
  { family: "Raleway", weights: [400, 500, 600, 700] },
  { family: "Playfair Display", weights: [400, 500, 600, 700] },
  { family: "Merriweather", weights: [400, 700] },
  { family: "Oswald", weights: [400, 500, 600, 700] },
  { family: "Bebas Neue", weights: [400] },
  { family: "Montserrat", weights: [400, 500, 600, 700] },
  { family: "Lato", weights: [400, 700] },
  { family: "Source Sans 3", weights: [400, 600, 700] },
]

// ===== CustomFontRegistry =====

export const customFonts = {
  get(): string[] {
    try {
      return JSON.parse(localStorage.getItem(CUSTOM_FONTS_KEY) ?? "[]") as string[]
    } catch {
      return []
    }
  },

  add(family: string): void {
    const list = this.get()
    if (!list.includes(family)) {
      list.push(family)
      localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(list))
    }
  },

  remove(family: string): void {
    const list = this.get().filter(f => f !== family)
    localStorage.setItem(CUSTOM_FONTS_KEY, JSON.stringify(list))
  },
}

// ===== TypographyStore =====

export class TypographyStore {
  private key: string
  private _current: LayoutTypography
  private listeners: Set<() => void> = new Set()

  constructor(layoutId: string, defaults: LayoutTypography) {
    this.key = `mybuddy-typography:${layoutId}`
    const saved = this.load()
    this._current = saved ?? { ...defaults }
    this.applyVars()
  }

  get(): LayoutTypography {
    return this._current
  }

  setHeading(role: Partial<FontRole>): void {
    this._current = {
      ...this._current,
      heading: { ...this._current.heading, ...role },
    }
    this.save()
    this.applyVars()
    this.notify()
  }

  setBody(role: Partial<FontRole>): void {
    this._current = {
      ...this._current,
      body: { ...this._current.body, ...role },
    }
    this.save()
    this.applyVars()
    this.notify()
  }

  reset(defaults: LayoutTypography): void {
    this._current = { ...defaults }
    this.save()
    this.applyVars()
    this.notify()
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private applyVars(): void {
    const root = document.documentElement
    root.style.setProperty("--font-heading", `'${this._current.heading.family}', sans-serif`)
    root.style.setProperty("--font-heading-weight", String(this._current.heading.weight))
    root.style.setProperty("--font-body", `'${this._current.body.family}', sans-serif`)
    root.style.setProperty("--font-body-weight", String(this._current.body.weight))
  }

  private notify(): void {
    this.listeners.forEach(fn => fn())
  }

  private save(): void {
    localStorage.setItem(this.key, JSON.stringify(this._current))
  }

  private load(): LayoutTypography | null {
    try {
      const raw = localStorage.getItem(this.key)
      return raw ? (JSON.parse(raw) as LayoutTypography) : null
    } catch {
      return null
    }
  }
}

// Precarrega todas as fontes curadas (400+700) — chamado ao abrir o font picker.
export async function preloadCuratedFonts(): Promise<void> {
  await Promise.all(
    CURATED_FONTS.map(f => loadGoogleFont(f.family, f.weights)),
  )
}
