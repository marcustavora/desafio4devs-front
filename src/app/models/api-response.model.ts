export interface ApiResponse<T> {
    status: ApiResponseStatus;
    mensagem: string;
    dados: T;
}

export enum ApiResponseStatus {
    Erro = 0,
    Sucesso = 1
}