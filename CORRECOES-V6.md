# CheckLog — Correções V6

Esta versão parte da V5 enviada pelo usuário e preserva as correções anteriores.

## Novos ajustes
- Indicadores da página inicial passam a receber diretamente os valores de estoque baixo, encomendas abertas e fornecedores ativos.
- Máquina de Ponto protege chaves usadas em caminhos do Firebase Realtime Database e grava `timestampMs` com o horário já sincronizado, sem placeholder `.sv` dentro da transação.
- Painel de Gestão reorganizado para colocar Espelho Diário e Auditoria na mesma coluna principal.
- Central de Justificativas com cards alinhados e responsivos.

## Testes
Execute:
`node --test tests/*.test.mjs`

Resultado desta versão: 26 testes aprovados.
