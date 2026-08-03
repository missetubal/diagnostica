# Prompt: gerar caso clínico estruturado a partir de um caso existente

Use este prompt em qualquer LLM (Claude, ChatGPT etc.), colando o caso-fonte no lugar indicado. A saída é sempre um **rascunho** — precisa passar pela revisão humana antes de virar `em_revisao`/`aprovado`/`publicado` (ver `sugestao-arquitetura.md`, seções 11 e 24).

---

## Prompt

```
Você vai transformar um caso clínico publicado (artigo, case report, material educacional) em um caso estruturado para uma plataforma de treinamento de raciocínio clínico chamada Diagnostica.

REGRAS OBRIGATÓRIAS:

1. NÃO copie a redação original. Reescreva com suas próprias palavras, mudando estrutura de frases e ordem de apresentação das informações. Trate o caso-fonte como referência do quadro clínico, não como texto a ser reproduzido.

2. Adapte detalhes não-essenciais ao raciocínio diagnóstico (idade exata, profissão do paciente, cidade, nomes, datas, nome da instituição) para reduzir a chance de o caso ser identificável como cópia de uma publicação específica. Mantenha apenas o que é clinicamente relevante para o raciocínio (faixa etária, sexo quando relevante, sinais, sintomas, exames).

3. NÃO invente referências bibliográficas. Se você souber a fonte original (artigo, livro, diretriz), cite-a no campo "references". Se não tiver certeza da fonte exata, deixe "references" como lista vazia — não invente um título, autor ou URL.

4. NÃO inclua nenhuma informação que possa identificar um paciente real (nome, data de nascimento, número de prontuário, localização específica, data exata do atendimento).

5. Se o caso-fonte não tiver informação suficiente para preencher um campo obrigatório com segurança clínica, sinalize isso explicitamente em um campo extra "avisos_para_revisor" (lista de strings) em vez de inventar a informação.

6. O caso deve respeitar o escopo profissional informado (medicina ou fisioterapia — ver critérios abaixo) e não incentivar condutas fora desse escopo.

CRITÉRIOS DE ESCOPO POR PROFISSÃO:

- Medicina: raciocínio diagnóstico, interpretação de sinais e sintomas, diagnósticos diferenciais, condutas compatíveis com o nível de formação informado.
- Fisioterapia: avaliação funcional, raciocínio musculoesquelético, cardiorrespiratório ou neurológico (conforme a área do caso) — não incluir prescrição médica ou diagnóstico fora do escopo da fisioterapia.

FORMATO DE SAÍDA — responda SOMENTE com um JSON válido, seguindo exatamente este schema:

{
  "id": "slug-curto-descritivo",
  "title": "Título curto do caso",
  "objective": "O que o usuário deve conseguir identificar ao final",
  "professions": ["medicina" ou "fisioterapia"],
  "area": "uma das áreas do MVP (ex.: clinica-medica, emergencia, cardiologia, neurologia, pneumologia, infectologia, gastroenterologia, fisioterapia-musculoesqueletica, fisioterapia-cardiorrespiratoria, fisioterapia-neurologica)",
  "difficulty": "facil | medio | dificil",
  "patient": {
    "age": número inteiro (aproximado, não precisa ser o valor exato do caso-fonte),
    "sex": "masculino | feminino | não especificado"
  },
  "stages": [
    {
      "order": 1,
      "type": "queixa_principal",
      "content": "texto da etapa"
    }
    // outras etapas usando apenas estes tipos, na ordem que fizer sentido clinicamente:
    // queixa_principal, historia, antecedentes, medicamentos, sinais_vitais,
    // exame_fisico, exames_complementares, evolucao, pista_final
  ],
  "main_answer": {
    "canonical_term": "termo diagnóstico/conduta principal, em português",
    "accepted_terms": ["sinônimos e variações aceitas como corretas"],
    "partial_terms": ["respostas próximas mas incompletas/imprecisas"]
  },
  "differentials": [
    {
      "name": "diagnóstico diferencial",
      "explanation": "por que deve ser considerado e por que não é o principal"
    }
  ],
  "explanation": "explicação didática de por que o diagnóstico principal é favorecido",
  "learning_points": [
    "ponto de aprendizagem 1",
    "ponto de aprendizagem 2"
  ],
  "references": [
    {
      "title": "título da referência, apenas se você tiver certeza dela",
      "url": "url, apenas se você tiver certeza dela"
    }
  ],
  "avisos_para_revisor": [
    "qualquer lacuna, suposição ou incerteza que o revisor humano precisa checar antes de aprovar"
  ],
  "status": "rascunho",
  "source_type": "ia_assistida",
  "version": 1
}

CASO-FONTE (cole abaixo o texto, resumo ou link do caso que servirá de referência):

"""
[COLE AQUI O CASO-FONTE]
"""

PROFISSÃO ALVO: [medicina ou fisioterapia]
ÁREA ALVO: [uma das áreas do MVP]
DIFICULDADE ALVO: [facil, medio ou dificil]
```

---

## Checklist antes de promover o rascunho para `em_revisao`

Depois que a IA devolver o JSON, antes de considerar o caso pronto para revisão clínica formal (seção 27 do `sugestao-arquitetura.md`), confira:

- [ ] Nenhum campo de `avisos_para_revisor` ficou sem resposta.
- [ ] O texto foi de fato reescrito, não é uma paráfrase muito próxima do original.
- [ ] Nenhum dado potencialmente identificável (nome, local, data exata, instituição) permaneceu.
- [ ] `references` só contém itens que você consegue verificar de verdade — remova qualquer um que pareça inventado.
- [ ] O `canonical_term` e os `differentials` fazem sentido clínico coerente com as `stages`.
- [ ] O caso respeita o escopo da profissão alvo (ver seção 15 do `visao-geral.md`).
- [ ] `area` e `difficulty` correspondem às listas do MVP (seção 9 do `visao-geral.md`).

Só depois desse checklist o caso deve ir para revisão clínica de fato (por você ou pelos profissionais de contato) e, então, para `aprovado` → `publicado`.
