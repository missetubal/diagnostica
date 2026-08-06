# 02 — Perfil anônimo e onboarding

**Fase:** 2 do roadmap técnico · **Prioridade:** P0 · **Depende de:** 01

## Contexto

O protótipo (`case-clinic-flow.base44.app`) já mostra o wizard de 4 passos que este produto precisa
implementar de verdade, ligado a um perfil anônimo por `device_id` (sem cadastro). A tela "Perfil" do
protótipo reabre o mesmo wizard em modo de edição (`/onboarding?edit=1`) — replicar esse comportamento.

## Escopo

**Perfil anônimo**

- Gerar um `device_id` no cliente (ex.: UUID em cookie httpOnly ou localStorage) na primeira visita.
- `POST /api/profile`: cria o `User` (perfil anônimo) se ainda não existir para aquele `device_id`.
- `GET /api/profile/me`: retorna o perfil atual (ou 404 se ainda não passou pelo onboarding).

**Onboarding — 4 passos, com barra de progresso (`1/4` … `4/4`) e botão voltar:**

1. **Você é…** — Estudante ou Profissional (`user_type`).
2. **Sua profissão** — Medicina ou Fisioterapia, com nota "Mais profissões em breve: enfermagem,
   farmácia, nutrição." (`profession_id`).
3. **Áreas de interesse** — chips multi-seleção, filtrados pelas áreas da profissão escolhida
   (`user_areas`).
4. **Nível de dificuldade** — Fácil / Médio / Difícil, cada um com a descrição curta vista no protótipo
   (ex. "Condições comuns, apresentação típica, poucos diferenciais.") (`user_preferences.difficulty`).

- Botão final "Começar" (`Continuar` nos passos 1–3) grava tudo via `PATCH /api/users/me` +
  `PATCH /api/users/me/preferences` e redireciona ao dashboard.
- Reabrir o mesmo wizard em `/onboarding?edit=1` a partir da aba "Perfil", pré-preenchido com os valores
  atuais.

## Fora de escopo

- Cadastro/login real de usuário (Fase 2/pós-MVP, ver seção 9 do roadmap).
- Nível de experiência mais granular (residente/professor) — schema já suporta via `UserType`, mas o
  protótipo só expõe Estudante/Profissional; decidir se expande nesta tarefa ou depois.

## Critérios de aceite

- [ ] Primeira visita sem `device_id` é redirecionada para `/onboarding`.
- [ ] Completar o wizard cria o `User` + `UserPreferences` + `UserArea[]` corretos no banco.
- [ ] Revisitar o app depois não repete o onboarding (perfil já existe).
- [ ] `/onboarding?edit=1` carrega os valores salvos e permite alterá-los.
- [ ] Funciona em mobile (o protótipo é mobile-first, nav inferior fixa).
