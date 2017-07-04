<template>
    <div>
        <app-page-title name="Grande Tema" title="Grandes Temas" path="/grandes_temas/incluir"></app-page-title>
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
                        disciplina: {
                            title: 'Disciplina',
                            value(disciplina) {
                                return disciplina.descricao;
                            }
                        }
                    },
                    model: 'grande_tema',
                    path: '/grandes_temas/editar'
                },
                data: []
            }
        },
        created() {
            Api.loadAll('grande_tema', (response) => {
                this.data = response.data;
            });
        },
        components: {
            appTable: Table,
            appPageTitle: PageTitle
        }
    }
</script>
