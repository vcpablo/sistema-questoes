<template>
    <div>
            <app-page-title title="Cadastro de Disciplina" index="false"></app-page-title>
        <div class="row">
            <div class="col-sm-12">
                <form @submit.prevent="save" >
                    <!-- Descrição -->
                    <div class="form-group">
                        <label for="descricao">Descrição</label>
                        <input type="text" class="form-control" placeholder="Descrição"
                               v-model="disciplina.descricao" v-validate="'required'" id="descricao" data-vv-name="descricao">
                        <span v-show="errors.has('descricao')">{{ errors.first('descricao') }}</span>

                    </div>
                    <app-buttons path="/disciplinas"></app-buttons>

                </form>
            </div>
        </div>
    </div>
</template>
<script>
    import PageTitle from '../layout/PageTitle.vue';
    import Buttons from '../layout/Buttons.vue';
    import { Api } from '../../api';

    export default {
        data() {
            return {
                disciplina: {
                    descricao: ''
                }
            }
        },
        components: {
            appPageTitle: PageTitle,
            appButtons: Buttons
        },
        methods: {
            save() {
                Api.save({
                    model:'disciplina',
                    data:this.disciplina,
                    validator:this.$validator,
                    path:'/disciplinas'
                });
            }
        },
        created() {
            if(!isNaN(this.$route.params.id)) {
                Api.load(this.$route.params.id, 'disciplina', (response) => {
                    this.disciplina = response.data;
                })
            }
        }
    }
</script>

<style scope></style>