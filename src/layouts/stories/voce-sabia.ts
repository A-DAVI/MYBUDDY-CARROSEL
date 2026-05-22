// Story "Você sabia?": 2 frames — pergunta + resposta/dado.
// Formato de swipe dentro do story pra manter o engajamento.

import type { Layout } from "../../core/types"
import { html, richText } from "../../core/template"
import { handlePill } from "../_shared"

export const voceSabia: Layout = {
  id: "voce-sabia",
  name: "Você sabia?",
  description: "2 frames: pergunta que prende + resposta com dado de impacto.",
  format: "story",
  category: "educativo",
  defaultTypography: {
    heading: { family: "DynaPuff", weight: 700 },
    body: { family: "Inter", weight: 400 },
  },

  slides: [
    {
      id: "pergunta",
      label: "pergunta",
      fields: [
        { id: "hook", type: "text", label: "texto âncora", default: "você sabia?" },
        {
          id: "question",
          type: "richtext",
          label: "pergunta (use {{palavra}} pra destaque)",
          default: "{{30 milhões}} de pets vivem nas ruas do Brasil?",
        },
        { id: "hint", type: "text", label: "convite pro próximo frame", default: "segura pra ver o dado →" },
      ],
      render: (s, ctx) => html`
        <div class="frame frame-vs frame-vs--question">
          <div class="vs-safe-top" data-no-export></div>
          <div class="vs-center">
            <p class="vs-hook">${s.hook}</p>
            <h1 class="vs-question">${html.raw(richText(s.question))}</h1>
          </div>
          <div class="vs-bottom">
            <span class="vs-hint">${s.hint}</span>
            ${html.raw(handlePill(ctx, { variant: "light" }))}
          </div>
          <div class="vs-safe-bottom" data-no-export></div>
        </div>
      `,
    },

    {
      id: "resposta",
      label: "resposta",
      fields: [
        { id: "number", type: "text", label: "número de destaque", default: "30M" },
        {
          id: "answer",
          type: "richtext",
          label: "resposta (use {{palavra}})",
          default: "pets vivem em situação de {{abandono}} no Brasil.",
        },
        { id: "source", type: "text", label: "fonte", default: "IBGE · WSPA, 2023" },
        { id: "cta", type: "text", label: "CTA", default: "siga e faça parte da mudança ↑" },
      ],
      render: (s, ctx) => html`
        <div class="frame frame-vs frame-vs--answer">
          <div class="vs-safe-top" data-no-export></div>
          <div class="vs-center">
            <div class="vs-number">${s.number}</div>
            <p class="vs-answer">${html.raw(richText(s.answer))}</p>
            <p class="vs-source">${s.source}</p>
          </div>
          <div class="vs-bottom vs-bottom--light">
            <span class="vs-cta">${s.cta}</span>
            ${html.raw(handlePill(ctx))}
          </div>
          <div class="vs-safe-bottom" data-no-export></div>
        </div>
      `,
    },
  ],

  styles: `
    .frame-vs {
      width: 1080px; height: 1920px;
      display: flex; flex-direction: column;
      font-family: var(--font-body);
      position: relative;
      overflow: hidden;
    }
    .frame-vs--question { background: var(--olive); color: var(--bg); }
    .frame-vs--answer   { background: var(--bg); color: var(--ink); }

    .frame-vs--question::before {
      content: '';
      position: absolute;
      top: -300px; right: -200px;
      width: 700px; height: 700px;
      background: var(--orange);
      border-radius: 50%;
      opacity: 0.25;
    }
    .frame-vs--answer::before {
      content: '';
      position: absolute;
      bottom: -300px; left: -200px;
      width: 700px; height: 700px;
      background: var(--olive);
      border-radius: 50%;
      opacity: 0.12;
    }

    .vs-safe-top    { height: 250px; flex-shrink: 0; }
    .vs-safe-bottom { height: 400px; flex-shrink: 0; }

    .vs-center {
      flex: 1;
      display: flex; flex-direction: column;
      justify-content: center;
      padding: 84px;
      z-index: 1;
    }
    .vs-hook {
      font-family: var(--font-heading);
      font-size: 48px;
      color: var(--orange);
      margin-bottom: 36px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .vs-question {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 108px;
      line-height: 1.1;
      color: var(--bg);
      letter-spacing: -0.02em;
    }
    .vs-question .accent { color: var(--orange); }

    .vs-number {
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 300px;
      line-height: 0.9;
      color: var(--red);
      letter-spacing: -0.04em;
      margin-bottom: 36px;
    }
    .vs-answer {
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 84px;
      line-height: 1.2;
      color: var(--ink);
      margin-bottom: 30px;
    }
    .vs-answer .accent { color: var(--orange); }
    .vs-source {
      font-size: 33px;
      color: var(--ink);
      opacity: 0.5;
      font-style: italic;
    }

    .vs-bottom {
      padding: 48px 84px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 1;
      border-top: 3px solid rgba(218,218,184,0.2);
    }
    .vs-bottom--light {
      border-top: 3px solid rgba(26,24,21,0.1);
    }
    .vs-hint {
      font-family: var(--font-heading);
      font-size: 36px;
      color: var(--bg);
      opacity: 0.8;
    }
    .vs-cta {
      font-family: var(--font-heading);
      font-size: 33px;
      color: var(--ink);
      opacity: 0.7;
    }
  `,
}
