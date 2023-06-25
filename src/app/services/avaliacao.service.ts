import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AvaliacaoLista } from '../models/avaliacao-lista.model';
import { ApiResponse } from '../models/api-response.model';
import { Avaliacao } from '../models/avaliacao.model';
import { AvaliacaoFiltro } from '../models/avaliacao-filtro.model';

const API_URL = 'https://localhost:7235/api/Avaliacao';

@Injectable({
    providedIn: 'root',
})
export class AvaliacaoService {
    constructor(private http: HttpClient) { }

    criar(model: Avaliacao): Observable<ApiResponse<boolean>> {
        return this.http.post<ApiResponse<boolean>>(`${API_URL}`, model);
    }
    
    obterPorId(id: number): Observable<ApiResponse<Avaliacao>> {
        return this.http.get<ApiResponse<Avaliacao>>(`${API_URL}/${id}`);
    }

    obterPorFiltro(filtro: AvaliacaoFiltro): Observable<ApiResponse<AvaliacaoLista[]>> {
        let params = new HttpParams();
        params = params.appendAll(JSON.parse(JSON.stringify(filtro)));
        return this.http.get<ApiResponse<AvaliacaoLista[]>>(`${API_URL}/ObterPorFiltro`, { params: params});
    }

    obterRelatorioResultado(filtro: AvaliacaoFiltro): Observable<any> {
        let params = new HttpParams();
        params = params.appendAll(JSON.parse(JSON.stringify(filtro)));
        return this.http.get<ApiResponse<any>>(`${API_URL}/ObterRelatorioResultado`, { params: params});
    }
}