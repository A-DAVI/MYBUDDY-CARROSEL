// Layout "Pet pra adoção (post)" — versão carrossel do story de mesmo tema.
// Divulga 1 a 5 pets num único post: capa + slots de pet + CTA final.
//
// Como funciona o "flexível 1-5 pets":
//   - Os 5 slots de pet sempre aparecem na sidebar pra edição
//   - Mas o usuário pode deixar slots sem preencher (vazio = renderiza estado vazio)
//   - Pra omitir pets, basta não preencher (continuam no carrossel mas visíveis)
//   - Se quiser exportar só os preenchidos, pula manualmente os botões no exporter
//
// Estilo visual: foto domina ~60% do slide (810px de 1350), texto embaixo.

import type { Layout } from "../core/types"
import { html, richText } from "../core/template"
import { topBar, handlePill, frameLabel, bgImage } from "./_shared"

// ─── helper: monta um slide de pet ─────────────────────────────────────────
function buildPetSlide(index: number) {
  return {
    id: `pet-${index}`,
    label: `pet ${index}`,
    fields: [
      {
        id: "photo",
        type: "image" as const,
        label: `pet ${index} — foto`,
        shape: "rect" as const,
        optional: true,
        default: "",
      },
      {
        id: "name",
        type: "text" as const,
        label: `pet ${index} — nome`,
        default: "",
        optional: true,
      },
      {
        id: "age",
        type: "text" as const,
        label: `pet ${index} — idade`,
        default: "",
        optional: true,
      },
      {
        id: "size",
        type: "select" as const,
        label: `pet ${index} — porte`,
        default: "médio",
        optional: true,
        options: [
          { label: "pequeno", value: "pequeno" },
          { label: "médio", value: "médio" },
          { label: "grande", value: "grande" },
        ],
      },
      {
        id: "temperament",
        type: "text" as const,
        label: `pet ${index} — temperamento`,
        default: "",
        optional: true,
        hint: "ex: brincalhão, tímido, calmo",
      },
      {
        id: "org",
        type: "text" as const,
        label: `pet ${index} — ONG / contato`,
        default: "",
        optional: true,
      },
    ],
    render: (s: Record<string, string>, ctx: any): string => {
      const hasContent = (s.name ?? "").trim().length > 0
      // tags de info — só renderiza as preenchidas
      const tags: string[] = []
      if (s.age) tags.push(`<span class="pap-tag">${s.age}</span>`)
      if (s.size) tags.push(`<span class="pap-tag">${s.size}</span>`)
      if (s.temperament) tags.push(`<span class="pap-tag pap-tag--accent">${s.temperament}</span>`)

      return html`
        ${html.raw(frameLabel(ctx, `pet ${index}`))}
        <div class="frame frame-pap">
          ${html.raw(topBar(ctx))}

          <div class="pap-photo ${s.photo ? "has-image" : ""}" style="${html.raw(bgImage(s.photo))}">
            ${s.photo ? "" : html.raw('<span class="pap-photo-placeholder">📷<br><small>foto do pet</small></span>')}
          </div>

          <div class="pap-content">
            ${hasContent
              ? html`
                <h2 class="pap-name">${s.name}</h2>
                ${tags.length ? html.raw(`<div class="pap-tags">${tags.join("")}</div>`) : ""}
                ${s.org
                  ? html`
                    <div class="pap-org">
                      <span class="pap-org-label">contato</span>
                      <span class="pap-org-value">${s.org}</span>
                    </div>
                  `
                  : ""}
              `
              : html`<p class="pap-empty">preencha as infos do pet ${index} ao lado →</p>`
            }
          </div>

          <div class="pap-bottom">
            ${html.raw(handlePill(ctx))}
          </div>
        </div>
      `
    },
  }
}

