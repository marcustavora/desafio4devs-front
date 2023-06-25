import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { AvaliacaoFiltro } from 'src/app/models/avaliacao-filtro.model';
import { AvaliacaoService } from 'src/app/services/avaliacao.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    dadosResultado: EChartsOption = {};

    constructor(private router: Router, private avaliacaoService: AvaliacaoService) {
        this.obterRelatorioResultado();
    }

    obterRelatorioResultado() {
        let params: AvaliacaoFiltro = { mesAnoReferencia: undefined, avaliacaoId: undefined };
        this.avaliacaoService.obterRelatorioResultado(params).subscribe(r => {
            this.montarGrafico(r.dados);
        })
    }

    montarGrafico(dados: any) {
        this.dadosResultado = {
            xAxis: {
                type: 'category',
                data: dados.mesAnoReferencia,
            },
            yAxis: {
                type: 'value',
            },
            tooltip: {
                formatter: function(params, ticket) {
                  return  "Clique para Detalhe da Avaliação";
                },
            },
            series: [
                {
                    data: dados.nps,
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'top',
                        formatter: (data) => {
                            return data.value + "%";
                        }
                    }
                },
            ],
        };
    }

    onChartClick(event: any) {
        this.router.navigate([`app/avaliacao/${event.data.avaliacaoId}`]);
    }
}