<template>
    <div>
        <app-page-title title="Cadastro de Questão" index="false"></app-page-title>
        <div class="row">
            <div class="col-sm-12">
                <form @submit.prevent="save" novalidate>
                    <!-- Tipo de Questão -->
                    <div class="form-group">
                        <label for="tipo">Tipo</label>
                        <select id="tipo" class="form-control"
                                v-validate="'required'" data-vv-name="tipo"
                                v-model="questao.tipo"
                                @change="changeTipo"
                                required>
                            <option value="">Selecione uma opção</option>
                            <option v-for="(tipo, value) in tipos" :value="value">
                                {{ tipo }}
                            </option>
                        </select>
                        <span v-show="errors.has('tipo')">{{ errors.first('tipo') }}</span>
                    </div>
                    <!-- Disciplina -->
                    <div class="form-group">
                        <label for="disciplina">Disciplina</label>
                        <select id="disciplina" class="form-control"
                                :disabled="questao.tipo == ''"
                                v-validate="'required'" data-vv-name="disciplina"
                                v-model="questao.habilidade.objetoConhecimento.grandeTema.disciplina.id"
                                required
                                @change="changeDisciplina">
                            <option value="">Selecione uma opção</option>
                            <option v-for="disciplina in disciplinas" :value="disciplina.id">
                                {{ disciplina.descricao }}
                            </option>
                        </select>
                        <span v-show="errors.has('disciplina')">{{ errors.first('disciplina') }}</span>
                    </div>
                    <!-- Grande Tema -->
                    <div class="form-group">
                        <label for="grande_tema">Grande Tema</label>
                        <select id="grande_tema" class="form-control"
                                :disabled="grandesTemas.length == 0"
                                v-validate="'required'" data-vv-name="grande_tema"
                                required
                                v-model="questao.habilidade.objetoConhecimento.grandeTema.id"
                                @change="changeGrandeTema">
                            <option value="">Selecione uma opção</option>
                            <option v-for="grandeTema in grandesTemas" :value="grandeTema.id">
                                {{ grandeTema.descricao }}
                            </option>
                        </select>
                        <span v-show="errors.has('grande_tema')">{{ errors.first('grande_tema') }}</span>
                    </div>
                    <!-- Objeto de Conhecimento -->
                    <div class="form-group">
                        <label for="objeto_conhecimento">Objeto de Conhecimento</label>
                        <select id="objeto_conhecimento" class="form-control"
                                :disabled="objetosConhecimento.length == 0"
                                v-validate="'required'" data-vv-name="objeto_conhecimento"
                                required
                                v-model="questao.habilidade.objetoConhecimento.id"
                                @change="changeObjetoConhecimento">
                            <option value="">Selecione uma opção</option>
                            <option v-for="objetosConhecimento in objetosConhecimento" :value="objetosConhecimento.id">
                                {{ objetosConhecimento.descricao }}
                            </option>
                        </select>
                        <span v-show="errors.has('objeto_conhecimento')">{{ errors.first('objeto_conhecimento') }}</span>

                    </div>
                    <!-- Filtro de Competência -->
                    <div v-if="questao.habilidade.objetoConhecimento.id">
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
                        <!-- Habilidade -->
                        <div class="form-group">
                            <label>Selecionar Habilidade</label>
                            <div v-if="habilidades.length > 0">
                                <div class="radio" v-for="habilidade in habilidadesFiltradas">
                                    <label>
                                        <input type="radio" name="habilidade" :value="habilidade.id" v-model="questao.habilidade.id" v-validate="'required'" data-vv-name="habilidade">
                                        {{ habilidade.descricao }}
                                    </label>
                                </div>
                            </div>
                            <div v-if="habilidades.length == 0">
                                Nenhuma habilidade encontrada
                            </div>
                            <span v-show="errors.has('habilidade')">{{ errors.first('habilidade') }}</span>
                        </div>
                    </div>
                    <!-- Enunciado -->
                    <div class="form-group">
                        <label for="descricao">Enunciado</label>
                        <textarea type="text" class="form-control" placeholder="Enunciado"
                                  v-model="questao.descricao" v-validate="'required'" id="descricao" data-vv-name="descricao"></textarea>
                        <span v-show="errors.has('descricao')">{{ errors.first('descricao') }}</span>

                    </div>
                    <!-- Alternativas -->
                    <div class="form-group" v-if="questao.tipo == 'MULTIPLA_ESCOLHA' || questao.tipo == 'VERDADEIRO_FALSO'">
                        <div class="form-group">
                            <button type="button" class="btn btn-primary" @click="addItem()">
                                <i class="fa fa-plus"></i> Adicionar Alternativa
                            </button>
                        </div> <div v-if="questao.itens.length > 0">
                        <hr>
                        <h3>Alternativas</h3>

                        <table class="table" v-if="questao.itens.length > 0">
                            <tr>
                                <th>Descrição</th>
                                <th class="text-center">{{(questao.tipo == 'MULTIPLA_ESCOLHA') ? 'Correto' : 'Verdadeiro' }}</th>
                                <th>Remover</th>
                            </tr>
                            <tr v-for="(item, index) in itens" v-if="item.status = 1">
                                <td>
                                    <input type="hidden" class="form-control" v-model="item.id"/>
                                    <input type="text" class="form-control" required v-model="item.descricao" v-validate="'required'" data-vv-name="item_descricao"/>
                                </td>
                                <td class="text-center">
                                    <div class="form-group">
                                        <input type="radio" name="item_correto" value="1" v-if="questao.tipo == 'MULTIPLA_ESCOLHA'"
                                               v-model="item.correto">

                                        <input type="checkbox" v-model="item.correto" :value="1"  v-if="questao.tipo == 'VERDADEIRO_FALSO'"/>
                                    </div>
                                </td>
                                <td>
                                    <div class="form-group">

                                        <button type="button" class="btn btn-danger btn-sm" @click="removeItem(item)">
                                            <i class="fa fa-trash-o"></i> Remover
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    </div>
                    <app-buttons path="/questoes"></app-buttons>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import Select from '../Select.vue';
    import Buttons from '../layout/Buttons.vue';
    import PageTitle from '../layout/PageTitle.vue';
    import { Api } from '../../api';
    import { Utils } from '../../utils';
    import  _ from 'lodash';
    import { ErrorBag } from 'vee-validate';
    import toastr from 'toastr';


    export default {
        data() {
            return {
                questao: {
                    id:0,
                    descricao:'',
                    itens:[],
                    tipo:'',
                    habilidade: {
                        id:'',
                        descricao:'',
                        objetoConhecimento: {
                            id:'',
                            descricao:'',
                            grandeTema: {
                                id:'',
                                disciplina: {
                                    id:''
                                }
                            }
                        }
                    }
                },
                disciplinas: [],
                grandesTemas: [],
                objetosConhecimento: [],
                habilidades: [],
                competencias: [ 'Observar', 'Compreender', 'Realizar' ],
                adicionandoItem:false,
                item: {
                    descricao:'',
                    correto:false
                },
                filtroCompetencia: {
                    observar: true,
                    compreender: true,
                    realizar: true
                },
                tipos: {
                    'DISSERTATIVA': 'Dissertativa',
                    'MULTIPLA_ESCOLHA': 'Múltipla Escolha',
                    'VERDADEIRO_FALSO': 'Verdadeiro / Falso'
                }
            }

        },
        methods: {
            validate(questao) {

                let errors = [];
                if(questao.habilidade == '') {
                    errors.push('Habilidade não selecionada');
                }

                if(questao.tipo == 'MULTIPLA_ESCOLHA' || questao.tipo == 'VERDADEIRO_FALSO') {
                    if(this.itens.length < 2) {
                        errors.push('Questões do tipo ' + this.tipos[questao.tipo] + ' devem possuir pelo menos 2 alternativas');
                    } else {
                        if(this.itens.length > 5) {
                            errors.push('Questões do tipo ' + this.tipos[questao.tipo] + ' devem possuir no máximo 5 alternativas');
                        } else if(questao.tipo == 'MULTIPLA_ESCOLHA') {

                            let correctItems = this.itens.filter(function(item) {
                                return item.correto == 1;
                            });

                            console.log('correctItems', correctItems)

                            if(correctItems.length == 0) {
                                errors.push('Questões do tipo ' + this.tipos[questao.tipo] + ' devem possuir pelo menos 1 alternativa correta');
                            } else if(correctItems.length > 1) {
                                errors.push('Questões do tipo ' + this.tipos[questao.tipo] + ' devem possuir somente 1 alternativa correta');
                            }
                        }

                    }
                }

                if(errors.length > 0) {
                    toastr.error(errors.join('<br>'), 'Atenção');
                    return false;
                }

                return true;

            },
            save() {
                let questao = {
                    id:this.questao.id,
                    tipo: this.questao.tipo,
                    descricao: this.questao.descricao,
                    habilidade: this.questao.habilidade.id,
                    itens: this.questao.itens
                };


                if(this.validate(questao)) {
                    Api.save({
                        model:'questao',
                        data:questao,
                        validator:this.$validator,
                        path:'/questoes'
                    });
                }

            },
            changeTipo($event) {
                if($event.target.value == '') {
                    this.questao.habilidade.objetoConhecimento.grandeTema.disciplina.id = '';
                }
            },
            changeDisciplina($event) {
                this.questao.habilidade.objetoConhecimento.grandeTema.id = '';

                let params = { disciplina: $event.target.value };

                Api.loadAll('grande_tema', (response) => {

                    this.grandesTemas = response.data;
                }, false, params);
            },
            changeGrandeTema($event) {

                this.questao.habilidade.objetoConhecimento.id = '';

                let params = { grande_tema: $event.target.value };

                Api.loadAll('objeto_conhecimento', (response) => {

                    this.objetosConhecimento = response.data;
                }, false, params);
            },
            changeObjetoConhecimento($event) {


                this.questao.habilidade.id = '';

                let params = { objeto_conhecimento: $event.target.value };

                Api.loadAll('habilidade', (response) => {

                    this.habilidades = response.data;
                }, false, params);
            },
            selectAllCompetencias() {

                this.filtroCompetencia = {
                    observar:!this.filtrosCompetencia,
                    compreender:!this.filtrosCompetencia,
                    realizar:!this.filtrosCompetencia
                }
            },
            addItem() {

                this.questao.itens.push({
                    id: Utils.guid(),
                    descricao:this.item.descricao,
                    correto: this.item.correto,
                    status:1,
                    new: true
                });
            },
            removeItem(item) {
                item.status = 0;
            }


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
            itens: function() {
                return this.questao.itens.filter(function(item) {
                    return item.status == 1;
                });
            }
        },
        created() {
            let promiseDisciplinas = Api.loadAll('disciplina');

            if(!isNaN(this.$route.params.id)) {
                Api.load(this.$route.params.id, 'questao', (response) => {

                    let promiseGrandeTemas = Api.loadAll('grande_tema', false, false, {disciplina: response.data.habilidade.objetoConhecimento.grandeTema.disciplina.id});
                    let promiseObjetosConhecimento = Api.loadAll('objeto_conhecimento', false, false, {grande_tema: response.data.habilidade.objetoConhecimento.grandeTema.id});
                    let promiseHabilidades = Api.loadAll('habilidade', false, false, {objeto_conhecimento: response.data.habilidade.objetoConhecimento.id});

                    Promise.all([promiseDisciplinas, promiseGrandeTemas, promiseObjetosConhecimento, promiseHabilidades]).then((responses) => {
                        this.disciplinas = responses[0].data;
                        this.grandesTemas = responses[1].data;
                        this.objetosConhecimento = responses[2].data;
                        this.habilidades = responses[3].data;

                        this.questao = response.data;
                    });
                });
            } else {
                promiseDisciplinas.then((response) => {
                    this.disciplinas = response.data;
                });
            }
        },
        components: {
            appSelect: Select,
            appButtons: Buttons,
            appPageTitle: PageTitle
        }
    }
</script>

<style scope></style>