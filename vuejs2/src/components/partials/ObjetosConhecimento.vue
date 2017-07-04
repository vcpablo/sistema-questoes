<template>
    <div>
        <app-page-title name="Objeto de Conhecimento" title="Objetos de Conhecimento" path="/objetos_conhecimento/incluir"></app-page-title>
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
                        grandeTema: {
                            title: 'Grande Tema',
                            value(grandeTema) {
                                return grandeTema.descricao;
                            }
                        }
                    },
                    model: 'objeto_conhecimento',
                    path: '/objetos_conhecimento/editar'
                },
                data: []
            }
        },
        created() {
            Api.loadAll('objeto_conhecimento', (response) => {
                this.data = response.data;
            });
        },
        components: {
            appTable: Table,
            appPageTitle: PageTitle
        }
    }
</script>

<style scope></style>