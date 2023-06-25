import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/models/api-response.model';
import { AvaliacaoLista } from 'src/app/models/avaliacao-lista.model';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-avaliacao-list',
    templateUrl: './avaliacao.list.component.html',
    styleUrls: ['./avaliacao.list.component.scss']
})

export class AvaliacaoListComponent implements OnInit {
    @ViewChild(MatSort, {static: false}) sort!: MatSort;

    formSearch: FormGroup;
    displayedColumns: string[] = ['mesAnoReferencia', 'dataAvaliacao', 'qtdClientesAvaliados', 'actions'];
    dataSource: MatTableDataSource<AvaliacaoLista> = new MatTableDataSource<AvaliacaoLista>([]);
    totalRecords: number = 0;
    showResult: boolean = false;

    constructor(private avaliacaoService: AvaliacaoService, private router: Router) {
        this.formSearch = new FormGroup({
            mesAnoReferencia: new FormControl('', [])
        });
    }

    ngOnInit() {
        this.pesquisar();
    }

    pesquisar() {
        this.avaliacaoService.obterPorFiltro(this.formSearch.value).subscribe(c => {
            this.showResult = true;

            if (c.status == ApiResponseStatus.Sucesso) {
                this.totalRecords = c.dados?.length;
                this.dataSource = new MatTableDataSource<AvaliacaoLista>(c.dados);
                this.dataSource.sort = this.sort;
            } else {
                Swal.fire({
                    title: 'Avaliação',
                    text: 'Erro ao pesquisar avaliação',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                })
            }
        })
    }

    detalhar(id: number) {
        this.router.navigate([`app/avaliacao/${id}`]);
    }
}