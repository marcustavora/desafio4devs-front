import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/models/api-response.model';
import { ClienteLista } from 'src/app/models/cliente-lista.model';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cliente-list',
    templateUrl: './cliente.list.component.html',
    styleUrls: ['./cliente.list.component.scss']
})
export class ClienteListComponent implements OnInit {
    @ViewChild(MatSort, { static: false }) sort!: MatSort;

    formSearch: FormGroup;
    displayedColumns: string[] = ['nome', 'cnpj', 'dataUltimaAvaliacao', 'nota', 'actions'];
    totalRecords: number = 0;
    dataSource: MatTableDataSource<ClienteLista> = new MatTableDataSource<ClienteLista>();
    showResult: boolean = false;
    coresNotas: any[] = ['#BF0419', '#E4011C', '#F53705', '#F96702', '#FFAC04', '#FED700', '#E4EB07', '#D5F005', '#B9EB00', '#9AE317', '#3DC348'];

    constructor(private clienteService: ClienteService, private router: Router) {
        this.formSearch = new FormGroup({
            nome: new FormControl('', [])
        });
    }

    ngOnInit() {
        this.pesquisar();
    }

    pesquisar() {
        this.clienteService.obterPorNome(this.formSearch.value.nome).subscribe(c => {
            this.showResult = true;

            if (c.status == ApiResponseStatus.Sucesso) {
                this.totalRecords = c.dados?.length;
                this.dataSource = new MatTableDataSource<ClienteLista>(c.dados);
                this.dataSource.sort = this.sort;
            } else {
                Swal.fire({
                    title: 'Cliente',
                    text: 'Erro ao pesquisar avaliação',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            }
        })
    }

    editar(id: number) {
        this.router.navigate([`app/cliente/${id}`]);
    }

    excluir(id: number) {
        Swal.fire({
            title: 'Cliente',
            text: "Deseja realmente excluir esse cliente?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Não',
            confirmButtonText: 'Sim'
        }).then((result) => {
            if (result.isConfirmed) {
                this.clienteService.excluir(id).subscribe(c => {
                    if (c.status == ApiResponseStatus.Sucesso) {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'success',
                            confirmButtonText: 'Ok'
                        }).then(() => {
                            this.pesquisar();
                        });
                    } else {
                        Swal.fire({
                            title: 'Cliente',
                            text: c.mensagem,
                            icon: 'error',
                            confirmButtonText: 'Ok'
                        });
                    }
                })
            }
        });
    }
}