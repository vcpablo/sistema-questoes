<template>
    <div>
        <app-page-title title="Cadastro de Habilidade" index="false"></app-page-title>
    <div class="row">
        <div class="col-sm-12">

            <form @submit.prevent="save" novalidate>
                <!-- Disciplina -->
                <div class="form-group">
                    <label for="disciplina">Disciplina</label>
                    <select id="disciplina" class="form-control"
                            v-validate="'required'" data-vv-name="disciplina"
                            v-model="habilidade.objetoConhecimento.grandeTema.disciplina.id"
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
                            v-model="habilidade.objetoConhecimento.grandeTema.id"
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
                            v-model="habilidade.objetoConhecimento.id">
                        <option value="">Selecione uma opção</option>
                        <option v-for="objetosConhecimento in objetosConhecimento" :value="objetosConhecimento.id">
                            {{ objetosConhecimento.descricao }}
                        </option>
                    </select>
                    <span v-show="errors.has('objeto_conhecimento')">{{ errors.first('objeto_conhecimento') }}</span>

                </div>
                <!-- Competência -->
                <div class="form-group">
                    <label for="competencia">Competência</label>
                    <select id="competencia" class="form-control"
                            :disabled="habilidade.objetoConhecimento.id == ''"
                            v-validate="'required'" data-vv-name="competencia"
                            required

                            v-model="habilidade.competencia">
                        <option value="">Selecione uma opção</option>
                        <option v-for="competencia in competencias" :value="competencia.toUpperCase()">
                            {{ competencia }}
                        </option>
                    </select>
                    <span v-show="errors.has('competencia')">{{ errors.first('competencia') }}</span>

                </div>
                <!-- Grande Tema -->
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <textarea type="text" class="form-control" placeholder="Descrição"
                              v-model="habilidade.descricao" v-validate="'required'" id="descricao" data-vv-name="descricao"></textarea>
                    <span v-show="errors.has('descricao')">{{ errors.first('descricao') }}</span>
                </div>
                <app-buttons path="/grandes_temas"></app-buttons>
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
    import { Utils} from '../../utils';

    export default {
        data() {
            return {
                habilidade: {
                    id:0,
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
                },
                disciplinas: [],
                grandesTemas: [],
                objetosConhecimento: [],
                competencias: [ 'Observar', 'Compreender', 'Realizar' ]
            }

        },
        methods: {
            save() {
                let habilidade = {
                    id:this.habilidade.id,
                    descricao: this.habilidade.descricao,
                    competencia: this.habilidade.competencia,
                    objeto_conhecimento: this.habilidade.objetoConhecimento.id
                };

                Api.save({
                    model:'habilidade',
                    data:habilidade,
                    validator:this.$validator,
                    path:'/habilidades'
                });
            },
            changeDisciplina($event) {


                this.habilidade.objetoConhecimento.grandeTema.id = '';

                let params = { disciplina: $event.target.value };

                Api.loadAll('grande_tema', (response) => {

                    this.grandesTemas = response.data;
                }, false, params);
            },
            changeGrandeTema($event) {


                this.habilidade.objetoConhecimento.id = '';

                let params = { grande_tema: $event.target.value };

                Api.loadAll('objeto_conhecimento', (response) => {

                    this.objetosConhecimento = response.data;
                }, false, params);
            }

        },
        created() {
            let promiseDisciplinas = Api.loadAll('disciplina');

            if(!isNaN(this.$route.params.id)) {
                Api.load(this.$route.params.id, 'objeto_conhecimento', (response) => {
                    let promiseGrandeTemas = Api.loadAll('grande_tema', false, false, {disciplina: response.data.grandeTema.disciplina.id});

                    Promise.all([promiseDisciplinas, promiseGrandeTemas]).then((responses) => {
                        this.disciplinas = responses[0].data;
                        this.grandesTemas = responses[1].data;

                        this.objetoConhecimento = response.data;
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