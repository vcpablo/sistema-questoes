<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">

            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">CEFET</a>
            </div>


            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li><router-link to="/disciplinas">Disciplinas</router-link></li>
                    <li><router-link to="/grandes_temas">Grandes Temas</router-link></li>
                    <li><router-link to="/objetos_conhecimento">Objetos de Conhecimento</router-link></li>
                    <li><router-link to="/habilidades">Habilidades</router-link></li>
                    <li><router-link to="/questoes">Questões</router-link></li>
                    <li><router-link to="/gerador_testes">Gerador de Testes</router-link></li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
    export default {}
</script>

<style scope></style>