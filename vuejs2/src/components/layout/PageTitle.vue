<template>
    <div class="row">

        <div class="col-sm-12">
            <h1>{{ title }}</h1>
            <hr>
        </div>

        <div class="col-sm-12 form-group" v-if="index == 'true' ">
            <button class="btn btn-primary" @click="to(path)">
                <i class="fa fa-plus"></i> Adicionar {{ name }}
            </button>
        </div>


    </div>
</template>
<script>
    import { router } from '../../main.js';
    export default {
        props: {
            name: { type: String, default: ''},
            title: { type: String, },
            path: { type: String, default:'' },
            index: { type: String, default: 'true' }
        },
        methods: {
            to(path) {
                router.push(path);
            }
        }
    }
</script>

<style scope></style>