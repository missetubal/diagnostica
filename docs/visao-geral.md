# Diagnostica

Plataforma de treinamento clínico baseada em casos interativos, inspirada em jogos de diagnóstico como o Doctordle.

O usuário informa sua profissão ou formação, escolhe uma área de estudo e recebe um caso clínico personalizado para praticar raciocínio clínico e diagnóstico em um ambiente seguro e educacional.

> **Nome provisório:** Diagnostica

---

## 1. Visão do produto

O **Diagnostica** é uma plataforma para estudantes e profissionais de saúde praticarem raciocínio clínico por meio de casos interativos, personalizados por:

- Profissão ou área de formação.
- Área de estudo.
- Nível de dificuldade.
- Histórico de desempenho.

A plataforma deve tornar o estudo mais envolvente por meio de:

- Casos clínicos interativos.
- Informações liberadas progressivamente.
- Tentativas de diagnóstico.
- Feedback imediato.
- Explicações didáticas.
- Pontuação e progressão.
- Desafios diários.
- Prática rápida e recorrente.

---

## 2. Problema

Estudantes e profissionais de saúde precisam praticar raciocínio clínico, mas frequentemente enfrentam:

- Poucas oportunidades de praticar em ambientes seguros.
- Dificuldade para encontrar casos adequados ao seu nível.
- Conteúdos excessivamente teóricos.
- Falta de feedback imediato.
- Plataformas focadas em apenas uma profissão ou especialidade.
- Dificuldade para manter uma rotina de estudos.

O Diagnostica busca resolver esse problema oferecendo uma experiência prática, personalizada, acessível e gamificada.

---

## 3. Público-alvo

### Foco inicial (MVP)

- Estudantes de medicina.
- Residentes.
- Médicos generalistas e especialistas.
- Estudantes de fisioterapia.
- Fisioterapeutas.

> Medicina e fisioterapia foram escolhidas como profissões de lançamento por serem as áreas em que há maior contato direto com profissionais para validação e revisão clínica dos casos.

### Fase 2 (ativa)

- Estudantes de enfermagem.
- Enfermeiros.
- Técnicos de enfermagem.
- Estudantes de psicologia.
- Psicólogos clínicos.

> Enfermagem e psicologia foram adicionadas após o MVP inicial (2026-08). Os casos dessas profissões seguem o mesmo fluxo de rascunho → revisão → publicação, mas ainda dependem de validação por profissionais das respectivas áreas antes de irem a público.

### Expansão futura

- Farmacêuticos.
- Nutricionistas.
- Outros profissionais e estudantes da área da saúde.

### Personas iniciais

#### Estudante de medicina

- Estuda para provas, internato ou residência.
- Precisa praticar raciocínio diagnóstico.
- Prefere sessões curtas e objetivas.
- Pode acessar pelo celular ou computador.

#### Residente

- Deseja revisar casos relacionados à sua especialidade.
- Busca situações próximas da prática clínica.
- Tem pouco tempo disponível para estudar.

#### Estudante ou profissional de enfermagem

- Deseja praticar avaliação clínica.
- Quer reconhecer sinais de alerta e situações de risco.
- Pode estudar classificação de risco e cuidados de enfermagem.

#### Fisioterapeuta

- Deseja praticar avaliação funcional.
- Pode estudar casos musculoesqueléticos, cardiorrespiratórios ou neurológicos.

#### Estudante ou profissional de psicologia

- Deseja praticar avaliação e entrevista clínica.
- Quer treinar formulação de hipóteses diagnósticas psicológicas (DSM-5-TR/CID-11).
- Pode estudar psicologia clínica, hospitalar ou infantojuvenil.

#### Farmacêutico clínico

- Deseja praticar farmacoterapia.
- Pode estudar interações medicamentosas, segurança e acompanhamento farmacêutico.

#### Professor ou preceptor

- Pode utilizar os casos em aulas e treinamentos.
- Futuramente poderá criar turmas e acompanhar o desempenho dos alunos.

---

## 4. Proposta de valor

> Pratique raciocínio clínico com casos interativos personalizados para sua profissão, área de estudo e nível de conhecimento.

### Diferenciais

