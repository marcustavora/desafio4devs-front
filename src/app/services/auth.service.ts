import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse } from '../models/auth-response.model';
import jwt_decode from "jwt-decode";

const _api = 'https://localhost:7235/api/Autenticacao/';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    login(username: string, senha: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(_api + 'Login', { username, senha });
    }

    revokeRefreshToken(): Observable<any> {
        return this.http.post<any>(_api + 'Revoke', {});
    }

    criarUsuario(username: string, email: string, senha: string): Observable<any> {
        return this.http.post(_api + 'signup', {username, email, senha });
    }

    logout() {
        this.revokeRefreshToken().subscribe(() => {
            localStorage.removeItem('jwt');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/login']);
        });
    }

    storeToken(data: AuthResponse): void {
        localStorage.setItem('jwt', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
    }

    getTokenData(): any | undefined {
        const token = localStorage.getItem("jwt");

        if (token != null) {
            let tokenData = jwt_decode<any>(token);

            var currentTime = new Date().getTime() / 1000;

            tokenData.isTokenExpired = currentTime > tokenData.exp ?? false;

            return tokenData;
        }

        return undefined;
    }

    getName(): any {
        const tokenData = this.getTokenData();
        if (tokenData) {
            return tokenData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
        }

        return undefined;
    }

    isLoggedIn(): boolean {
        let tokenData = this.getTokenData();

        if (tokenData != null && !tokenData.isTokenExpired) {
            return true;
        }

        return false;
    }
}