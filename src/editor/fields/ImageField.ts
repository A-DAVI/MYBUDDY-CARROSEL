// Drop-zone com upload + drag&drop. Salva como base64 dentro do field.

import type { Field } from "../../core/types"
import { esc } from "../../core/template"

export function renderImageField(
  field: Field,
  value: string,
  inputId: string,
): string {
  const filled = !!value
  return `
    <div class="field field--image">
      <label>${esc(field.label)}</label>
      <div class="drop-zone ${filled ? "filled" : ""}" data-image-zone>
        <input type="file" id="${inputId}" data-field="${esc(field.id)}" accept="image/*" class="file-input">
        <span class="drop-hint">${filled ? "✓ imagem carregada — clique pra trocar" : "arraste ou clique para escolher"}</span>
      </div>
      <button type="button" class="remove-img-btn" data-remove-image data-for-field="${esc(field.id)}" ${filled ? "" : "hidden"}>remover imagem</button>
      ${field.optional ? `<p class="field-hint">(opcional)</p>` : ""}
    </div>
  `
}

type ImageCallback = (slideId: string, fieldId: string, dataUrl: string) => void
type RemoveCallback = (slideId: string, fieldId: string) => void

/**
 * Anexa handlers de drag/drop/click em todas as drop-zones do container.
 * A seção pai deve ter o atributo data-slide-id para que o slideId seja lido.
 */
export function bindImageFields(
  root: HTMLElement,
  onUpload: ImageCallback,
  onRemove: RemoveCallback,
): void {
  root.querySelectorAll<HTMLElement>("[data-image-zone]").forEach(zone => {
    const fileInput = zone.querySelector<HTMLInputElement>(".file-input")
    if (!fileInput) return

    const section = zone.closest<HTMLElement>("[data-slide-id]")
    const slideId = section?.dataset.slideId ?? ""
    const fieldId = fileInput.dataset.field ?? ""

    fileInput.addEventListener("change", e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) readFile(file, dataUrl => onUpload(slideId, fieldId, dataUrl))
    })

    zone.addEventListener("dragover", e => {
      e.preventDefault()
      zone.classList.add("drag-over")
    })
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"))
    zone.addEventListener("drop", e => {
      e.preventDefault()
      zone.classList.remove("drag-over")
      const file = e.dataTransfer?.files[0]
      if (file && file.type.startsWith("image/")) {
        readFile(file, dataUrl => onUpload(slideId, fieldId, dataUrl))
      }
    })
  })

  root.querySelectorAll<HTMLButtonElement>("[data-remove-image]").forEach(btn => {
    const section = btn.closest<HTMLElement>("[data-slide-id]")
    const slideId = section?.dataset.slideId ?? ""
    const fieldId = btn.dataset.forField ?? ""
    btn.addEventListener("click", () => onRemove(slideId, fieldId))
  })
}

function readFile(file: File, cb: (dataUrl: string) => void): void {
  const url = URL.createObjectURL(file)
  const img = new Image()
  img.onload = () => {
    if (img.width < 800 || img.height < 800) {
      alert(
        `⚠️ imagem pequena (${img.width}×${img.height}px). pode borrar no export. ideal: > 800px.`,
      )
    }
    URL.revokeObjectURL(url)
  }
  img.src = url

  const reader = new FileReader()
  reader.onload = ev => cb(ev.target?.result as string)
  reader.readAsDataURL(file)
}
