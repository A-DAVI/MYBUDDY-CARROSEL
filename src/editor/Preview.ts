// Renderiza os slides do layout ativo no container central.
// Re-renderiza inteiro a cada mudança de estado — frames são HTML simples
// em 1080×1350 (carousel) ou 1080×1920 (story) com transform: scale() externo.

import type { Layout, RenderContext } from "../core/types"
import type { LayoutStore } from "../core/state"
import { colors } from "../core/colors"
import { handle } from "../core/handle"

export class Preview {
  constructor(
    private root: HTMLElement,
    private store: LayoutStore,
  ) {}

  render(): void {
    const layout = this.store.layout
    const isStory = layout.format === "story"
    const html: string[] = []

    for (let i = 0; i < layout.slides.length; i++) {
      const slide = layout.slides[i]
      const slideState = this.store.slideState(slide.id)
      const ctx: RenderContext = {
        handle: handle.get(),
        colors: colors.get(),
        slideIndex: i,
        totalSlides: layout.slides.length,
      }
      const inner = slide.render(slideState, ctx)
      const scalerCls = `frame-scaler${isStory ? " frame-scaler--story" : ""}`
      const mountCls  = `frame-mount${isStory ? " frame-mount--story" : ""}`

      // Safe zone overlays são siblings do .frame dentro do .frame-mount.
      // html2canvas captura apenas o .frame, então elas não entram no export.
      const safeZoneOverlays = isStory ? `
        <div class="safe-overlay safe-overlay--top"></div>
        <div class="safe-overlay safe-overlay--bottom"></div>
      ` : ""

      html.push(`
        <div class="${scalerCls}" data-slide-index="${i}">
          <div class="${mountCls}" id="frame-mount-${i}">
            ${safeZoneOverlays}
            ${inner}
          </div>
        </div>
      `)
    }

    this.root.innerHTML = html.join("")
  }

  /** Retorna o elemento .frame de cada slide (usado pelo exporter). */
  frameAt(index: number): HTMLElement | null {
    const mount = document.getElementById(`frame-mount-${index}`)
    return mount?.querySelector<HTMLElement>(".frame") ?? null
  }

  get layout(): Layout {
    return this.store.layout
  }
}
