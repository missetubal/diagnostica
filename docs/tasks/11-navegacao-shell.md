# 11 — Landing, navegação e shell do app

**Fase:** 1/2 do roadmap técnico (estrutura) · **Prioridade:** P0 · **Depende de:** nada
(pode andar em paralelo com 01)

## Contexto

Estrutura visual comum a todas as telas do protótipo.

**Landing (`/`, antes do onboarding)** — nome "Diagnostica" + ícone, subtítulo, botão "Começar a
praticar" + "Sem cadastro. Comece em segundos.", três destaques em grade (Diagnóstico progressivo /
Desafio diário / Casos por IA), disclaimer educacional fixo no rodapé.

**Navegação inferior (persistente após onboarding)** — 5 abas: Início, Praticar, Diário, Progresso,
Perfil (ícones + rótulo, aba ativa destacada em verde-petróleo). "Perfil" reabre o onboarding em modo de
edição (ver tarefa 02).

**Disclaimer educacional** — aparece em landing, `/play` e tela de resultado: "Plataforma de finalidade
exclusivamente educacional. Casos simulados — não substitui supervisão profissional, protocolos ou
avaliação individualizada de pacientes." Consistente com a seção 23 de `docs/sugestao-arquitetura.md`
(LGPD/aviso obrigatório).

## Escopo

- Layout raiz (`app/layout.tsx`) com a navegação inferior fixa, escondida na landing/onboarding e visível
  nas 5 telas principais.
- Componente de disclaimer reutilizável, usado nos pontos indicados.
- Roteamento: `/` (landing se sem perfil, dashboard se já onboardado), `/onboarding`, `/play`, `/daily`,
  `/progress`, e a aba Perfil linkando para `/onboarding?edit=1`.
- Tema visual base (cor de destaque verde-petróleo `#0d9488`, já presente no `theme-color` do protótipo)
  e tipografia — definir tokens Tailwind compartilhados.
- Meta tags básicas (title, description, og:*) como no protótipo.

## Fora de escopo

- Qualquer lógica de dados — esta tarefa é só casca/navegação; cada aba busca seus dados conforme as
  tarefas 02, 04, 08 e 09.

## Critérios de aceite

- [ ] Usuário sem perfil sempre cai na landing; usuário com perfil cai direto no dashboard.
- [ ] Navegação inferior funciona e reflete a rota ativa nas 5 telas.
- [ ] Disclaimer aparece nos três pontos observados no protótipo.
- [ ] Layout responsivo mobile-first, testado em pelo menos uma largura de tela pequena (~360px).
