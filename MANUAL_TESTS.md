# Testes Manuais — MyBuddy Editor

Execute `npm run dev` e siga os testes abaixo. Marque ✅ / ❌.

---

## Galeria

- [ ] Galeria carrega com aba **Carrossel** ativa por padrão
- [ ] Aba **Carrossel** mostra 4 layouts (Problema→Solução, Apresentação, Team Buddy, Dado em destaque)
- [ ] Aba **Stories** mostra 4 layouts (Story rápido, Pet pra adoção, Você sabia?, Bastidores)
- [ ] Thumbnails de carousel têm proporção ~4:5; thumbnails de story têm proporção ~9:16
- [ ] Cada card mostra badge de formato ("carrossel 4:5" ou "story 9:16")
- [ ] Clicar num card navega pro editor daquele layout
- [ ] Navegação pelo teclado (Enter/Space no card) funciona

---

## Editor — geral

- [ ] Sidebar abre com seções na ordem: sessão → tipografia → paleta → handle → slides → exportar
- [ ] Editar qualquer campo de texto atualiza o preview em tempo real
- [ ] Estado persiste ao recarregar a página (mesmo layout, mesmos valores)
- [ ] "↩ resetar layout" limpa todos os campos pro padrão
- [ ] Exportar config JSON baixa um arquivo `.json` válido
- [ ] Importar config JSON restaura os campos
- [ ] Botão "← galeria" volta pra tela inicial
- [ ] Atalho **Ctrl+E** dispara exportação de todos os frames

---

## Editor — tipografia

- [ ] Seção "🔤 Tipografia" aparece **acima** da seção de paleta
- [ ] Dropdown de família mostra as 12 fontes curadas: DynaPuff, Fredoka, Baloo 2, Quicksand, Inter, Plus Jakarta Sans, Manrope, Outfit, Fraunces, Playfair Display, JetBrains Mono, Space Mono
- [ ] Mudar fonte Heading atualiza preview (títulos mudam de fonte)
- [ ] Mudar fonte Body atualiza preview (textos de apoio mudam de fonte)
- [ ] "carregar prévia das fontes" dispara preload (sem erro no console)
- [ ] "+ fonte custom" mostra formulário inline
- [ ] Adicionar "Pacifico" (fonte real): aparece nos dropdowns e aplica no preview
- [ ] Adicionar "FonteQueNaoExiste": mostra alerta de erro
- [ ] "restaurar padrão" volta pra DynaPuff/Inter
- [ ] Tipografia persiste entre reloads
- [ ] Mudar tipografia num layout não afeta outro layout

---

## Editor — paleta

- [ ] Mudar cor de "laranja" atualiza todos os elementos com var(--orange) nos slides
- [ ] "restaurar paleta padrão" volta pras cores MyBuddy originais
- [ ] Paleta persiste entre reloads

---

## Editor — imagens

- [ ] Upload via clique na drop-zone funciona
- [ ] Upload via drag & drop funciona
- [ ] Imagem menor que 800×800 dispara alerta de aviso
- [ ] "remover imagem" limpa o field

---

## Editor — carousel (1080×1350)

- [ ] Preview mostra slides em escala (internamente 1080×1350)
- [ ] Export individual: PNG em 1080×1350 (verificar com Preview do macOS)
- [ ] Export "baixar todos": um PNG por slide
- [ ] Export ZIP: arquivo .zip com todos os PNGs
- [ ] Frame label ("01 · problema") aparece no editor mas NÃO no PNG exportado

---

## Editor — story (1080×1920)

- [ ] Editor de story mostra botão "🛡 safe zone" no header
- [ ] Safe zones estão **ligadas por padrão** ao entrar num layout de story
- [ ] Overlay listrado laranja cobre ~250px no topo e ~400px na base
- [ ] Clicar em "🛡 safe zone" oculta o overlay; clicar de novo mostra
- [ ] Export individual: PNG em 1080×1920
- [ ] Safe zone overlay NÃO aparece no PNG exportado
- [ ] Export ZIP funciona com stories multi-frame

---

## Layouts de Story — visual

### Story rápido (1 frame)
- [ ] Eyebrow, headline e CTA editáveis e visíveis no preview
- [ ] {{palavra}} no headline vira span laranja

### Pet pra adoção (1 frame)
- [ ] Foto ocupa área de foto corretamente; sem foto mostra placeholder 📷
- [ ] Badge, nome, raça e descrição editáveis

### Você sabia? (2 frames)
- [ ] Frame 1: fundo verde escuro, texto claro
- [ ] Frame 2: número gigante vermelho, fundo sage
- [ ] Ambos exportam corretamente separados

### Bastidores (3 frames)
- [ ] Frame 1: foto fullscreen com overlay gradiente
- [ ] Frame 2: fundo sage, texto da história
- [ ] Frame 3: fundo oliva, headline grande + CTA

---

## Build

- [ ] `npm run build` completa sem erros
- [ ] `dist/index.html` abrível direto no browser sem servidor
