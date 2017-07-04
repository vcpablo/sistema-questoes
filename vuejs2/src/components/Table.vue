<template>
    <table class="table">

        <tr>

            <th v-for="(header, key) in options.headers">
                <span v-if="key != 'buttons'">
                    {{ header.title }}
                </span>
                <span v-if="key == 'buttons'">
                    Opções
                </span>


            </th>
        </tr>
        <tr v-for="(item, index) in data">
            <td v-for="(header, key) in options.headers">

                <span v-if="key != 'buttons'">
                    <span v-if="header.value">
                        {{ header.value(item[key], item) }}
                    </span>
                    <span v-if="!header.value">
                        {{ item[key] }}
                    </span>
                </span>
                <div v-if="key == 'buttons'" class="form-group">
                    <button v-for="button in options.headers.buttons" :class="button.class" @click="button.action(item, index)">
                        <i :class="button.icon"></i> {{ button.title }}
                    </button>
                </div>
            </td>
        </tr>
    </table>
</template>
<script>
    import { Api } from '../api';
    import { router } from '../main';
    import toastr from 'toastr';
    import SmartNotification from '../assets/smartnotification';

    export default {
        props:['options', 'data'],
        methods: {
            update(item) {
                router.push(this.options.path + '/' + item.id);
            },
            remove(item, index) {
                let options = {
                    title: '<i class="fa fa-trash-o"></i> Confirmar exclusão',
                    content: 'Deseja realmente remover o registro "' + item.descricao  + '"?',
                    buttons: '[Cancelar][Sim]'
                };

                let onButtonPressed = (buttonPressed) => {
                    if(buttonPressed == 'Sim') {
                        Api.remove(this.options.model, item.id, (response) => {
                            toastr.options.positionClass = 'toast-bottom-right';
                            toastr.success('Registro removido com sucesso');
                            this.data.splice(index, 1);
                        });
                    }
                };

                $.SmartMessageBox(options, onButtonPressed);

            }
        },
        created() {
            if(undefined === this.options.headers.buttons) {
                this.options.headers.buttons = [
                    { title: 'Alterar', class:'btn btn-primary btn-sm',  icon:'fa fa-edit', action: this.update },
                    { title: 'Excluir', class:'btn btn-danger btn-sm', icon:'fa fa-trash-o', action: this.remove }
                ];
            }
        }
    }
</script>

<style scoped>
    p {
        color: red;
    }
</style>