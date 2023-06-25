import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { timer } from 'rxjs';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    nomeUsuario: string;

    constructor(private authService: AuthService, private observer: BreakpointObserver,) {
        this.nomeUsuario = this.authService.getName();
    }

    ngAfterViewInit() {
        timer(0).subscribe(() => {
            this.observer.observe(["(max-width: 800px)"]).subscribe((res) => {
                if (res.matches) {
                    this.sidenav.mode = "over";
                    this.sidenav.close();
                } else {
                    this.sidenav.mode = "side";
                    this.sidenav.open();
                }
            });
        })
    }

    logout() {
        this.authService.logout();
    }
}