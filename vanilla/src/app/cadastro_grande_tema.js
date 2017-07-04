(function() {
    new Sandbox(['$ajax', '$dom', '$util'], function($ajax, $dom, $util) {

        var id = $util.getUrlParams()[1];

        // Cria / atualiza o grande tema
        var salvarGranteTema = function salvarGranteTema(id) {
            // Cria um objeto com os dados do grande tema
            var grandeTema = {
                descricao: $('#descricao').val(),
                disciplina: $('#disciplina').val()
            };

            // Declara a variável que armazenará a promessa
            var promise;

            // Caso exista um id (edição);
            if (id) {
                grandeTema.id = id;
                // Atualiza o grande tema
                promise = $ajax.put('grande_tema', grandeTema);
            } 
            // Caso não exista um id (criação)
            else {
                // Cria o grande tema
                promise = $ajax.post('grande_tema', grandeTema);
            }

            // Se a promessa for bem sucedida
            promise.done(function(data) {
                // Redireciona para a página de listagem de grandes temas e armazena a mensagem a ser exibida
                $util.redirectWithMessage({ message: data, location: 'grandes_temas', type: 'success' });
            }).fail(function(data) {
                // Exibe mensagem de erro
                $util.showErrorMessage(data.responseJSON);
            });
        };

        // Preenche os campos do formulário com os dados do grande tema
        var listarGrandeTema = function listarGrandeTema(grandeTema) {
            $('#descricao').val(grandeTema.descricao);

            if (grandeTema.disciplina) {
                $('#disciplina').val(grandeTema.disciplina.id);
            }
        };

        // Preenche o dropdown de disciplinas
        var listarDisciplinas = function listarDisciplinas(disciplinas) {
            $dom.populateCombobox('#disciplina', disciplinas, { value: 'id', text: 'descricao' });
        };

        // Obtém as disciplinas para seleção
        var promessaDisciplinas = $ajax.get('disciplina').done(listarDisciplinas);

        // Casa exista um id (edição)
        if (!isNaN(id)) {
            // Carrega os dados do grande tema
            var promsessaGrandeTema = $ajax.get('grande_tema', id);

            // Carrega as disciplinas para seleção
            promessaDisciplinas.done(function(data) {
                // Preenche o dropdown de seleção de disciplinas
                listarDisciplinas(data);
                promsessaGrandeTema.done(listarGrandeTema);
            });
        } else {
            // Preenche o dropdown de seleção de disciplinas
            promessaDisciplinas.done(listarDisciplinas);
        }

        // Cria um listener no formulário para salvar os dados do grande tema
        $('#form_grande_tema').submit(function(event) {
            event.preventDefault();
            salvarGranteTema(id);
        });



    });

})();
