// Sidebar dinâmica: gera todos os inputs a partir do Layout ativo.
// Cobre 3 grupos: paleta global, handle, e os fields de cada slide.

import type { Layout } from "../core/types"
import type { LayoutStore } from "../core/state"
import { colors, DEFAULT_COLORS } from "../core/colors"
import { handle } from "../core/handle"
import { renderField, bindImageFields } from "./fields"
import { renderColorField } from "./fields/ColorField"
import { esc } from "../core/template"

// ID do input: só precisa ser único dentro da sidebar.
function inputIdFor(slideId: string, fieldId: string): string {
  return `f-${slideId}-${fieldId}`
}

export class Sidebar {
  constructor(
    private root: HTMLElement,
    private store: LayoutStore,
    private onBackToGallery: () => void,
    private onExportAll: () => void,
    private onExportZip: () => void,
    private onExportSlide: (index: number) => void,
  ) {}

  render(): void {
    const layout = this.store.layout
    const state = this.store.get()

    this.root.innerHTML = `
      <header class="sidebar-head">
        <button class="link-btn" id="btn-back-gallery">← galeria</button>
        <h1>🐾 ${esc(layout.name)}</h1>
        <p class="subtitle">${esc(layout.description)}</p>
      </header>

      <div class="editor-section">
        <h3>💾 sessão</h3>
        <div class="export-section">
          <button class="export-btn secondary small" id="btn-export-json">📤 exportar config (.json)</button>
          <label class="export-btn secondary small" style="text-align:center;cursor:pointer;">
            📥 importar config (.json)
            <input type="file" id="import-json" accept=".json" hidden>
          </label>
          <button class="export-btn secondary small" id="btn-reset">↩ resetar layout</button>
        </div>
        <p class="info-box">💡 edições salvas automaticamente no navegador, por layout.</p>
      </div>

      <div class="editor-section">
        <h3>🎨 paleta da marca</h3>
        <div class="colors-grid" id="colors-grid">
          ${this.renderColorsGrid()}
        </div>
        <button class="link-btn" id="btn-reset-colors">restaurar paleta padrão</button>
      </div>

      <div class="editor-section">
        <h3>📱 handle</h3>
        <div class="field">
          <label for="input-handle">usuário Instagram</label>
          <input type="text" id="input-handle" value="${esc(handle.get())}">
        </div>
      </div>

      ${layout.slides.map((slide, idx) => this.renderSlideSection(slide, idx, state[slide.id] ?? {})).join("")}

      <div class="editor-section">
        <h3>📤 exportar</h3>
        <div class="export-section">
          <button class="export-btn" id="btn-export-all">📥 baixar todos (1080×1350)</button>
          <button class="export-btn" id="btn-export-zip">🗜 baixar ZIP (${layout.slides.length} ${layout.slides.length === 1 ? "slide" : "slides"})</button>
          ${layout.slides.map((s, i) => `
            <button class="export-btn secondary small" data-export-slide="${i}">
              ${i + 1}. ${esc(s.label)}
            </button>
          `).join("")}
        </div>
        <p class="info-box">💡 PNGs em 1080×1350 prontos pro Instagram (4:5).<br>Use <strong>Ctrl+E</strong> pra exportar todos.</p>
      </div>
    `

    this.attachListeners()
  }

  private renderColorsGrid(): string {
    const c = colors.get()
    const fields: { id: keyof typeof DEFAULT_COLORS; label: string }[] = [
      { id: "bg", label: "fundo" },
      { id: "orange", label: "laranja" },
      { id: "olive", label: "oliva" },
      { id: "ink", label: "preto" },
      { id: "red", label: "vermelho" },
      { id: "white", label: "branco" },
    ]
    return fields.map(f =>
      renderColorField(
        { id: f.id, type: "color", label: f.label, default: c[f.id] },
        c[f.id],
        `color-${f.id}`,
      ),
    ).join("")
  }

