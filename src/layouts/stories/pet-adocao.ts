// Story de adoção: 1 frame com foto do pet (círculo grande), nome, raça e CTA.
// Perfeito pra ONGs divulgarem pets disponíveis pra adoção.

import type { Layout } from "../../core/types"
import { html } from "../../core/template"
import { handlePill, bgImage } from "../_shared"

export const petAdocao: Layout = {
  id: "pet-adocao",
  name: "Pet pra adoção",
  description: "1 frame: foto do pet + info de adoção. Ideal pra ONGs.",
  format: "story",
  category: "adoção",
  defaultTypography: {
    heading: { family: "DynaPuff", weight: 700 },
    body: { family: "Inter", weight: 400 },
  },

  slides: [
    {
      id: "pet",
      label: "pet",
      fields: [
        {
          id: "photo",
          type: "image",
          label: "foto do pet",
          shape: "rect",
          optional: true,
          default: "",
        },
        { id: "badge", type: "text", label: "badge (ex: disponível!)", default: "disponível para adoção 🐾" },
        { id: "name", type: "text", label: "nome do pet", default: "Bolinha" },
        { id: "breed", type: "text", label: "raça / espécie", default: "SRD · 2 anos · macho" },
        { id: "desc", type: "textarea", label: "descrição curta", default: "Dócil, brincalhão e ama crianças. Vacinado e castrado." },
        { id: "cta", type: "text", label: "CTA", default: "manda mensagem pra adotar ↑" },
      ],
      render: (s, ctx) => html`
        <div class="frame frame-pa">
          <div class="pa-safe-top" data-no-export></div>
          <div class="pa-photo-wrap ${s.photo ? "has-image" : ""}" style="${html.raw(bgImage(s.photo))}">
            ${s.photo ? "" : html.raw('<span class="pa-photo-placeholder">📷</span>')}
          </div>
          <div class="pa-card">
            <span class="pa-badge">${s.badge}</span>
            <h1 class="pa-name">${s.name}</h1>
            <p class="pa-breed">${s.breed}</p>
            <p class="pa-desc">${s.desc}</p>
            <div class="pa-footer">
              <span class="pa-cta">${s.cta}</span>
              ${html.raw(handlePill(ctx))}
            </div>
          </div>
          <div class="pa-safe-bottom" data-no-export></div>
        </div>
      `,
    },
  ],

  styles: `
    .frame-pa {
      width: 1080px; height: 1920px;
      display: flex; flex-direction: column;
      background: var(--bg);
      font-family: var(--font-body);
      position: relative;
      overflow: hidden;
    }

    .pa-safe-top  { height: 250px; flex-shrink: 0; background: transparent; }
    .pa-safe-bottom { height: 400px; flex-shrink: 0; background: transparent; }

    .pa-photo-wrap {
      flex: 1;
      background-size: cover;
      background-position: center;
      background-color: rgba(26,24,21,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .pa-photo-placeholder { font-size: 180px; opacity: 0.3; }

    .pa-card {
      padding: 60px 84px 48px;
      background: var(--bg);
      z-index: 1;
      position: relative;
    }
    .pa-badge {
      display: inline-block;
      padding: 12px 30px;
      background: var(--olive);
      color: var(--white);
      border-radius: 60px;
      font-family: var(--font-heading);
      font-size: 33px;
      font-weight: 500;
      margin-bottom: 24px;
    }
    .pa-name {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 120px;
      line-height: 1;
      color: var(--ink);
      letter-spacing: -0.02em;
      margin-bottom: 12px;
    }
    .pa-breed {
      font-family: var(--font-heading);
      font-size: 39px;
      color: var(--orange);
      margin-bottom: 24px;
    }
    .pa-desc {
      font-size: 39px;
      line-height: 1.5;
      color: var(--ink);
      opacity: 0.75;
      margin-bottom: 36px;
    }
    .pa-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 30px;
      border-top: 3px solid rgba(26,24,21,0.1);
    }
    .pa-cta {
      font-family: var(--font-heading);
      font-size: 33px;
      color: var(--ink);
      opacity: 0.7;
    }
  `,
}
