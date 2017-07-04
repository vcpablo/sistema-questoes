import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import VeeValidate from 'vee-validate';

import { routes } from './routes';

/* Configurações do vee-validate */
const dictionary = {
    en: {
        messages: {
            required: function () {
                return "Este campo é obrigatório"
            }
        }
    }
};

VeeValidate.Validator.updateDictionary(dictionary);

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VeeValidate);

export const router = new VueRouter({ routes, mode: 'history' });

var _vue = new Vue({
  el: '#app',
  render: h => h(App),
  router
});