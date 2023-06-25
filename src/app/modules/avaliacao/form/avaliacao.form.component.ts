import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponseStatus } from 'src/app/models/api-response.model';
import { AvaliacaoFiltro } from 'src/app/models/avaliacao-filtro.model';
import { ClienteAvaliacao } from 'src/app/models/avaliacao.model';
import { ClienteLista } from 'src/app/models/cliente-lista.model';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-avaliacao-form',
    templateUrl: './avaliacao.form.component.html',
    styleUrls: ['./avaliacao.form.component.scss']
})
export class AvaliacaoFormComponent {
    isDetail: boolean = false;
    submit: boolean = false;
    formAvaliacao!: FormGroup;
    clientes: ClienteLista[] = [];
    detalheClienteAvaliacao: ClienteAvaliacao[] = [];
    notas: any[] = [
        { valor: 0, cor: '#BF0419' },
        { valor: 1, cor: '#E4011C' },
        { valor: 2, cor: '#F53705' },
        { valor: 3, cor: '#F96702' },
        { valor: 4, cor: '#FFAC04' },
        { valor: 5, cor: '#FED700' },
        { valor: 6, cor: '#E4EB07' },
        { valor: 7, cor: '#D5F005' },
        { valor: 8, cor: '#B9EB00' },
        { valor: 9, cor: '#9AE317' },
        { valor: 10, cor: '#3DC348' }
    ];
    quantidadeClienteSelecionado: number = 0;
    percentualClienteSelecionado: number = 0;
    resultado: any;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private avaliacaoService: AvaliacaoService,
        private clienteService: ClienteService,
        private formBuilder: FormBuilder) {
        this.obterClientes();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isDetail = true;
                this.construirForm();
                this.carregarAvaliacao(params['id']);
                this.carregarResultado(params['id']);
            } else {
                this.construirForm();
                this.adicionarCliente();
            }
        });
    }

    get formGroupClienteAvaliacao() {
        return this.formAvaliacao.get('clienteAvaliacao') as FormArray<FormGroup>;
    }

    construirForm() {
        this.formAvaliacao = this.formBuilder.group({
            mesAnoReferencia: new FormControl({ value: '', disabled: this.isDetail }, Validators.required),
            dataAvaliacao: new FormControl({ value: new Date(), disabled: true }),
            clienteAvaliacao: this.formBuilder.array([])
        });
    }

    obterClientes() {
        this.clienteService.obterPorNome('').subscribe(c => {
            this.clientes = c.dados;
        });
    }

    carregarAvaliacao(id: number) {
        this.avaliacaoService.obterPorId(id).subscribe(c => {
            this.detalheClienteAvaliacao = c.dados.clienteAvaliacao;
            for (let index = 0; index < c.dados.clienteAvaliacao.length; index++) {
                this.adicionarCliente();
            }

            this.formAvaliacao.patchValue(c.dados);

            this.calcularPercentualSelecionado();
        })
    }

    carregarResultado(avaliacaoId: number) {
        let params: AvaliacaoFiltro = { mesAnoReferencia: undefined, avaliacaoId: avaliacaoId };
        this.avaliacaoService.obterRelatorioResultado(params).subscribe(r => {
            let nps = r.dados.nps[0].value;
            this.resultado = nps >= 80.0 ? 'Atingida' : (nps >= 60 ? 'Tolerância' : 'Não Atingida');
        });
    }

    adicionarCliente() {
        let clientes = this.formAvaliacao.get('clienteAvaliacao') as FormArray;

        clientes.push(this.formBuilder.group({
            clienteId: new FormControl({ value: '', disabled: this.isDetail }, Validators.required),
            nota: new FormControl({ value: null, disabled: this.isDetail }, Validators.required),
            motivoNota: new FormControl({ value: '', disabled: this.isDetail }, Validators.required)
        }));
    }

    clienteSelecionado(clienteId: number, index: number) {
        let clienteJaSelecionado = this.formGroupClienteAvaliacao.controls.map(c => c.value.clienteId).filter(c => c === clienteId).length > 1;

        if (clienteJaSelecionado) {
            this.formGroupClienteAvaliacao.controls[index]['controls']['clienteId'].setValue('');
            Swal.fire({
                title: 'Avaliação',
                text: 'Cliente já selecionado. Selecione outro cliente!',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });
        }

        this.quantidadeClienteSelecionado = 0;

        for (let i = 0; i < this.formGroupClienteAvaliacao.controls.length; i++) {
            if (this.formGroupClienteAvaliacao.controls[i]['controls']['clienteId'].value != '') {
                this.quantidadeClienteSelecionado = this.quantidadeClienteSelecionado + 1;
            }
        }
        this.percentualClienteSelecionado = (this.quantidadeClienteSelecionado / this.clientes.length) * 100.0;
    }

    calcularPercentualSelecionado() {
        this.quantidadeClienteSelecionado = 0;

        for (let i = 0; i < this.detalheClienteAvaliacao.length; i++) {
            if (this.detalheClienteAvaliacao[i].clienteId != 0) {
                this.quantidadeClienteSelecionado = this.quantidadeClienteSelecionado + 1;
            }
        }
        this.percentualClienteSelecionado = (this.quantidadeClienteSelecionado / this.detalheClienteAvaliacao.length) * 100.0;
    }

    selecionarNota(index: number, nota: number) {
        this.formGroupClienteAvaliacao.value[index].nota = nota;
        this.formGroupClienteAvaliacao.controls[index]['controls']['nota'].setValue(nota);
    }

    excluirClienteAvaliacao(index: number) {
        let selecionado = this.formGroupClienteAvaliacao.controls[index]['controls']['clienteId'].value != '';
        if (selecionado) {
            this.quantidadeClienteSelecionado = this.quantidadeClienteSelecionado - 1;
            this.percentualClienteSelecionado = (this.quantidadeClienteSelecionado / this.clientes.length) * 100.0;
        }

        this.formGroupClienteAvaliacao.removeAt(index);
    }

    salvar() {
        if (this.isDetail)
            return;

        this.submit = true;

        if (this.formAvaliacao.valid) {
            this.avaliacaoService.criar(this.formAvaliacao.getRawValue()).subscribe(c => {
                if (c.status == ApiResponseStatus.Sucesso) {
                    Swal.fire({
                        title: 'Avaliação',
                        text: c.mensagem,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then(() => {
                        this.router.navigate(['app/avaliacao']);
                    });
                } else {
                    Swal.fire({
                        title: 'Avaliação',
                        text: c.mensagem,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                }
            })
        }
    }

    hasError(controlName: string, errorName: string) {
        return this.formAvaliacao.controls[controlName].hasError(errorName);
    }

    hasErrorCliente(controlName: string, index: number, errorName: string) {
        return this.formGroupClienteAvaliacao.controls[index]['controls'][controlName].hasError(errorName);
    }
}