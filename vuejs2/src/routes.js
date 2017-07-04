/**
 * Created by Pablo on 09/06/2017.
 */
import Disciplinas from './components/partials/Disciplinas.vue';
import CadastroDisciplina from './components/partials/CadastroDisciplina.vue';
import GrandesTemas from './components/partials/GrandesTemas.vue';
import CadastroGrandeTema from './components/partials/CadastroGrandeTema.vue';
import ObjetosConhecimento from './components/partials/ObjetosConhecimento.vue';
import CadastroObjetoConhecimento from './components/partials/CadastroObjetoConhecimento.vue';
import Habilidades from './components/partials/Habilidades.vue';
import CadastroHabilidade from './components/partials/CadastroHabilidade.vue';
import Questoes from './components/partials/Questoes.vue';
import CadastroQuestao from './components/partials/CadastroQuestao.vue';
import GeradorTestes from './components/partials/GeradorTestes.vue';

export const routes = [
    { path: '/disciplinas', component: Disciplinas },
    { path: '/disciplinas/:action?/:id?', component: CadastroDisciplina },
    { path: '/grandes_temas', component: GrandesTemas },
    { path: '/grandes_temas/:action?/:id?', component: CadastroGrandeTema },
    { path: '/objetos_conhecimento', component: ObjetosConhecimento },
    { path: '/objetos_conhecimento/:action?/:id?', component: CadastroObjetoConhecimento },
    { path: '/habilidades', component: Habilidades },
    { path: '/habilidades/:action?/:id?', component: CadastroHabilidade },
    { path: '/questoes', component: Questoes },
    { path: '/questoes/:action?/:id?', component: CadastroQuestao },
    { path: '/gerador_testes', component: GeradorTestes }
];
