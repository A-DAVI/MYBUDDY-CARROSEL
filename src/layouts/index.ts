// Registro dos layouts disponíveis.
//
// PRA ADICIONAR UM NOVO LAYOUT:
//   1. crie src/layouts/nome-do-layout.ts exportando uma constante do tipo Layout
//   2. importe aqui
//   3. adicione no array `layouts`
// Pronto. A galeria, sidebar e exporter funcionam automaticamente.

import type { Layout } from "../core/types"
import { problemaSolucao } from "./problema-solucao"
import { apresentacao } from "./apresentacao"
import { teamBuddy } from "./team-buddy"
import { dadoDestaque } from "./dado-destaque"
import { petAdocaoPost } from "./pet-adocao-post"
import { storyRapido } from "./stories/story-rapido"
import { petAdocao } from "./stories/pet-adocao"
import { voceSabia } from "./stories/voce-sabia"
import { bastidores } from "./stories/bastidores"

export const layouts: Layout[] = [
  // carrosséis
  problemaSolucao,
  apresentacao,
  teamBuddy,
  dadoDestaque,
  petAdocaoPost,
  // stories
  storyRapido,
  petAdocao,
  voceSabia,
  bastidores,
]

export function findLayout(id: string): Layout | undefined {
  return layouts.find(l => l.id === id)
}
