<template>
    <div>
        <app-page-title title="Teste Gerado" index="false"></app-page-title>
        <div class="row">
            <div class="col-sm-12" v-for="(questao, indexQuestao) in questoes">
                <p><b>{{ indexQuestao + 1 }}. {{ questao.descricao }}</b></p>

                <div v-if="questao.tipo == 'DISSERTATIVA'">
                    <p>___________________________________________________________________________________________________________________________________________________________________________</p>
                    <p>___________________________________________________________________________________________________________________________________________________________________________</p>
                </div>

                <div v-if="questao.tipo == 'MULTIPLA_ESCOLHA'">
                    <p>Marque a alternativa correta</p>

                    <p v-for="(item, index) in questao.itens">
                        {{ index + 1 }}) {{ item.descricao }}
                    </p>
                </div>

                <div v-if="questao.tipo == 'VERDADEIRO_FALSO'">
                    <p>Marque <b>V</b> para <b>Verdadeiro</b> e <b>F</b> para <b>Falso</b></p>

                    <p v-for="item in questao.itens">
                        (&nbsp;&nbsp;&nbsp;) {{ item.descricao }}
                    </p>
                </div>
                <hr>
            </div>
        </div>
    </div>
</template>
<script>
    import PageTitle from '../layout/PageTitle.vue';

    export default {
        props:['questoes'],
        components: {
            appPageTitle: PageTitle
        }
    }
</script>

<style scope></style>