- Personalização por profissão.
- Personalização por área de estudo.
- Casos interativos e progressivos.
- Experiência semelhante a um jogo.
- Feedback explicativo.
- Atendimento a diferentes profissões da saúde.
- Casos sob demanda.
- Desafio diário com compartilhamento de resultado, já no MVP.
- Acompanhamento da evolução do usuário.

---

## 5. Referência de experiência

A experiência pode ser inspirada em plataformas como o [Doctordle](https://doctordle.org/), adaptando a mecânica de jogos de adivinhação para casos clínicos.

### Diferenças em relação ao Doctordle

- O usuário escolhe sua profissão ou formação.
- O usuário seleciona a área que deseja estudar.
- O sistema adapta a complexidade ao nível do usuário.
- Os casos podem ser gerados ou selecionados sob demanda.
- A plataforma pode atender diferentes profissões.
- O sistema pode oferecer diferentes modos de treinamento.
- O feedback pode incluir explicações e diagnósticos diferenciais.

---

## 6. Fluxo principal do usuário

1. O usuário acessa a plataforma.
2. Informa se é estudante ou profissional.
3. Seleciona sua profissão ou formação.
4. Escolhe uma ou mais áreas de interesse.
5. Seleciona o nível de dificuldade.
6. Inicia um novo caso clínico.
7. Recebe a primeira informação do caso.
8. Envia uma hipótese diagnóstica.
9. Recebe feedback.
10. Desbloqueia novas informações.
11. Tenta novamente ou confirma a resposta.
12. Visualiza o diagnóstico esperado.
13. Consulta a explicação e os principais aprendizados.
14. Recebe sua pontuação.
15. Pode acompanhar seu histórico e sua evolução.

---

## 7. Mecânica principal: Diagnóstico Progressivo

O modo principal do MVP será baseado em informações reveladas progressivamente.

### Funcionamento

- O caso clínico é dividido em etapas.
- A primeira etapa apresenta a queixa principal.
- A cada rodada, novas informações são disponibilizadas.
- O usuário informa uma hipótese diagnóstica após cada rodada.
- Quanto menos pistas forem necessárias, maior será a pontuação.
- Ao final, o sistema apresenta a resposta esperada e uma explicação completa.

### Exemplo de progressão

1. Queixa principal.
2. História da doença atual.
3. Antecedentes e fatores de risco.
4. Sinais vitais e exame físico.
5. Exames complementares.
6. Evolução do caso ou informação decisiva.

### Tipos de feedback

O feedback deve ser educacional e não apenas indicar se a resposta está certa ou errada.

Possíveis respostas:

- Diagnóstico correto.
- Diagnóstico parcialmente correto.
- Grupo diagnóstico correto, mas com especificidade insuficiente.
- Especialidade relacionada, mas hipótese inadequada.
- Diagnóstico incorreto.
- Dica clínica.
- Elemento que favorece ou enfraquece a hipótese.
- Diagnósticos diferenciais possíveis.

---

## 8. Modos de jogo planejados

### 8.1 Diagnóstico Progressivo

Modo principal do MVP.

- Caso dividido em rodadas.
- Informações liberadas gradualmente.
- Tentativas de diagnóstico.
- Pontuação baseada no número de pistas utilizadas.
- Feedback ao final.

### 8.2 Caso Completo

O usuário recebe todas as informações de uma vez e responde a uma pergunta principal.

Exemplos de perguntas:

- Qual é o diagnóstico mais provável?
- Qual exame deve ser solicitado?
- Qual é a prioridade inicial?
- Qual hipótese deve ser considerada?
- Qual fator de risco é mais relevante?

### 8.3 Caso Ramificado

O caso evolui de acordo com as decisões do usuário.

Exemplo:

1. O paciente apresenta determinado sintoma.
2. O usuário escolhe quais informações ou exames solicitar.
3. O sistema apresenta novos dados.
4. As decisões influenciam a evolução da simulação.

### 8.4 Desafio Contra o Tempo

O usuário resolve vários casos curtos em sequência.

Pode ser utilizado para:

- Revisão rápida.
- Preparação para provas.
- Treino de reconhecimento de padrões.
- Simulação de situações de pressão.

### 8.5 Desafio Diário

Um caso diário pode ser disponibilizado para todos os usuários.

Características possíveis:

- Mesmo caso para todos no mesmo dia.
- Número limitado de tentativas.
- Pontuação baseada na quantidade de pistas.
- Compartilhamento do resultado sem revelar a resposta.
- Histórico de sequência de dias.

### 8.6 Modo para professores

Funcionalidades futuras:

- Criar turmas.
- Selecionar áreas e níveis.
- Atribuir casos.
- Acompanhar o desempenho dos alunos.
- Identificar temas com maior dificuldade.
- Promover discussões em sala.

---

## 9. Personalização

### 9.1 Perfil profissional

O usuário poderá informar:

- Tipo de usuário: estudante ou profissional.
- Profissão.
- Semestre, ano ou nível de formação.
- Área de atuação.
- Especialidade ou área de interesse.

### 9.2 Áreas de estudo

#### Áreas do MVP (Medicina e Fisioterapia)

- Clínica médica.
- Emergência.
- Cardiologia.
- Neurologia.
- Pneumologia.
- Infectologia.
- Gastroenterologia.
- Fisioterapia musculoesquelética.
- Fisioterapia cardiorrespiratória.
- Fisioterapia neurológica.

#### Áreas da Fase 2 (Enfermagem e Psicologia)

- Enfermagem clínica.
- Enfermagem em urgência e emergência.
- Enfermagem em saúde mental.
- Psicologia clínica.
- Psicologia hospitalar.
- Psicologia infantojuvenil.

#### Áreas de expansão futura (demais profissões)

- Pediatria.
- Endocrinologia.
- Ginecologia e obstetrícia.
- Saúde da família.
- Terapia intensiva.
- Farmácia clínica.
- Nutrição clínica.

As áreas devem ser filtradas de acordo com a profissão e o objetivo educacional do usuário.

### 9.3 Níveis de dificuldade

#### Fácil

- Condições relativamente comuns.
- Apresentação clínica característica.
- Poucos diagnósticos diferenciais.
- Menor quantidade de informações necessárias.

#### Médio

- Apresentação clínica menos evidente.
- Diagnósticos diferenciais relevantes.
- Necessidade de interpretar diferentes dados.

#### Difícil

- Casos atípicos.
- Informações ambíguas.
- Doenças menos frequentes.
- Maior necessidade de integração clínica.
- Diagnósticos concorrentes.

A dificuldade não deve considerar apenas a raridade da doença, mas também a complexidade do raciocínio necessário.

---

## 10. MVP

### Objetivo do MVP

Validar se estudantes e profissionais de saúde se engajam com casos clínicos interativos personalizados e se percebem valor educacional na experiência.

O lançamento inicial é restrito a **medicina e fisioterapia**, para garantir densidade e qualidade de casos suficientes nessas duas profissões antes de expandir para as demais.

### Funcionalidades prioritárias

#### Perfil (sem conta no MVP)

- Sem cadastro nem login para jogar — o usuário é identificado por um perfil anônimo local (dispositivo/navegador).
- Seleção entre estudante e profissional.
- Seleção da profissão (medicina ou fisioterapia no lançamento).
- Seleção das áreas de interesse.
- Seleção do nível de dificuldade.
- Armazenamento das preferências e do progresso vinculado a esse perfil anônimo.
- Cadastro/login com conta real (para sincronizar entre dispositivos e recuperar progresso) fica para a Fase 2 — ver seção 21.

#### Casos clínicos

- Criação ou seleção de caso conforme profissão, área e dificuldade.
- Estrutura padronizada.
- Diagnóstico principal definido.
- Diagnósticos diferenciais.
- Explicação educacional.
- Validação de consistência.

#### Modo Diagnóstico Progressivo

- Caso dividido em etapas.
- Revelação progressiva de informações.
- Campo para resposta.
- Registro de tentativas.
- Feedback sobre cada hipótese.
- Resultado final.

#### Resultado e revisão

- Diagnóstico esperado.
- Explicação do raciocínio.
- Dados que apoiam o diagnóstico.
- Dados que afastam diagnósticos diferenciais.
- Principais diagnósticos diferenciais.
- Pontos de aprendizagem.
- Referências ou fontes, quando disponíveis.
- Aviso de finalidade educacional.

#### Gamificação básica

- Pontuação por caso.
- Pontuação maior para respostas com menos pistas.
- Sequência de dias.
- Histórico de casos.
- Estatísticas básicas.
- Áreas mais praticadas.
- Taxa de acerto.

#### Motor de crescimento: Desafio Diário e Compartilhamento

Trazido da Fase 3 para o MVP por ser o principal mecanismo de aquisição orgânica do produto (mesma lógica de jogos como Wordle/Doctordle).

- Um caso diário, igual para todos os usuários de uma mesma profissão (medicina e fisioterapia terão desafios diários separados, dado o escopo clínico diferente).
- Número limitado de tentativas ou pistas por dia.
- Pontuação baseada na quantidade de pistas utilizadas.
- Tela de resultado com opção de compartilhar o desempenho (ex.: grade de tentativas, sem revelar o diagnóstico) em formato de texto/imagem para redes sociais e mensageiros.
- Sequência (streak) de dias visível e destacada no compartilhamento.
- Link de compartilhamento direciona para a página inicial, funcionando como canal de aquisição.

#### Segurança

- Aviso de finalidade educacional.
- Indicação de que a plataforma não substitui protocolos ou supervisão.
- Botão para reportar erros.
- Identificação de conteúdo gerado ou auxiliado por IA, quando aplicável.

---

## 11. Fora do escopo inicial

As funcionalidades abaixo podem ficar para versões futuras:

- Casos com imagens médicas.
- Interpretação de ECG.
- Análise de exames de imagem.
- Casos com áudio ou vídeo.
- Modo multiplayer.
- Ranking global.
- Sistema de professores e turmas.
- Aplicativo mobile nativo.
- Integração com Anki ou revisão espaçada.
- Certificados.
- Créditos de educação continuada.
- Biblioteca colaborativa.
- Personalização avançada.
- Simulações ramificadas complexas.
- Integrações com sistemas hospitalares.

---

## 12. Backlog inicial

### Épico 1: Onboarding e personalização

#### US-01 — Selecionar tipo de usuário

**Como usuário**, quero informar se sou estudante ou profissional para receber uma experiência adequada ao meu perfil.

**Critérios de aceitação:**

- O sistema apresenta as opções estudante e profissional.
- O usuário consegue selecionar uma opção.
- A escolha é armazenada no perfil.
- A escolha pode ser alterada posteriormente.

**Prioridade:** P0.

#### US-02 — Selecionar profissão

**Como usuário**, quero informar minha profissão ou área de formação para receber casos relevantes.

**Critérios de aceitação:**

- O sistema apresenta uma lista de profissões.
- O usuário consegue selecionar uma profissão.
- A seleção é armazenada.
- A profissão influencia as áreas e os casos disponíveis.

**Prioridade:** P0.

#### US-03 — Selecionar área de estudo

**Como usuário**, quero escolher as áreas que desejo estudar.

**Critérios de aceitação:**

- O sistema apresenta áreas compatíveis com o perfil.
- O usuário consegue selecionar uma ou mais áreas.
- As preferências são utilizadas nos casos.
- O usuário consegue alterar as áreas posteriormente.

**Prioridade:** P0.

#### US-04 — Selecionar dificuldade

**Como usuário**, quero selecionar o nível de dificuldade dos casos.

**Critérios de aceitação:**

- O sistema oferece os níveis fácil, médio e difícil.
- O nível influencia os casos apresentados.
- O usuário consegue alterar o nível.

**Prioridade:** P0.

---

### Épico 2: Casos clínicos

#### US-05 — Iniciar novo caso

**Como usuário**, quero iniciar um caso clínico compatível com meu perfil.

**Critérios de aceitação:**

- O caso respeita a profissão ou área selecionada.
- O caso respeita a área de estudo.
- O caso respeita o nível de dificuldade.
- O caso apresenta um objetivo claro.
- O diagnóstico não é exibido antes da conclusão.

**Prioridade:** P0.

#### US-06 — Receber informações progressivas

**Como usuário**, quero receber informações em etapas para praticar raciocínio clínico.

**Critérios de aceitação:**

- O caso possui etapas ordenadas.
- A próxima etapa é liberada após a ação esperada.
- O usuário consegue visualizar as informações já reveladas.
- As informações são coerentes entre si.

**Prioridade:** P0.

#### US-07 — Enviar hipótese diagnóstica

**Como usuário**, quero informar minha hipótese diagnóstica.

**Critérios de aceitação:**

- Existe um campo de resposta.
- O usuário consegue enviar uma resposta.
- O sistema registra a tentativa.
- O sistema não permite respostas vazias.
- O usuário recebe feedback após o envio.

**Prioridade:** P0.

#### US-08 — Receber feedback

**Como usuário**, quero receber feedback sobre minha hipótese.

**Critérios de aceitação:**

- O sistema informa se a resposta está correta, parcialmente correta ou incorreta.
- O feedback contém uma explicação breve.
- O sistema pode fornecer uma dica.
- O feedback respeita o estágio atual do caso.

**Prioridade:** P0.

#### US-09 — Visualizar resultado final

**Como usuário**, quero consultar a explicação completa após concluir a atividade.

**Critérios de aceitação:**

- O sistema apresenta o diagnóstico esperado.
- O sistema apresenta a justificativa.
- O sistema mostra os principais diagnósticos diferenciais.
- O sistema apresenta os pontos de aprendizagem.
- O resultado é salvo no histórico.

**Prioridade:** P0.

---

### Épico 3: Gamificação

#### US-10 — Receber pontuação

**Como usuário**, quero receber uma pontuação pelo meu desempenho.

**Critérios de aceitação:**

- A pontuação considera a quantidade de pistas utilizadas.
- O usuário visualiza a pontuação ao concluir o caso.
- A regra de pontuação é explicada.
- A pontuação é armazenada.

**Prioridade:** P1.

#### US-11 — Acompanhar sequência de dias

**Como usuário**, quero acompanhar minha sequência de dias de prática.

**Critérios de aceitação:**

- A sequência aumenta quando o usuário conclui um caso no dia.
- A sequência é interrompida conforme a regra definida.
- O usuário visualiza sua sequência atual.

**Prioridade:** P1.

#### US-12 — Visualizar estatísticas

**Como usuário**, quero acompanhar minha evolução.

**Critérios de aceitação:**

- O sistema exibe casos concluídos.
- O sistema exibe taxa de acerto.
- O sistema exibe pontuação acumulada.
- O sistema exibe áreas praticadas.
- O sistema exibe histórico básico.

**Prioridade:** P1.

#### US-18 — Resolver o desafio diário

**Como usuário**, quero resolver um caso diário igual para todos da minha profissão, para praticar de forma recorrente.

**Critérios de aceitação:**

- O sistema apresenta um caso diário por profissão (medicina e fisioterapia).
- O caso diário é o mesmo para todos os usuários daquela profissão no mesmo dia.
- O número de tentativas ou pistas é limitado.
- O usuário só pode jogar o desafio diário uma vez por dia.
- O desempenho no desafio diário conta para a sequência de dias.

**Prioridade:** P0.

#### US-19 — Compartilhar resultado do desafio diário

**Como usuário**, quero compartilhar meu resultado do desafio diário sem revelar o diagnóstico, para convidar colegas a jogar.

**Critérios de aceitação:**

- Existe um botão de compartilhar na tela de resultado do desafio diário.
- O conteúdo compartilhado não revela o diagnóstico nem pistas específicas do caso.
- O conteúdo compartilhado inclui indicadores de desempenho (ex.: pistas usadas, sequência de dias).
- O link compartilhado direciona para a página inicial da plataforma.
- O usuário consegue copiar ou enviar o resultado por aplicativos externos.

**Prioridade:** P0.

---

### Épico 4: Qualidade e segurança

#### US-13 — Validar caso clínico

**Como administrador**, quero validar a qualidade de um caso antes de disponibilizá-lo.

**Critérios de aceitação:**

- O caso possui diagnóstico principal.
- O caso possui justificativa clínica.
- O caso possui diagnósticos diferenciais.
- O caso não apresenta contradições importantes.
- O caso pode ser revisado ou removido.

**Prioridade:** P0.

#### US-14 — Reportar problema

**Como usuário**, quero reportar um caso incorreto ou inadequado.

**Critérios de aceitação:**

- Existe uma opção de reporte.
- O usuário pode selecionar ou descrever o problema.
- O reporte é armazenado.
- O usuário recebe confirmação.

**Prioridade:** P0.

#### US-15 — Exibir aviso educacional

**Como usuário**, quero entender que a plataforma serve para treinamento e não substitui a prática profissional.

**Critérios de aceitação:**

- O aviso aparece antes ou durante os casos.
- O aviso informa que os casos são educacionais.
- O aviso recomenda consultar protocolos e supervisores.
- O aviso não interfere excessivamente na experiência.

**Prioridade:** P0.

---

### Épico 5: Progresso e conta

#### US-17 — Salvar progresso sem conta

**Como usuário**, quero que meu progresso seja salvo automaticamente, sem precisar criar conta.

**Critérios de aceitação:**

- O sistema identifica o usuário por um perfil anônimo local (dispositivo/navegador), sem exigir cadastro.
- Casos concluídos são armazenados vinculados a esse perfil anônimo.
- A pontuação é armazenada.
- As preferências são armazenadas.
- O histórico permanece disponível em novos acessos no mesmo dispositivo/navegador.
- Fica claro para o usuário que limpar os dados do navegador ou trocar de dispositivo pode perder o progresso, até que exista conta.

**Prioridade:** P0.

#### US-16 — Criar conta (Fase 2)

**Como usuário**, quero criar uma conta para sincronizar meu progresso entre dispositivos e não perdê-lo.

**Critérios de aceitação:**

- O usuário consegue criar uma conta.
- O sistema valida os dados necessários.
- O progresso do perfil anônimo é migrado para a conta criada.
- O usuário consegue acessar seu histórico após o login, em qualquer dispositivo.

**Prioridade:** P1 (Fase 2 — fora do MVP inicial).

---

## 13. Estrutura de um caso clínico

Cada caso deve conter, preferencialmente:

- Título interno.
- Profissão ou público-alvo.
- Área de estudo.
- Nível de dificuldade.
- Faixa etária do paciente.
- Sexo ou gênero, quando clinicamente relevante.
- Queixa principal.
- História da doença atual.
- Antecedentes relevantes.
- Medicamentos, quando aplicável.
- Sinais vitais.
- Exame físico.
- Exames complementares, quando aplicável.
- Diagnóstico principal.
- Diagnósticos diferenciais.
- Justificativa.
- Pontos de aprendizagem.
- Referências bibliográficas.
- Alertas sobre limitações ou ambiguidades.
- Indicação de finalidade educacional.

### Requisitos de qualidade

Os casos devem ser:

- Clinicamente plausíveis.
- Coerentes internamente.
- Adequados ao público.
- Compatíveis com o escopo profissional.
- Escritos em linguagem clara.
- Livres de informações identificáveis de pacientes reais.
- Revisados por profissional qualificado antes de serem usados em escala.

---

## 14. Uso de inteligência artificial

A inteligência artificial pode auxiliar na criação e adaptação dos casos, mas não deve ser a única camada de validação clínica.

### Possíveis usos

- Gerar rascunhos de casos.
- Adaptar a dificuldade.
- Criar variações de um caso.
- Gerar dicas progressivas.
- Produzir explicações didáticas.
- Classificar casos por área e dificuldade.
- Sugerir diagnósticos diferenciais.
- Personalizar a sequência de estudo.

### Requisitos

- Estrutura padronizada.
- Validação automática dos campos obrigatórios.
- Verificação de contradições.
- Revisão humana em conteúdos sensíveis.
- Registro da versão do caso.
- Possibilidade de desativar casos problemáticos.
- Sistema de reporte pelos usuários.
- Monitoramento de respostas inadequadas.

### Princípio de segurança

A plataforma deve priorizar a qualidade e a segurança educacional acima da quantidade de casos gerados.

O Diagnostica não deve ser apresentado como uma ferramenta para diagnosticar pacientes reais.

---

## 15. Limites de escopo profissional

Os casos devem respeitar a formação e o escopo educacional de cada profissão.

### Medicina (MVP)

Priorizar:

- Raciocínio diagnóstico.
- Interpretação de sinais e sintomas.
- Diagnósticos diferenciais.
- Condutas compatíveis com o nível de formação.

### Fisioterapia (MVP)

Priorizar:

- Avaliação funcional.
- Raciocínio musculoesquelético.
- Raciocínio cardiorrespiratório.
- Raciocínio neurológico.

### Enfermagem (Fase 2)

Priorizar:

- Avaliação clínica de enfermagem.
- Sinais de alerta.
- Classificação de risco (ex.: protocolos de triagem/Manchester).
- Diagnóstico de enfermagem (taxonomia NANDA-I) e plano de cuidados.
- Tomada de decisão dentro do escopo profissional.

Não incluir diagnóstico médico definitivo ou prescrição medicamentosa como resposta esperada — a resposta canônica deve ser um diagnóstico/prioridade de enfermagem ou uma classificação de risco, não uma doença.

### Psicologia (Fase 2)

Priorizar:

- Entrevista e avaliação psicológica.
- Formulação de hipótese diagnóstica psicológica (DSM-5-TR/CID-11), quando aplicável ao nível de formação.
- Raciocínio sobre fatores predisponentes, precipitantes e mantenedores.
- Encaminhamento e limites de escopo (quando indicar avaliação psiquiátrica/médica complementar).

Não incluir prescrição medicamentosa nem conduta médica como resposta esperada — o psicólogo não prescreve. A resposta canônica deve ser a hipótese diagnóstica psicológica ou a conduta de manejo dentro do escopo da psicologia.

### Farmácia (expansão futura)

Priorizar:

- Farmacoterapia.
- Interações medicamentosas.
- Segurança medicamentosa.
- Acompanhamento farmacêutico.

### Nutrição (expansão futura)

Priorizar:

- Avaliação nutricional.
- Condições relacionadas à alimentação.
- Planejamento nutricional.

A plataforma deve evitar incentivar práticas fora da competência profissional do usuário.

---

## 16. Métricas de sucesso do MVP

### Engajamento

- Número de usuários cadastrados.
- Número de casos iniciados.
- Número de casos concluídos.
- Casos concluídos por usuário por semana.
- Tempo médio por caso.
- Taxa de retorno no dia 7.
- Taxa de retorno no dia 30.
- Tamanho médio da sequência de dias.

### Aprendizagem percebida

- Percentual de usuários que relatam melhora na compreensão.
- Avaliação da utilidade do feedback.
- Taxa de acerto por tema.
- Evolução em temas repetidos.
- Dificuldade percebida.

### Qualidade

- Número de casos reportados.
- Taxa de casos com inconsistências.
- Tempo de revisão de um caso reportado.
- Percentual de casos aprovados.
- Avaliação dos profissionais revisores.

### Metas iniciais indicativas

- 500 usuários cadastrados nos primeiros meses.
- Pelo menos 3 casos concluídos por usuário ativo por semana.
- Retenção no dia 7 de aproximadamente 30% ou mais.
- Tempo médio por caso entre 3 e 8 minutos.
- Avaliação positiva do feedback pela maioria dos usuários.
- Taxa de casos reportados em nível baixo e monitorado.

As metas devem ser ajustadas após os primeiros testes com usuários.

---

## 17. Riscos e mitigação

### Conteúdo clinicamente incorreto

**Mitigações:**

- Revisão por profissionais qualificados.
- Validação estruturada.
- Sistema de reporte.
- Monitoramento dos casos.
- Remoção rápida de conteúdo inadequado.

### Uso como orientação para pacientes reais

**Mitigações:**

- Avisos claros de finalidade educacional.
- Linguagem voltada ao treinamento.
- Ausência de recomendações para casos reais.
- Recomendação de consulta a protocolos e supervisores.
- Proibição de inserir dados identificáveis de pacientes.

### Baixa retenção

**Mitigações:**

- Desafio diário.
- Sequência de prática.
- Feedback útil.
- Casos rápidos.
- Progressão por níveis.
- Variedade de áreas e situações.

### Dificuldade inadequada

**Mitigações:**

- Níveis configuráveis.
- Avaliação de dificuldade após cada caso.
- Ajuste com base no desempenho.
- Revisão de casos com taxa de acerto muito alta ou baixa.

### Excesso de foco em gamificação

**Mitigações:**

- Priorizar aprendizado e feedback.
- Evitar pontuação que incentive respostas precipitadas.
- Exibir justificativas completas.
- Medir aprendizado, não apenas retorno.

### Privacidade e proteção de dados

**Mitigações:**

- Não utilizar dados identificáveis de pacientes.
- Usar casos fictícios ou anonimizados.
- Coletar apenas os dados necessários.
- Definir política de privacidade.
- Avaliar requisitos aplicáveis da LGPD.
- Controlar o acesso aos dados dos usuários.

---

## 18. Fluxo de telas do MVP

### Tela 1 — Entrada

Elementos:

- Nome da plataforma.
- Explicação curta da proposta.
- Botão para iniciar (sem exigir cadastro).

### Tela 2 — Perfil

Elementos:

- Estudante ou profissional.
- Profissão ou formação.
- Nível de experiência.

### Tela 3 — Preferências de estudo

Elementos:

- Área ou áreas de interesse.
- Nível de dificuldade.
- Objetivo de estudo, se aplicável.

### Tela 4 — Início do caso

Elementos:

- Área do caso.
- Nível de dificuldade.
- Instruções.
- Aviso educacional.
- Botão para iniciar.

### Tela 5 — Caso clínico

Elementos:

- Informações já reveladas.
- Nova pista ou etapa.
- Campo de resposta.
- Histórico das tentativas.
- Feedback.
- Botão para avançar.

### Tela 6 — Resultado

Elementos:

- Resultado do usuário.
- Diagnóstico esperado.
- Explicação.
- Diagnósticos diferenciais.
- Pontos de aprendizagem.
- Pontuação.
- Opção de marcar como revisado.
- Botão de compartilhar resultado (sem revelar o diagnóstico), quando o caso for o desafio diário.
- Sequência de dias em destaque, quando aplicável.

### Tela 7 — Progresso

Elementos:

- Casos concluídos.
- Taxa de acerto.
- Pontuação.
- Sequência de dias.
- Áreas mais praticadas.
- Histórico recente.

---

## 19. Princípios de experiência do usuário

- O usuário deve conseguir iniciar um caso rapidamente.
- A interface deve funcionar bem em dispositivos móveis.
- O texto deve ser claro e legível.
- O feedback deve ensinar, não apenas julgar.
- O sistema deve evitar punições excessivas por erro.
- A pontuação deve reforçar a prática, não substituir o aprendizado.
- O usuário deve entender em qual etapa está.
- O sistema deve diferenciar respostas parcialmente corretas.
- O resultado final deve ser útil para revisão.
- O conteúdo deve respeitar a diversidade das profissões de saúde.

---

## 20. Definição inicial de pronto

Uma funcionalidade poderá ser considerada pronta quando:

- Estiver implementada de acordo com a história do usuário.
- Possuir estados de carregamento, erro e sucesso.
- Funcionar em telas menores.
- For testada com dados reais ou simulados.
- Não apresentar contradições no fluxo principal.
- Estiver integrada ao registro de progresso, quando necessário.
- Possuir mensagens claras para o usuário.
- For revisada quanto a riscos educacionais e clínicos.
- Possuir critérios de reporte ou correção, quando aplicável.

---

## 21. Roadmap sugerido

### Fase 1 — Validação

- Entrevistas com estudantes e profissionais de medicina e fisioterapia.
- Protótipo navegável.
- Teste da mecânica de diagnóstico progressivo.
- Teste da compreensão da proposta.
- Profissões e áreas de lançamento definidas: medicina e fisioterapia.

### Fase 2 — MVP

- Perfil anônimo local (sem cadastro nem login).
- Perfil profissional (medicina ou fisioterapia).
- Seleção de área.
- Seleção de dificuldade.
- Diagnóstico progressivo.
- Feedback.
- Resultado final.
- Histórico local.
- Pontuação básica.
- Desafio diário e compartilhamento de resultado.
- Reporte de problemas.

### Fase 3 — Contas de usuário

- Cadastro e login.
- Migração do progresso anônimo para a conta.
- Sincronização entre dispositivos.
- Recuperação de senha.

### Fase 4 — Aprimoramento

- Mais áreas profissionais (enfermagem, farmácia, nutrição).
- Casos revisados por especialistas.
- Estatísticas completas.
- Adaptação de dificuldade.
- Sistema de revisão de casos.

### Fase 5 — Expansão

- Casos ramificados.
- Imagens e exames.
- Modo professor.
- Turmas.
- Rankings.
- Multiplayer.
- Revisão espaçada.
- Integrações externas.

---

## 22. Posicionamento provisório

> O Diagnostica é uma plataforma de prática clínica gamificada que transforma casos de saúde em desafios interativos personalizados para estudantes e profissionais.

---

## 23. Disclaimer

> Esta plataforma tem finalidade exclusivamente educacional. Os casos apresentados são simulados ou anonimizados e não substituem supervisão profissional, protocolos institucionais, diretrizes clínicas ou avaliação individualizada de pacientes. Não insira informações identificáveis de pacientes reais.
