import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    formLogin: FormGroup;

    constructor(private authService: AuthService, private router: Router) {
        this.formLogin = new FormGroup({
            username: new FormControl('', [Validators.required]),
            senha: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit(): void {
        if (this.authService.isLoggedIn()) {
            this.router.navigate(['/app/home']);
        }
    }

    login(): void {
        if (this.formLogin.valid) {
            this.authService.login(this.formLogin.value.username, this.formLogin.value.senha).subscribe({
                next: data => {
                    this.authService.storeToken(data);
                    this.router.navigate(['/app/home']);
                },
                error: err => {
                    Swal.fire({
                        title: 'Login',
                        text: 'Usuário e/ou senha inválido!',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                      })
                }
            });
        }
    }

    hasError(controlName: string, errorName: string) {
        return this.formLogin.controls[controlName].hasError(errorName);
    }
}