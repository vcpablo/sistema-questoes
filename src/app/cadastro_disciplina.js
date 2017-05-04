(function() {
    new Sandbox(['$ajax', '$dom', '$util'], function($ajax, $dom, $util) {
        

        /* Cria / atualiza a disciplina */
        var salvarDisciplina = function salvarDisciplina(id) {
            // Cria um objeto com os dados da disciplina
            var disciplina = { descricao: $('#descricao').val() };

            // Declara a variável que armazenará a promessa
            var promise;

            // Caso exista um id (edição)
            if (id) {
                disciplina.id = id;
                promise = $ajax.put('disciplina', disciplina);
            } 
            // Caso não exista um id (criação)
            else {
                promise = $ajax.post('disciplina', disciplina);
            }

            // Se a promessa for bem sucedida
            promise.done(function(data) {
                // Redireciona para a página de listagem de disciplinas e armazena variável com mensagem a ser exibida
                $util.redirectWithMessage({ message: data, location: 'disciplinas', type: 'success' });
            }).fail(function(data) {
                // Exibe mensagem de erro
                $util.showErrorMessage(data.responseJSON);
            });
        };

        /* Preenche os campos com os dados da disciplina */
        var listarDisciplina = function listarDisciplina(disciplina) {
            $('#descricao').val(disciplina.descricao)
        };

        // Tenta obter o id do registro vindo da URL (em caso de edição)
        var id = $util.getUrlParams()[1];

        // Caso haja um id na url (edição)
        if (!isNaN(id)) {
            $ajax.get('disciplina', id).done(listarDisciplina);
        }

        // Cria um listener no formuláro para salvar a disciplina ao ser submetido
        $('#form_disciplina').submit(function(event) {
            event.preventDefault();
            salvarDisciplina(id);
        });
    });

})();
