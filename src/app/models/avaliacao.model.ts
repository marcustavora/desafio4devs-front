export interface Avaliacao {
    mesAnoReferencia: string;
    dataAvaliacao: Date | undefined;
    clienteAvaliacao: ClienteAvaliacao[];
}

export interface ClienteAvaliacao {
    clienteId: number;
    nota: number;
    motivoNota: string;
}