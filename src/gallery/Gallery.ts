// Tela inicial: grid de layouts disponíveis com abas Carrossel / Stories.
//
// Nota CSS: cada layout traz seu próprio CSS via styles string; na galeria todos
// precisam estar carregados ao mesmo tempo porque os thumbs renderizam slides de
// layouts diferentes. Então injeta TODOS os styles de uma vez.

import type { Layout, LayoutFormat } from "../core/types"
import { layouts } from "../layouts"
import { renderLayoutCard } from "./LayoutCard"

const GALLERY_STYLE_TAG_ID = "gallery-layout-styles"

type Tab = LayoutFormat

export class Gallery {
  private activeTab: Tab = "carousel"

  constructor(
    private appRoot: HTMLElement,
    private onPickLayout: (layout: Layout) => void,
  ) {}

  mount(): void {
    this.injectAllLayoutStyles()
    this.renderShell()
    this.renderGrid()
    this.attachListeners()
  }

  unmount(): void {
    this.removeAllLayoutStyles()
    this.appRoot.innerHTML = ""
  }

  private renderShell(): void {
    const carouselCount = layouts.filter(l => l.format === "carousel").length
    const storyCount    = layouts.filter(l => l.format === "story").length

    this.appRoot.innerHTML = `
      <div class="gallery">
        <header class="gallery-head">
          <h1>🐾 MyBuddy Carousel Editor</h1>
          <p>escolha um layout pra começar.</p>
        </header>

        <nav class="gallery-tabs" role="tablist">
          <button class="gallery-tab ${this.activeTab === "carousel" ? "active" : ""}"
            data-tab="carousel" role="tab">
            Carrossel <span class="tab-count">${carouselCount}</span>
          </button>
          <button class="gallery-tab ${this.activeTab === "story" ? "active" : ""}"
            data-tab="story" role="tab">
            Stories <span class="tab-count">${storyCount}</span>
          </button>
        </nav>

        <div class="gallery-grid" id="gallery-grid"></div>

        <footer class="gallery-foot">
          <p>${layouts.length} layouts disponíveis · adicionar mais: ver README</p>
        </footer>
      </div>
    `
  }

  private renderGrid(): void {
    const grid = this.appRoot.querySelector<HTMLElement>("#gallery-grid")
    if (!grid) return
    const visible = layouts.filter(l => l.format === this.activeTab)
    grid.innerHTML = visible.map(l => renderLayoutCard(l)).join("")

    grid.querySelectorAll<HTMLElement>(".layout-card").forEach(card => {
      const pick = () => {
        const id = card.dataset.layoutId
        const layout = layouts.find(l => l.id === id)
        if (layout) this.onPickLayout(layout)
      }
      card.addEventListener("click", pick)
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick() }
      })
    })
  }

  private attachListeners(): void {
    this.appRoot.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.dataset.tab as Tab
        this.appRoot.querySelectorAll("[data-tab]").forEach(b =>
          b.classList.toggle("active", b === btn),
        )
        this.renderGrid()
      })
    })
  }

  private injectAllLayoutStyles(): void {
    this.removeAllLayoutStyles()
    const css = layouts.map(l => l.styles ?? "").join("\n")
    if (!css.trim()) return
    const tag = document.createElement("style")
    tag.id = GALLERY_STYLE_TAG_ID
    tag.textContent = css
    document.head.appendChild(tag)
  }

  private removeAllLayoutStyles(): void {
    document.getElementById(GALLERY_STYLE_TAG_ID)?.remove()
  }
}