  private renderSlideSection(
    slide: Layout["slides"][number],
    index: number,
    slideState: Record<string, string>,
  ): string {
    const fields = slide.fields.map(f => {
      const v = slideState[f.id] ?? f.default
      return renderField(f, v, inputIdFor(slide.id, f.id))
    }).join("")

    // data-slide-id é lido pelos listeners pra saber a qual slide pertence o input.
    return `
      <div class="editor-section" data-slide-id="${esc(slide.id)}">
        <h3><span class="num">${index + 1}</span> ${esc(slide.label)}</h3>
        ${fields}
      </div>
    `
  }

  // ===== LISTENERS =====

  private attachListeners(): void {
    // voltar para galeria
    this.root.querySelector("#btn-back-gallery")?.addEventListener("click", () => {
      this.onBackToGallery()
    })

    // paleta
    this.root.querySelectorAll<HTMLInputElement>('#colors-grid input[type="color"]').forEach(input => {
      input.addEventListener("input", () => {
        const key = input.dataset.field as keyof ReturnType<typeof colors.get>
        colors.set(key, input.value)
      })
    })
    this.root.querySelector("#btn-reset-colors")?.addEventListener("click", () => {
      colors.reset()
      this.render()
    })

    // handle
    const handleInput = this.root.querySelector<HTMLInputElement>("#input-handle")
    handleInput?.addEventListener("input", () => handle.set(handleInput.value))

    // fields dos slides — text/textarea/richtext/select
    // Lê data-field (fieldId) e sobe ao [data-slide-id] mais próximo (slideId).
    this.root.querySelectorAll<HTMLElement>("[data-slide-id] [data-field]").forEach(el => {
      if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "color") return
      if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "file") return
      el.addEventListener("input", () => this.handleFieldChange(el))
      el.addEventListener("change", () => this.handleFieldChange(el))
    })

    // image fields — slideId e fieldId vêm diretamente do DOM (via data-slide-id e data-field)
    bindImageFields(
      this.root,
      (slideId, fieldId, dataUrl) => {
        this.store.setField(slideId, fieldId, dataUrl)
        this.render()
      },
      (slideId, fieldId) => {
        this.store.setField(slideId, fieldId, "")
        this.render()
      },
    )

    // sessão
    this.root.querySelector("#btn-export-json")?.addEventListener("click", () => this.exportJson())
    this.root.querySelector<HTMLInputElement>("#import-json")?.addEventListener("change", e => this.importJson(e))
    this.root.querySelector("#btn-reset")?.addEventListener("click", () => {
      if (confirm(`Resetar todos os campos do layout "${this.store.layout.name}" pro padrão?`)) {
        this.store.reset()
        this.render()
      }
    })

    // export
    this.root.querySelector("#btn-export-all")?.addEventListener("click", () => this.wrapExport(this.onExportAll))
    this.root.querySelector("#btn-export-zip")?.addEventListener("click", () => this.wrapExport(this.onExportZip))
    this.root.querySelectorAll<HTMLButtonElement>("[data-export-slide]").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.exportSlide!, 10)
        this.wrapExport(() => Promise.resolve(this.onExportSlide(idx)))
      })
    })
  }

  private handleFieldChange(el: HTMLElement): void {
    const fieldId = el.dataset.field!
    const section = el.closest<HTMLElement>("[data-slide-id]")
    const slideId = section?.dataset.slideId ?? ""
    const value = (el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
    this.store.setField(slideId, fieldId, value)
  }

  private async wrapExport(fn: () => Promise<void> | void): Promise<void> {
    try {
      await fn()
    } catch (e) {
      alert("Erro ao exportar: " + (e as Error).message)
    }
  }

  private exportJson(): void {
    const blob = new Blob([this.store.toJSON()], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `mybuddy-${this.store.layout.id}-config.json`
    a.click()
  }

  private importJson(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as {
          layoutId?: string
          state?: Record<string, Record<string, string>>
        }
        if (parsed.layoutId && parsed.layoutId !== this.store.layout.id) {
          if (!confirm(`Esse JSON é do layout "${parsed.layoutId}", não do atual ("${this.store.layout.id}"). Importar mesmo assim?`)) return
        }
        if (parsed.state) {
          this.store.replace(parsed.state)
          this.render()
        }
      } catch {
        alert("Arquivo JSON inválido.")
      }
    }
    reader.readAsText(file)
  }
}
