import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClienteLista } from '../models/cliente-lista.model';
import { ApiResponse } from '../models/api-response.model';
import { Cliente } from '../models/cliente.model';

const API_URL = 'https://localhost:7235/api/Cliente';

@Injectable({
    providedIn: 'root',
})
export class ClienteService {
    constructor(private http: HttpClient) { }

    criar(model: Cliente): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${API_URL}`, model);
    }

    editar(id: number, model: Cliente) {
        return this.http.put<ApiResponse<boolean>>(`${API_URL}/${id}`, model);
    }

    excluir(id: number): Observable<ApiResponse<boolean>> {
        return this.http.delete<ApiResponse<boolean>>(`${API_URL}/${id}`);
    }
    
    obterPorId(id: number): Observable<ApiResponse<Cliente>> {
        return this.http.get<ApiResponse<Cliente>>(`${API_URL}/${id}`);
    }

    obterPorNome(nome: string): Observable<ApiResponse<ClienteLista[]>> {
        return this.http.get<ApiResponse<ClienteLista[]>>(`${API_URL}/ObterPorNome?nome=${nome}`);
    }
}