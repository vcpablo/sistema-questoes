<template>
    <div>
        <app-page-title title="Cadastro de Objeto de Conhecimento"></app-page-title>
    <div class="row">
        <div class="col-sm-12">

            <form @submit.prevent="save" novalidate>
                <!-- Disciplina -->
                <div class="form-group">
                    <label for="disciplina">Disciplina</label>
                    <select id="disciplina" class="form-control"
                            v-validate="'required'" data-vv-name="disciplina"
                            v-model="objetoConhecimento.grandeTema.disciplina.id"
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
                            v-model="objetoConhecimento.grandeTema.id">
                        <option value="">Selecione uma opção</option>
                        <option v-for="grandeTema in grandesTemas" :value="grandeTema.id">
                            {{ grandeTema.descricao }}
                        </option>
                    </select>
                    <span v-show="errors.has('grande_tema')">{{ errors.first('grande_tema') }}</span>

                </div>
                <!-- Descrição -->
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <input type="text" class="form-control" placeholder="Descrição"
                           v-model="objetoConhecimento.descricao" v-validate="'required'" id="descricao" data-vv-name="descricao">
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
                objetoConhecimento: {
                    id:0,
                    descricao:'',
                    grandeTema: {
                        id:'',
                        disciplina: {
                            id:''
                        }
                    }
                },
                disciplinas: [],
                grandesTemas: []
            }

        },
        methods: {
            save() {
                let objetoConhecimento = {
                    id:this.objetoConhecimento.id,
                    descricao: this.objetoConhecimento.descricao,
                    disciplina: this.objetoConhecimento.grandeTema.disciplina.id,
                    grande_tema: this.objetoConhecimento.grandeTema.id
                };

                Api.save({
                    model:'objeto_conhecimento',
                    data:objetoConhecimento,
                    validator:this.$validator,
                    path:'/objetos_conhecimento'
                });
            },
            changeDisciplina($event) {

                this.objetoConhecimento.grandeTema.id = '';

                let params = { disciplina: $event.target.value };

                Api.loadAll('grande_tema', (response) => {

                    this.grandesTemas = response.data;
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