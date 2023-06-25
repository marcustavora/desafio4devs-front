import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/models/api-response.model';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cliente-form',
    templateUrl: './cliente.form.component.html',
    styleUrls: ['./cliente.form.component.scss']
})
export class ClienteFormComponent implements OnInit {
    isEdit: boolean = false;
    id: number= 0;
    formCliente: FormGroup;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private clienteService: ClienteService,
        private formBuilder: FormBuilder) {
        this.formCliente = this.formBuilder.group({
            nome: ['', [Validators.required, Validators.maxLength(256)]],
            cnpj: [''],
            nomeContato: ['', [Validators.required, Validators.maxLength(256)]],
            dataCliente: ['']
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEdit = true;
                this.id = params['id'];
                this.clienteService.obterPorId(params['id']).subscribe(c => {
                    this.formCliente.patchValue(c.dados);
                })
            }
        });
    }

    salvar() {
        if (this.formCliente.valid) {
            if (!this.isEdit) {
                this.clienteService.criar(this.formCliente.getRawValue()).subscribe(c => {
                    if (c.status == ApiResponseStatus.Sucesso) {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }).then(() => {
                            this.router.navigate(['app/cliente']);
                        });
                    } else {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                });
            } else {
                this.clienteService.editar(this.id, this.formCliente.getRawValue()).subscribe(c => {
                    if (c.status == ApiResponseStatus.Sucesso) {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }).then(() => {
                            this.router.navigate(['app/cliente']);
                        });
                    } else {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                });
            }
        }
    }

    hasError(controlName: string, errorName: string) {
        return this.formCliente.controls[controlName].hasError(errorName);
    }
}