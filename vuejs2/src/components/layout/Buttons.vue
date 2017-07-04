<template>
    <div class="form-group">
        <button type="button" class="btn btn-default pull-left" @click="to(path)">
            <i class="fa fa-arrow-left"></i> Voltar
        </button>
        <button type="submit" class="btn btn-success pull-right">
            <i class="fa fa-save"></i> Salvar
        </button>
    </div>
</template>
<script>
    export default {
        props:['path'],
        methods: {
            to(path) {
                this.$router.push(path);
            }
        }
    }
</script>

<style scope></style>