// Card visual de um layout na galeria. O thumbnail é gerado a partir do
// 1º slide do layout, renderizado em mini-escala.
// Cards de story usam proporção 9:16 (mais estreita e alta).

import type { Layout, RenderContext } from "../core/types"
import { esc } from "../core/template"
import { colors } from "../core/colors"
import { handle } from "../core/handle"

export function renderLayoutCard(layout: Layout): string {
  const firstSlide = layout.slides[0]
  const ctx: RenderContext = {
    handle: handle.get(),
    colors: colors.get(),
    slideIndex: 0,
    totalSlides: layout.slides.length,
  }
  const defaults: Record<string, string> = {}
  for (const f of firstSlide.fields) defaults[f.id] = f.default

  const isStory = layout.format === "story"
  const scalerClass = `frame-scaler frame-scaler--thumb${isStory ? " frame-scaler--story frame-scaler--story-thumb" : ""}`
  const mountClass  = `frame-mount${isStory ? " frame-mount--story" : ""}`

  const slideCount = layout.slides.length
  const slideWord  = slideCount === 1 ? "frame" : "frames"
  const formatBadge = isStory
    ? `<span class="layout-card-format layout-card-format--story">story 9:16</span>`
    : `<span class="layout-card-format">carrossel 4:5</span>`

  return `
    <article class="layout-card ${isStory ? "layout-card--story" : ""}" data-layout-id="${esc(layout.id)}" role="button" tabindex="0">
      <div class="layout-card-preview">
        <div class="${scalerClass}">
          <div class="${mountClass}">${firstSlide.render(defaults, ctx)}</div>
        </div>
      </div>
      <div class="layout-card-meta">
        <div class="layout-card-row">
          <h3>${esc(layout.name)}</h3>
          <span class="layout-card-count">${slideCount} ${slideWord}</span>
        </div>
        <p>${esc(layout.description)}</p>
        <div class="layout-card-badges">
          ${formatBadge}
          ${layout.category ? `<span class="layout-card-tag">${esc(layout.category)}</span>` : ""}
        </div>
      </div>
    </article>
  `
}
