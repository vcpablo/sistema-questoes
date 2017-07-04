<template>
  <div id="app">
      <app-header></app-header>
      <div class="container">
          <router-view></router-view>
      </div>
  </div>
</template>

<script>
import Header from './components/layout/Header.vue';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Matriz de Conhecimento'
    }
  },
  components: {
      appHeader: Header
  }
}
</script>
