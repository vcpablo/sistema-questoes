(function(){
    new Sandbox('$ajax', '$dom', '$util', '$filter', function($ajax, $dom, $util, $filter) {
    var id = $util.getUrlParams()[1];

    var salvarHabilidade = function salvarHabilidade(event) {
        event.preventDefault();

        var habilidade = {
            descricao: $('#descricao').val(),
            objeto_conhecimento: $('#ObjetoConhecimento').val(),
            competencia: $('#competencia').val()
        };

        if(id) {
            habilidade.id = id;
            promise = $ajax.put('habilidade', habilidade);
        } else {
            promise = $ajax.post('habilidade', habilidade);
        }

        promise.done(function(data) {
            $util.redirectWithMessage({message:data, location:'habilidades', type:'success'});
        }).fail(function(data) {
            $util.showErrorMessage(data.responseJSON);
        });
    };

    var listarObjetosConhecimento = function listarObjetosConhecimento(objetosConhecimento) {
        $dom.populateCombobox('#ObjetoConhecimento', objetosConhecimento, { value: 'id', text: 'descricao' });
    };

    var listarGrandesTemas = function listarGrandesTemas(grandesTemas) {
        $dom.populateCombobox('#GrandeTema', grandesTemas, { value: 'id', text: 'descricao' });
    };

    var alterarDisciplina = function alterarDisciplina() {
        $ajax.query('grande_tema', { disciplina: $(this).val() }).done(listarGrandesTemas);
        $('#GrandeTema').val('');
        $('#ObjetoConhecimento').val('');
        $('#competencia').val('');
    };

    var alterarGrandeTema = function alterarGrandeTema() {
        $ajax.query('objeto_conhecimento', { grande_tema: $(this).val() }).done(listarObjetosConhecimento);
        $('#ObjetoConhecimento').val('');
        $('#competencia').val('');
    };

    var alterarTipo = function alterarTipo() {
        if ($(this).val() == 'DISCURSIVA') {
            $('#itens').parent().hide();
        } else {
            $('#itens').parent().show();
        }
    };

    var alterarObjetoConhecimento = function alterarObjetoConhecimento() {

        $('#competencia').val('').attr('disabled',false);
    }

    $('#Disciplina').change(alterarDisciplina);
    $('#GrandeTema').change(alterarGrandeTema);
    $('#ObjetoConhecimento').change(alterarObjetoConhecimento);
    $('input[name=tipo]').change(alterarTipo);
    $('#form_habilidade').on('submit', salvarHabilidade);

  

    var listarHabilidade = function listarHabilidade(habilidade) {
        $('#descricao').val(habilidade.descricao);
        // $('#' + habilidade.competencia.toLowerCase()).attr('checked', true);

        if (habilidade.objetoConhecimento) {
            $('#Disciplina').val(habilidade.objetoConhecimento.grandeTema.disciplina.id);

            var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $('#Disciplina').val() }).done(function(data) {
                listarGrandesTemas(data);
                $('#GrandeTema').val(habilidade.objetoConhecimento.grandeTema.id);

                var promessaObjetosConhecimento = $ajax.query('objeto_conhecimento', { grande_tema: $('#GrandeTema').val() }).done(function(data) {
                    listarObjetosConhecimento(data);
                    $('#ObjetoConhecimento').val(habilidade.objetoConhecimento.id);
                    $('#competencia').val(habilidade.competencia    ).attr('disabled',false);
                })
            });

        }
    };

    var listarDisciplinas = function listarDisciplinas(disciplinas) {
        $dom.populateCombobox('#Disciplina', disciplinas, { value: 'id', text: 'descricao' });
    };

    var promessaDisciplinas = $ajax.get('disciplina').done(listarDisciplinas);

    if (!isNaN(id)) {
        var promessaHabilidade = $ajax.get('habilidade', id).done();

        promessaDisciplinas.done(function(data) {
            listarDisciplinas(data);
            promessaHabilidade.done(listarHabilidade);
        });
    } else {
        promessaDisciplinas.done(listarDisciplinas);
    }



})


})();