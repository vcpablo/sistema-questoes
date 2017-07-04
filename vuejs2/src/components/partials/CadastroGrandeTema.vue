<template>
    <div>
        <app-page-title title="Cadastro de Grande Tema" index="false"></app-page-title>
    <div class="row">
        <div class="col-sm-12">
            <form @submit.prevent="save" novalidate>
                <!-- Disciplina -->
                <div class="form-group">
                    <label for="disciplina">Disciplina</label>
                    <select id="disciplina" class="form-control"
                            v-validate="'required'" data-vv-name="disciplina"
                            v-model="grandeTema.disciplina.id"
                            required>
                        <option value="undefined">Selecione uma opção</option>
                        <option v-for="disciplina in disciplinas" :value="disciplina.id">
                            {{ disciplina.descricao }}
                        </option>
                    </select>
                    <span v-show="errors.has('disciplina')">{{ errors.first('disciplina') }}</span>

                </div>
                <!-- Descrição -->
                <div class="form-group">
                    <label for="descricao">Descrição</label>
                    <input type="text" class="form-control" placeholder="Descrição"
                           v-model="grandeTema.descricao" v-validate="'required'" id="descricao" data-vv-name="descricao">
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

    export default {
        data() {
            return {
                grandeTema: {
                    id:0,
                    descricao:'',
                    disciplina:{
                        id:''
                    }
                },
                disciplinas: []
            }

        },
        methods: {
            save() {
                let grandeTema = {
                    id: this.grandeTema.id,
                    descricao: this.grandeTema.descricao,
                    disciplina: this.grandeTema.disciplina.id
                };

                Api.save({
                    model:'grande_tema',
                    data:grandeTema,
                    validator:this.$validator,
                    path:'/grandes_temas'
                });
            }
        },
        created() {
            Api.loadAll('disciplina', (response) => {
                this.disciplinas = response.data;

                if(!isNaN(this.$route.params.id)) {
                    Api.load(this.$route.params.id, 'grande_tema', (response) => {
                        if(response.data.disciplina) {
                            response.data.disciplina = response.data.disciplina.id;
                        }
                        this.grandeTema = response.data;
                    })
                }
            });

        },
        components: {
            appSelect: Select,
            appButtons: Buttons,
            appPageTitle: PageTitle
        }
    }
</script>

<style scope></style>