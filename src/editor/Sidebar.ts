// Sidebar dinâmica: gera todos os inputs a partir do Layout ativo.
// Cobre grupos: sessão, paleta global, handle, tipografia e fields de cada slide.

import type { Layout } from "../core/types"
import type { LayoutStore } from "../core/state"
import type { TypographyStore } from "../core/typography"
import { colors, DEFAULT_COLORS } from "../core/colors"
import { handle } from "../core/handle"
import { CURATED_FONTS, customFonts, preloadCuratedFonts } from "../core/typography"
import { loadGoogleFont, validateGoogleFont } from "../core/fontLoader"
import { renderField, bindImageFields } from "./fields"
import { renderColorField } from "./fields/ColorField"
import { esc } from "../core/template"

function inputIdFor(slideId: string, fieldId: string): string {
  return `f-${slideId}-${fieldId}`
}

export class Sidebar {
  constructor(
    private root: HTMLElement,
    private store: LayoutStore,
    private typo: TypographyStore,
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
        <h3>🔤 tipografia</h3>
        ${this.renderTypographyPanel()}
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
          <button class="export-btn" id="btn-export-all">📥 baixar todos</button>
          <button class="export-btn" id="btn-export-zip">🗜 baixar ZIP (${layout.slides.length} ${layout.slides.length === 1 ? "frame" : "frames"})</button>
          ${layout.slides.map((s, i) => `
            <button class="export-btn secondary small" data-export-slide="${i}">
              ${i + 1}. ${esc(s.label)}
            </button>
          `).join("")}
        </div>
        <p class="info-box">💡 PNGs prontos pro Instagram.<br>Use <strong>Ctrl+E</strong> pra exportar todos.</p>
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

  private renderTypographyPanel(): string {
    const t = this.typo.get()
    const allFamilies = [
      ...CURATED_FONTS.map(f => f.family),
      ...customFonts.get(),
    ]
    const weightOptions = [400, 500, 600, 700]
      .map(w => `<option value="${w}" ${w === t.heading.weight ? "selected" : ""}>${w}</option>`)
      .join("")
    const bodyWeightOptions = [400, 500, 600, 700]
      .map(w => `<option value="${w}" ${w === t.body.weight ? "selected" : ""}>${w}</option>`)
      .join("")
    const familyOpts = (current: string) => allFamilies
      .map(f => `<option value="${esc(f)}" ${f === current ? "selected" : ""}>${esc(f)}</option>`)
      .join("")

    return `
      <div class="field">
        <label>heading (títulos)</label>
        <div class="font-row">
          <select class="font-family-select" data-typo-role="heading-family">
            ${familyOpts(t.heading.family)}
          </select>
          <select class="font-weight-select" data-typo-role="heading-weight">
            ${weightOptions}
          </select>
        </div>
      </div>
      <div class="field">
        <label>body (texto corrido)</label>
        <div class="font-row">
          <select class="font-family-select" data-typo-role="body-family">
            ${familyOpts(t.body.family)}
          </select>
          <select class="font-weight-select" data-typo-role="body-weight">
            ${bodyWeightOptions}
          </select>
        </div>
      </div>
      <div class="font-actions">
        <button class="link-btn" id="btn-load-fonts">carregar prévia das fontes</button>
        <button class="link-btn" id="btn-add-custom-font">+ fonte custom</button>
        <button class="link-btn" id="btn-reset-typo">restaurar padrão</button>
      </div>
      <div class="custom-font-form" id="custom-font-form" hidden>
        <input type="text" id="custom-font-input" placeholder="ex: Pacifico">
        <button class="export-btn secondary small" id="btn-confirm-custom-font">adicionar</button>
        <p class="field-hint">nome exato do Google Fonts</p>
      </div>
    `
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

    return `
      <div class="editor-section" data-slide-id="${esc(slide.id)}">
        <h3><span class="num">${index + 1}</span> ${esc(slide.label)}</h3>
        ${fields}
      </div>
    `
  }

  // ===== LISTENERS =====

  private attachListeners(): void {
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

    // tipografia
    this.root.querySelectorAll<HTMLSelectElement>("[data-typo-role]").forEach(sel => {
      sel.addEventListener("change", () => this.handleTypoChange(sel))
    })
    this.root.querySelector("#btn-load-fonts")?.addEventListener("click", async () => {
      await preloadCuratedFonts()
      // reload current custom fonts too
      for (const f of customFonts.get()) await loadGoogleFont(f, [400, 700])
    })
    this.root.querySelector("#btn-add-custom-font")?.addEventListener("click", () => {
      const form = this.root.querySelector<HTMLElement>("#custom-font-form")
      if (form) form.hidden = !form.hidden
    })
    this.root.querySelector("#btn-confirm-custom-font")?.addEventListener("click", async () => {
      const input = this.root.querySelector<HTMLInputElement>("#custom-font-input")
      const family = input?.value.trim()
      if (!family) return
      const valid = await validateGoogleFont(family)
      if (!valid) {
        alert(`Fonte "${family}" não encontrada no Google Fonts. Confira o nome exato.`)
        return
      }
      customFonts.add(family)
      this.render()
    })
    this.root.querySelector("#btn-reset-typo")?.addEventListener("click", () => {
      this.typo.reset(this.store.layout.defaultTypography)
    })

    // fields dos slides
    this.root.querySelectorAll<HTMLElement>("[data-slide-id] [data-field]").forEach(el => {
      if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "color") return
      if (el.tagName === "INPUT" && (el as HTMLInputElement).type === "file") return
      el.addEventListener("input", () => this.handleFieldChange(el))
      el.addEventListener("change", () => this.handleFieldChange(el))
    })

    // image fields
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

  private handleTypoChange(sel: HTMLSelectElement): void {
    const role = sel.dataset.typoRole!
    const val = sel.value
    if (role === "heading-family") {
      loadGoogleFont(val, [400, 500, 600, 700]).catch(() => {})
      this.typo.setHeading({ family: val })
    } else if (role === "heading-weight") {
      this.typo.setHeading({ weight: parseInt(val, 10) as 400 | 500 | 600 | 700 })
    } else if (role === "body-family") {
      loadGoogleFont(val, [400, 500, 600, 700]).catch(() => {})
      this.typo.setBody({ family: val })
    } else if (role === "body-weight") {
      this.typo.setBody({ weight: parseInt(val, 10) as 400 | 500 | 600 | 700 })
    }
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
