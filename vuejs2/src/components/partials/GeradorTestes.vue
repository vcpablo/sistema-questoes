<template>
    <div>
        <app-page-title title="Gerador de Testes" index="false"></app-page-title>
        <div class="row">
            <div class="col-sm-12">
                <form @submit.prevent="generate" >
                    <div class="form-group">
                        <label for="total">Nº de questões</label>
                        <input type="number" class="form-control" placeholder="Nº de questões"
                               v-model="test.numero_questoes" v-validate="'required'" id="total" data-vv-name="total">
                        <span v-show="errors.has('total')">{{ errors.first('total') }}</span>
                    </div>

                    <div class="form-group">
                        <label>Tipos de Questões</label>

                        <div class="checkbox">
                            <label class="checkbox-inline" v-for="(tipo, value) in tipos">
                                <input type="checkbox" :value="value" v-model="test.tipos_questoes"> {{ tipo }}
                            </label>
                        </div>

                    </div>

                    <div class="form-group" v-if="test.tipos_questoes.length > 0">
                        <label>Disciplinas</label>

                        <div class="checkbox">
                            <div  v-for="disciplina in disciplinas">
                                <label class="checkbox-inline">
                                    <input type="checkbox" :value="disciplina.id" v-model="test.disciplinas" @change="changeDisciplina"> {{ disciplina.descricao }}
                                </label>
                            </div>
                        </div>

                    </div>

                    <div class="form-group" v-if="test.disciplinas.length > 0">
                        <label>Grandes Temas</label>

                        <div class="checkbox" v-if="grandesTemas.length > 0">
                            <div v-for="grandeTema in grandesTemas">
                                <label class="checkbox-inline" >
                                    <input type="checkbox" :value="grandeTema.id" v-model="test.grandes_temas" @change="changeGrandeTema"> {{ grandeTema.descricao }}
                                </label>
                            </div>
                        </div>
                        <p v-if="grandesTemas.length == 0">Nenhum grande tema encontrado</p>

                    </div>

                    <div class="form-group" v-if="test.grandes_temas.length > 0">
                        <label>Objetos de Conhecimento</label>

                        <div class="checkbox" v-if="objetosConhecimento.length > 0">
                            <div class="checkbox" v-for="objetoConhecimento in objetosConhecimento">
                                <label >
                                    <input type="checkbox" :value="objetoConhecimento.id" v-model="test.objetos_conhecimento" @change="changeObjetoConhecimento"> {{ objetoConhecimento.descricao }}
                                </label>
                            </div>
                        </div>
                        <p v-if="objetosConhecimento.length == 0">Nenhum objeto de conhecimento encontrado</p>

                    </div>

                    <div v-if="test.objetos_conhecimento.length > 0">
                        <div class="form-group" v-if="habilidades">
                            <label>Filtrar por Competência</label>
                            <div>
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="todas" value="" v-model="filtrosCompetencia" @change="selectAllCompetencias"> Todas
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="observar" value="OBSERVAR" v-model="filtroCompetencia.observar"> Observar
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="compreender" value="COMPREENDER" v-model="filtroCompetencia.compreender"> Compreender
                                </label>
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="realizar" value="REALIZAR" v-model="filtroCompetencia.realizar"> Realizar
                                </label>
                            </div>

                        </div>
                        <div class="form-group">
                            <label>Selecionar Habilidade</label>
                            <div v-if="habilidades.length > 0" class="checkbox">
                                <div  v-for="habilidade in habilidadesFiltradas">
                                    <label class="checkbox-inline">
                                        <input type="checkbox" name="habilidade" :value="habilidade.id" v-model="test.habilidades" @change="changeHabilidade">
                                        {{ habilidade.descricao }}
                                    </label>
                                </div>
                            </div>
                            <div v-if="habilidades.length == 0">
                                Nenhuma habilidade encontrada
                            </div>
                        </div>
                    </div>

                    <div class="form-group" v-if="test.tipos_questoes.length > 0 || test.habilidades.length > 0">
                        <label>Selecionar Questões</label>
                        <div v-if="questoes.length > 0" class="checkbox">
                            <div  v-for="questao in questoes">
                                <label class="checkbox-inline">
                                    <input type="checkbox" name="habilidade" :value="questao.id" v-model="test.questoes">
                                    {{ questao.descricao }}
                                </label>
                            </div>
                        </div>
                        <div v-if="questoes.length == 0">
                            Nenhuma questão encontrada
                        </div>
                    </div>


                    <app-buttons path="/"></app-buttons>

                </form>
            </div>
        </div>

        <div v-if="questoesAleatorias.length > 0">

            <app-teste  :questoes="questoesAleatorias"></app-teste>
            <hr>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <button type="button" class="btn btn-warning" @click="questoesAleatorias = []">
                            <i class="fa fa-refresh"></i> Limpar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import PageTitle from '../layout/PageTitle.vue';
    import Buttons from '../layout/Buttons.vue';
    import Teste from '../partials/Teste.vue';
    import { Api } from '../../api';

    export default {
        data() {
            return {
                tipos: {
                    'DISSERTATIVA': 'Dissertativa',
                    'MULTIPLA_ESCOLHA': 'Múltipla Escolha',
                    'VERDADEIRO_FALSO': 'Verdadeiro / Falso'
                },
                competencias: {
                    'OBSERVAR': 'Observar',
                    'COMPREENDER': 'Compreender',
                    'REALIZAR': 'Realizar'
                },
                disciplinas: [],
                grandesTemas: [],
                objetosConhecimento: [],
                habilidades: [],
                questoes:[],
                questoesAleatorias:[],
                test: {
                    numero_questoes: 10,
                    tipos_questoes: [],
                    disciplinas: [],
                    grandes_temas: [],
                    objetos_conhecimento: [],
                    competencias: [],
                    habilidades: [],
                    questoes: []
                },
                filtroCompetencia: {
                    observar: true,
                    compreender: true,
                    realizar: true
                },
            }
        },
        methods: {
            validate(test) {
                return true;
            },
            generate() {
                if(this.validate(this.test)) {
                    let done = (response) => {
                        this.questoesAleatorias =response.data;
                    };

                    let params;

                    if(this.test.questoes.length > 0) {
                        params = {
                            questoes:this.test.questoes.join(','),
                            numero_questoes:this.test.numero_questoes
                        };
                    } else {
                        params = {
                            tipos_questoes:this.test.tipos_questoes.map(function(tipo) {
                                switch(tipo) {
                                    case 'VERDADEIRO_FALSO': return 3;
                                    case 'MULTIPLA_ESCOLHA': return 2;
                                    default: return 1;
                                }
                            }).join(','),
                            disciplinas:this.test.disciplinas.join(','),
                            grandes_temas:this.test.grandes_temas.join(','),
                            objetos_conhecimento:this.test.objetos_conhecimento.join(','),
                            habilidades:this.test.habilidades.join(','),
                            numero_questoes:this.test.numero_questoes,
                        };
                    }


                    console.log('params', params);

                    Api.save({
                        model:'teste',
                        data:params,
                        validator:this.$validator
                    }, done);
                }
            },
            changeDisciplina($event) {

                this.test.grandes_temas = [];

                let params = { disciplina: this.test.disciplinas.join(',') };

                Api.loadAll('grande_tema', (response) => {
                    this.grandesTemas = response.data;
                }, false, params);
            },
            changeGrandeTema($event) {


                this.test.objetos_conhecimento = [];

                let params = { grande_tema: this.test.grandes_temas.join(',') };

                Api.loadAll('objeto_conhecimento', (response) => {
                    this.objetosConhecimento = response.data;
                }, false, params);
            },
            changeObjetoConhecimento($event) {


                this.test.habilidades = [];

                let params = { objeto_conhecimento: this.test.objetos_conhecimento.join(',') };

                Api.loadAll('habilidade', (response) => {

                    this.habilidades = response.data;
                }, false, params);
            },
            changeHabilidade($event) {


                this.test.questoes = [];

                let params = { tipo: this.test.tipos_questoes.join(','), habilidade: this.test.habilidades.join(',') };

                Api.loadAll('questao', (response) => {

                    this.questoes = response.data;
                }, false, params);
            },
            selectAllCompetencias() {
                this.filtroCompetencia = {
                    observar:!this.filtrosCompetencia,
                    compreender:!this.filtrosCompetencia,
                    realizar:!this.filtrosCompetencia
                }
            },
        },
        created() {
            let promiseDisciplinas = Api.loadAll('disciplina').then((response) => {
                this.disciplinas = response.data;
            });

        },
        computed: {
            habilidadesFiltradas: function() {
                if(this.filtrosCompetencia) {
                    return this.habilidades;
                } else {
                    let filtros = [];

                    for(var i in this.filtroCompetencia) {
                        if(this.filtroCompetencia[i]) {
                            filtros.push(i.toUpperCase())
                        }
                    }
                    console.log('filtros', filtros)

                    return _.filter(this.habilidades, (habilidade) => {
                        return filtros.indexOf(habilidade.competencia) !== -1;
                    });
                }
            },
            filtrosCompetencia: function() {
                return this.filtroCompetencia.observar === true && this.filtroCompetencia.compreender === true && this.filtroCompetencia.realizar === true;
            },
        },
        components: {
            appPageTitle: PageTitle,
            appButtons: Buttons,
            appTeste: Teste
        }
    }

</script>
