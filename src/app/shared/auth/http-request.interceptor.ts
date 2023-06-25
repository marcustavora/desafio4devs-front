import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(private router: Router, private loadingService: LoadingService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loadingService.set(true, req.url);
        const token = localStorage.getItem('jwt');

        req = req.clone({
            withCredentials: true,
            headers: req.headers.set('Content-Type', 'application/json').set('Authorization', `Bearer ${token}`)
        });

        return next.handle(req).pipe(
            finalize(() => this.loadingService.set(false, req.url)),
            catchError(err => {
                if ([401, 403].includes(err.status)) {
                    this.router.navigate(['login']);
                }

                const error = err.error?.message || err.statusText;
                console.error(err);
                return throwError(() => error);
            }))
    }
}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];