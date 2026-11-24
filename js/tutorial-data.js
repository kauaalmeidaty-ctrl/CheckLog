// Guia centralizado: altere os itens aqui para atualizar o tutorial.
export const TUTORIAL_ITEMS = Object.freeze([
  { title: 'Registrar ponto', page: 'registrar_ponto', location: 'Menu Operação → Máquina de Ponto', steps: ['Abra Máquina de Ponto.', 'Confira o status do seu turno.', 'Use o botão correspondente para registrar entrada, início ou fim do intervalo e saída.', 'Confira o registro atualizado.'] },
  { title: 'Meu CheckLog', page: 'meu-checklog', location: 'Menu Operação → Meu CheckLog', steps: ['Abra Meu CheckLog.', 'Consulte seu histórico de ponto e saldo do banco de horas.', 'Quando necessário, use as opções de ajuste ou justificativa disponíveis e acompanhe a solicitação.'] },
  { title: 'Controle de estoque', page: 'controle-estoque', admin: true, location: 'Menu Gestão → Controle de Estoque', steps: ['Abra Controle de Estoque.', 'Consulte os produtos e identifique itens com estoque baixo.', 'Use as ações da tela para cadastrar ou atualizar produtos e registrar movimentações.', 'Confira as quantidades após salvar.'] },
  { title: 'Encomendas', page: 'encomendar', admin: true, location: 'Controle de Estoque → Encomendar', steps: ['Abra Encomendar pelo menu da área de estoque.', 'Consulte os pedidos existentes.', 'Preencha os dados solicitados ao criar uma encomenda e acompanhe seu andamento.'] },
  { title: 'Fornecedores', page: 'fornecedores', admin: true, location: 'Menu Gestão → Fornecedores', steps: ['Abra Fornecedores.', 'Consulte os contatos e dados cadastrados.', 'Use as ações disponíveis para adicionar ou atualizar um fornecedor.'] },
  { title: 'Indicadores e relatórios', page: 'dashboard', admin: true, location: 'Controle de Estoque → Dashboard / Relatórios', steps: ['Abra Dashboard para visualizar os indicadores do estoque.', 'Acesse Relatórios para consultar informações detalhadas.', 'Use os filtros e opções de exportação disponíveis, quando necessário.'] }
]);
export function getTutorialItems(authenticated, isAdmin) {
  if (!authenticated) return [];
  return TUTORIAL_ITEMS.filter(item => !item.admin || isAdmin);
}
export function canShowTutorial(authenticated) { return Boolean(authenticated); }
