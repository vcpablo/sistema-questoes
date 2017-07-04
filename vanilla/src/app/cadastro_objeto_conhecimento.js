(function(){
    new Sandbox(['$ajax', '$dom', '$util'], function($ajax, $dom, $util) {


    var salvarObjetoConhecimento = function salvarObjetoConhecimento() {
        var objetoConhecimento = { 
            descricao: $('#descricao').val(),
            disciplina: $('#disciplina').val(),
            grande_tema: $('#grande_tema').val()
        };

        var promise;

        if (id) {
            objetoConhecimento.id = id;
            promise = $ajax.put('objeto_conhecimento', objetoConhecimento);
        } else {
            promise = $ajax.post('objeto_conhecimento', objetoConhecimento);
        }

        promise.done(function(data) {
            $util.redirectWithMessage({ message: data, location: 'objetos_conhecimento', type: 'success' });
        }).fail(function(data) {
            $util.showErrorMessage(data.responseJSON);
        });
    };


    var listarGrandesTemas = function listarGrandesTemas(grandesTemas) {
        $dom.populateCombobox('#grande_tema', grandesTemas, { value: 'id', text: 'descricao' });
    };

    var alterarDisciplina = function alterarDisciplina() {
        var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $(this).val() }).done(listarGrandesTemas);
    };

    $('#disciplina').change(alterarDisciplina);

    var id = $util.getUrlParams()[1];

    var listarObjetoConhecimento = function listarObjetoConhecimento(objetoConhecimento) {
        $('#descricao').val(objetoConhecimento.descricao);

        if (objetoConhecimento.grandeTema) {
            $('#disciplina').val(objetoConhecimento.grandeTema.disciplina.id);

            var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $('#disciplina').val() }).done(function(data) {
                listarGrandesTemas(data);
                $('#grande_tema').val(objetoConhecimento.grandeTema.id);
            });

        }
    };

    var listarDisciplinas = function listarDisciplinas(disciplinas) {
        $dom.populateCombobox('#disciplina', disciplinas, { value: 'id', text: 'descricao' });
    };

    var promessaDisciplinas = $ajax.get('disciplina').done(listarDisciplinas);

    if (!isNaN(id)) {
        var promessaObjetoConhecimento = $ajax.get('objeto_conhecimento', id).done();

        promessaDisciplinas.done(function(data) {
            listarDisciplinas(data);
            promessaObjetoConhecimento.done(listarObjetoConhecimento);
        });
    } else {
        promessaDisciplinas.done(listarDisciplinas);
    }

    $('#form_objeto_conhecimento').submit(function(event) {
        event.preventDefault();
        salvarObjetoConhecimento();
    });

});

})();