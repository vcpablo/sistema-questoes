<template>
    <div>
        <select class="form-control"
                :value="value"
                :disabled="disabled"

                @change="change">
            <option value="">{{ placeholder }}</option>
            <option v-for="option in data" :value="option.id">
                {{ option.descricao }}
            </option>
        </select>

    </div>
</template>
<script>
    export default {
        props: ['id', 'data', 'value', 'required', 'onChange', 'disabled'],
        methods: {
            change($event) {
                this.$emit('input', $event.target.value);

                if(typeof this.onChange == 'function') {
                    this.onChange($event.target.value, this.data);
                }
            }
        },
        computed: {
            placeholder: function() {
            }
        }
    }
</script>

<style scope></style>










