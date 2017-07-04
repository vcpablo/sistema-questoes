(function() {
    new Sandbox('$ajax', '$dom', '$util', function($ajax, $dom, $util) {

        $util.checkMessages();



        var listarDisciplinas = function listarDisciplinas(disciplinas) {
            $dom.populateTable('#disciplinas', disciplinas, { descricao: 'Descrição', 'status': 'Status' }, 'disciplina')
        };

        $ajax.get('disciplina').done(listarDisciplinas);

    });
})();
