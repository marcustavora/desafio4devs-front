import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from '@angular/router';;
import { AuthResponse } from 'src/app/models/auth-response.model';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {
        let tokenData = this.authService.getTokenData();

        if (tokenData != null && !tokenData.isTokenExpired) {
            return true;
        }

        const isRefreshSuccess = await this.refreshToken();

        if (!isRefreshSuccess) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('refreshToken');
            this.router.navigate(['/login']);
        }

        return isRefreshSuccess;



        // if (route.data['userType'] === 'guest') {
        //     return true;
        // } else if (route.data['userType'] === 'loged-in') {
        //     if (userInfo.id > 0) {
        //         return true;
        //     }
        //     this.router.navigate(['/']);
        //     return false;
        // } else if (route.data['userType'] === 'non-loged-in') {
        //     if (userInfo.id === 0) {
        //         return true;
        //     }
        //     this.router.navigate(['/']);
        //     return false;
        // }
        // this.router.navigate(['/']);
        // return false;
    }

    async refreshToken(): Promise<boolean> {
        const accessToken = localStorage.getItem("jwt");
        const refreshToken = localStorage.getItem("refreshToken");

        if (!accessToken || !refreshToken) {
            return false;
        }

        const credentials = JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken });

        const responseRefresh = await new Promise<AuthResponse | undefined>((resolve, reject) => {
            this.http.post<AuthResponse>("https://localhost:7235/api/Autenticacao/RefreshToken", credentials).subscribe({
                next: (res: AuthResponse) => resolve(res),
                error: () => { resolve(undefined) }
            });
        });

        if (responseRefresh == undefined) {
            return false;
        } else {
            localStorage.setItem("jwt", responseRefresh.accessToken);
            localStorage.setItem("refreshToken", responseRefresh.refreshToken);
            return true;
        }
    }
}