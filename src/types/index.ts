export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: string;
  disponivel: boolean;
}

export interface ItemCarrinho {
  produtoId: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export interface Cliente {
  nome: string;
  telefone: string;
}

export interface ItemPedido {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PedidoPayload {
  clienteNome: string;
  clienteTelefone: string;
  observacoes?: string;
  itens: ItemPedido[];
}