export const petAdocaoPost: Layout = {
  id: "pet-adocao-post",
  name: "Pets pra adoção (post)",
  description: "Carrossel pra divulgar até 5 pets pra adoção. Capa + pets + CTA.",
  format: "carousel",
  category: "adoção",
  defaultTypography: {
    heading: { family: "DynaPuff", weight: 700 },
    body: { family: "Inter", weight: 400 },
  },

  slides: [
    // ─── CAPA ──────────────────────────────────────────────────────────
    {
      id: "cover",
      label: "capa",
      fields: [
        {
          id: "eyebrow",
          type: "text",
          label: "olho (em cima do título)",
          default: "pets esperando um lar",
        },
        {
          id: "headline",
          type: "richtext",
          label: "título principal (use {{palavra}} pra destaque)",
          default: "conheça quem está {{esperando}} por você",
        },
        {
          id: "subline",
          type: "textarea",
          label: "subtítulo",
          default: "arraste pra conhecer cada um deles 🐾",
          optional: true,
        },
      ],
      render: (s, ctx) => html`
        ${html.raw(frameLabel(ctx, "capa"))}
        <div class="frame frame-pap-cover">
          ${html.raw(topBar(ctx))}
          <div class="pap-cover-content">
            <p class="pap-eyebrow">${s.eyebrow}</p>
            <h1 class="pap-headline">${html.raw(richText(s.headline))}</h1>
            ${s.subline ? html`<p class="pap-subline">${s.subline}</p>` : ""}
          </div>
          <div class="pap-bottom">
            ${html.raw(handlePill(ctx))}
            <span class="pap-swipe">arraste →</span>
          </div>
        </div>
      `,
    },

    // ─── 5 SLOTS DE PET ────────────────────────────────────────────────
    buildPetSlide(1),
    buildPetSlide(2),
    buildPetSlide(3),
    buildPetSlide(4),
    buildPetSlide(5),

    // ─── CTA FINAL ─────────────────────────────────────────────────────
    {
      id: "cta",
      label: "CTA final",
      fields: [
        {
          id: "headline",
          type: "richtext",
          label: "chamada final (use {{palavra}} pra destaque)",
          default: "viu algum que te {{chamou}}?",
        },
        {
          id: "body",
          type: "textarea",
          label: "texto de apoio",
          default: "entre em contato com a ONG do pet que você gostou. cada lar muda uma vida.",
        },
        {
          id: "cta",
          type: "text",
          label: "CTA",
          default: "fale com a gente no direct",
        },
      ],
      render: (s, ctx) => html`
        ${html.raw(frameLabel(ctx, "CTA"))}
        <div class="frame frame-pap-cta">
          ${html.raw(topBar(ctx, { invertLogo: true }))}
          <div class="pap-cta-content">
            <h2 class="pap-cta-headline">${html.raw(richText(s.headline))}</h2>
            <p class="pap-cta-body">${s.body}</p>
          </div>
          <div class="pap-cta-bottom">
            <span class="pap-cta-text">${s.cta}</span>
            ${html.raw(handlePill(ctx, { variant: "light" }))}
          </div>
        </div>
      `,
    },
  ],

  styles: `
    /* ═══ BASE ═══════════════════════════════════════════════════════ */
    .frame-pap-cover, .frame-pap, .frame-pap-cta {
      width: 1080px; height: 1350px;
      background: var(--bg);
      font-family: var(--font-body);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .frame-pap-cover, .frame-pap-cta { padding: 84px; }
    .frame-pap-cover .top, .frame-pap-cta .top { display: flex; justify-content: space-between; align-items: center; }

    /* ═══ CAPA ═══════════════════════════════════════════════════════ */
    .frame-pap-cover { justify-content: space-between; }
    .pap-cover-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 30px;
    }
    .pap-eyebrow {
      font-family: var(--font-heading);
      font-weight: 500;
      color: var(--orange);
      font-size: 42px;
      letter-spacing: 0.01em;
    }
    .pap-headline {
      font-family: var(--font-heading);
      font-weight: var(--font-heading-weight, 700);
      color: var(--ink);
      font-size: 120px;
      line-height: 1.02;
      letter-spacing: -0.02em;
    }
    .pap-headline .accent { color: var(--orange); }
    .pap-subline {
      font-size: 42px;
      color: var(--ink);
      opacity: 0.7;
      line-height: 1.4;
      max-width: 80%;
    }
    .pap-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .pap-swipe {
      font-family: var(--font-heading);
      font-size: 33px;
      color: var(--ink);
      opacity: 0.5;
    }

    /* ═══ PET SLIDE ══════════════════════════════════════════════════ */
    .frame-pap { padding: 0; }
    .frame-pap .top {
      position: absolute;
      top: 60px; left: 60px; right: 60px;
      display: flex; justify-content: space-between; align-items: center;
      z-index: 10;
    }

    /* foto domina ~60% do slide (810px de 1350) */
    .pap-photo {
      width: 100%;
      height: 810px;
      background-color: var(--olive);
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .pap-photo-placeholder {
      font-size: 120px;
      color: var(--bg);
      opacity: 0.5;
      text-align: center;
      line-height: 1.2;
    }
    .pap-photo-placeholder small {
      display: block;
      font-size: 33px;
      margin-top: 18px;
      font-family: var(--font-body);
      opacity: 0.85;
    }

    .pap-content {
      flex: 1;
      padding: 54px 84px 36px;
      display: flex;
      flex-direction: column;
      gap: 27px;
    }
    .pap-name {
      font-family: var(--font-heading);
      font-weight: var(--font-heading-weight, 700);
      font-size: 108px;
      color: var(--ink);
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .pap-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }
    .pap-tag {
      background: rgba(26,24,21,0.08);
      color: var(--ink);
      font-family: var(--font-heading);
      font-weight: 500;
      font-size: 33px;
      padding: 12px 27px;
      border-radius: 60px;
    }
    .pap-tag--accent {
      background: var(--orange);
      color: var(--white);
    }
    .pap-org {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .pap-org-label {
      font-size: 27px;
      color: var(--ink);
      opacity: 0.5;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .pap-org-value {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 45px;
      color: var(--olive);
    }
    .pap-empty {
      font-family: var(--font-heading);
      font-size: 39px;
      color: var(--ink);
      opacity: 0.35;
      font-style: italic;
    }

    .frame-pap .pap-bottom {
      padding: 0 84px 48px;
    }

    /* ═══ CTA FINAL ══════════════════════════════════════════════════ */
    .frame-pap-cta {
      background: var(--olive);
      justify-content: space-between;
    }
    .frame-pap-cta::before {
      content: '';
      position: absolute;
      top: -180px; right: -180px;
      width: 540px; height: 540px;
      background: var(--orange);
      border-radius: 50%;
      opacity: 0.95;
    }
    .frame-pap-cta::after {
      content: '';
      position: absolute;
      bottom: -150px; left: -150px;
      width: 420px; height: 420px;
      background: var(--bg);
      border-radius: 50%;
      opacity: 0.1;
    }
    .frame-pap-cta > * { position: relative; z-index: 1; }
    .pap-cta-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 36px;
    }
    .pap-cta-headline {
      font-family: var(--font-heading);
      font-weight: var(--font-heading-weight, 700);
      color: var(--bg);
      font-size: 108px;
      line-height: 1.02;
      letter-spacing: -0.02em;
    }
    .pap-cta-headline .accent { color: var(--orange); }
    .pap-cta-body {
      font-size: 42px;
      color: var(--bg);
      opacity: 0.9;
      line-height: 1.4;
      max-width: 88%;
    }
    .pap-cta-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 36px;
      border-top: 3px solid rgba(218,218,184,0.25);
    }
    .pap-cta-text {
      font-family: var(--font-heading);
      font-weight: 500;
      font-size: 39px;
      color: var(--bg);
    }
  `,
}
