<template>
    <div>
        <app-page-title name="Habilidade" title="Habilidades" path="/habilidades/incluir"></app-page-title>
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
                        descricao: { title: 'Descrição' },
                        competencia: { title: 'Competência' },
                        objetoConhecimento: {
                            title: 'Objeto de Conhecimento',
                            value(objetoConhecimento) {
                                return objetoConhecimento.descricao;
                            }
                        }
                    },
                    model: 'habilidade',
                    path: '/habilidades/editar'
                },
                data: []
            }
        },
        created() {
            Api.loadAll('habilidade', (response) => {
                this.data = response.data;
            });
        },
        components: {
            appTable: Table,
            appPageTitle: PageTitle
        }
    }
</script>