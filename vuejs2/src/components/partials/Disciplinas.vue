<template>
    <div>
        <app-page-title name="Disciplina" title="Disciplinas" path="/disciplinas/incluir"></app-page-title>
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
                        descricao: { title: 'Descrição' }
                    },
                    model: 'disciplina',
                    path: '/disciplinas/editar'
                },
                data: []
            }
        },
        created() {
           Api.loadAll('disciplina', (response) => {
               this.data = response.data;
           });
        },
        components: {
            appTable: Table,
            appPageTitle: PageTitle
        }
    }
</script>
