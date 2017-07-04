<template>
    <div>
        <app-page-title name="Questão" title="Questões" path="/questoes/incluir"></app-page-title>
        <div class="row">
            <div class="col-sm-12">
                <app-table :data="data" :options="options"></app-table>
            </div>
        </div>
    </div>
</template>
<script>
    import Table from '../Table.vue';
    import PageTitle from '../layout/PageTitle.vue';
    import { Api } from '../../api';

    export default {
        data() {
            return {
                options: {
                    headers: {
                        id: { title: 'Id' },
                        descricao: { title: 'Enunciado' },
                        tipo: { title: 'Tipo' },
                        habilidade: {
                            title: 'Habilidade',
                            value(habilidade) {
                                return habilidade.descricao;
                            }
                        },
                        competencia: { title: 'Competência',
                            value(habilidade, questao) {
                                return questao.habilidade.competencia;
                            }
                        }
                    },
                    model: 'questao',
                    path: '/questoes/editar'
                },
                data: []
            }
        },
        created() {
                Api.loadAll('questao', (response) => {
                this.data = response.data;
            });
        },
        components: {
            appTable: Table,
            appPageTitle: PageTitle
        }
    }
</script>