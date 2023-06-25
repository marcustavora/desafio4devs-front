import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    loading$: Observable<boolean>;
    subject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loadingMap: Map<string, boolean> = new Map<string, boolean>();

    constructor() { 
        this.loading$ = this.subject.asObservable().pipe(delay(3));
    }

    set(loading: boolean, url: string): void {
        if (loading) {
            this.loadingMap.set(url, loading);
            this.subject.next(true);
            return;
        }
        
        if (!loading && this.loadingMap.has(url)) {
            this.loadingMap.delete(url);
        }
        if (this.loadingMap.size === 0) {
            this.subject.next(false);
        }
    }
}