(function(){
    new Sandbox('$ajax', '$dom', '$util', '$filter', function($ajax, $dom, $util, $filter) {
    var id = $util.getUrlParams()[1];

    var salvarHabilidade = function salvarHabilidade(event) {
        event.preventDefault();

        var questao = {
            descricao: $('#descricao').val(),
            tipo: $('#tipo').val(),
            habilidade: $('input[name=habilidade]').val(),
            itens: []
        };

        var json;

        $('#itens tbody tr').each(function(index, item) {
            json = $(this).find('.btn-primary').data('json');
            if (json !== undefined) {
                questao.itens.push(json);
            }
        });

        if (id) {
            questao.id = id;
            promise = $ajax.put('questao', questao);
        } else {
            promise = $ajax.post('questao', questao);
        }

        promise.done(function(data) {
            
            $util.redirectWithMessage({ message: data, location: 'questoes', type: 'success' });
        }).fail(function(data) {
            $util.showErrorMessage(data.responseJSON);
        });
    };

    var listarObjetosConhecimento = function listarObjetosConhecimento(objetosConhecimento) {
        $dom.populateCombobox('#objeto_conhecimento', objetosConhecimento, { value: 'id', text: 'descricao' });
    };

    var listarGrandesTemas = function listarGrandesTemas(grandesTemas) {
        $dom.populateCombobox('#grande_tema', grandesTemas, { value: 'id', text: 'descricao' });
    };

    var listarHabilidades = function listarHabilidades(habilidades, id) {
        var html = '';

        if(habilidades.length > 0) {
            html += '<table class="table table-striped"><tr><th>Habilidade</th><th>Competência</th></tr>';
            var checked;

            $(habilidades).each(function(index, habilidade) {
                checked = (habilidade.id == id) ? ' checked ' : '';
                html += '<tr data-competencia="' + habilidade.competencia + '">' + 
                '<td class="text-justify">' + 
                    '<input type="radio" name="habilidade" id="habilidade_' + habilidade.id + '" value="' + habilidade.id + '"  ' + checked + ' > ' + 
                    habilidade.descricao + 
                '</td>' + 
                '<td>' +  habilidade.competencia + '</td></tr>'
            });

            html += '</table>';
            $('#filtro_competencia').removeClass('hidden');
        } else {
            html += '<p>Nenhuma habilidade encontrada</p>';
        }

        $('#habilidades').html(html).parent().removeClass('hidden');
    };

    var alterarDisciplina = function alterarDisciplina() {
        var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $(this).val() }).done(listarGrandesTemas);
    };

    var alterarGrandeTema = function alterarGrandeTema() {
        var promessaObjetosConhecimentos = $ajax.query('objeto_conhecimento', { grande_tema: $(this).val() }).done(listarObjetosConhecimento);
    };

    var alterarObjetoConhecimento = function alterarObjetoConhecimento() {
        $ajax.query('habilidade', { objeto_conhecimento: $('#objeto_conhecimento').val() }).done(listarHabilidades);
        $('#competencia').val('');
    };

    var alterarTipo = function alterarTipo() {
        if ($(this).val() == 'DISSERTATIVA') {
            if (!$('#configuracao_itens').hasClass('hidden')) {
                $('#configuracao_itens').addClass('hidden');
            }
        } else {
            console.log($(this).val())
            $('#configuracao_itens').removeClass('hidden');
        }
    };

    var alterarCompetencia = function alterarCompetencia() {
        var that = $(this);
            

        $('[data-competencia]').each(function(index, el) {

            
            if(that.val() == 'TODAS') {
                $(this).removeClass('hidden');
            } else {
                if($(this).data('competencia') !== that.val()) {
                    $(this).addClass('hidden');
                } else {
                    $(this).removeClass('hidden');
                }
            }

        });
    };

    $('#disciplina').change(alterarDisciplina);
    $('#grande_tema').change(alterarGrandeTema);
    $('#tipo').change(alterarTipo);
    $('#objeto_conhecimento').change(alterarObjetoConhecimento);
    $('#competencia').change(alterarCompetencia);

    $('#form_questao').on('submit', salvarHabilidade);



    var listarQuestao = function listarQuestao(questao) {
        $('#tipo').val(questao.tipo).trigger('change');
        $('#descricao').val(questao.descricao);

        $dom.populateTable('#itens', questao.itens, { descricao: 'Descrição', 'correto|boolean': 'Correto', status: 'Status' }, 'item', '#modal_item');

        if (questao.habilidade) {
            $('#disciplina').val(questao.habilidade.objetoConhecimento.grandeTema.disciplina.id);

            var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $('#disciplina').val() }).done(function(data) {
                listarGrandesTemas(data);
                $('#grande_tema').val(questao.habilidade.objetoConhecimento.grandeTema.id);

                var promessaObjetosConhecimento = $ajax.query('objeto_conhecimento', { grande_tema: $('#grande_tema').val() }).done(function(data) {
                    listarObjetosConhecimento(data);
                    $('#objeto_conhecimento').val(questao.habilidade.objetoConhecimento.id);
                    $('#filtro_competencia').removeClass('hidden');
                    $('#selecione_habilidade').removeClass('hidden');

                    var promessaHabilidades = $ajax.query('habilidade', { objeto_conhecimento: $('#objeto_conhecimento').val() }).done(function(data) {
                        listarHabilidades(data, questao.habilidade.id);
                        $('#competencia').val(questao.habilidade.competencia);

                    });
                });
            });

        }
    };

    var listarDisciplinas = function listarDisciplinas(disciplinas) {
        $dom.populateCombobox('#disciplina', disciplinas, { value: 'id', text: 'descricao' });
    };

    var promessaDisciplinas = $ajax.get('disciplina').done(listarDisciplinas);

    if (!isNaN(id)) {
        var promessaQuestao = $ajax.get('questao', id).done();

        promessaDisciplinas.done(function(data) {
            listarDisciplinas(data);
        });
        promessaQuestao.done(listarQuestao);
    } else {
        promessaDisciplinas.done(listarDisciplinas);
    }

    var onHideModalItem = function onHideModalItem() {
        $('#item_id').val('');
        $('#item_descricao').val('');
        $('#nao').prop('checked', true);
        $('#form_item').unbind('submit');
    };

    $('#modal_item').on('hide.bs.modal', onHideModalItem);

    var onShowModalItem = function onShowModalItem(event) {
        var modal = $(this);
        var item = ($(event.relatedTarget).data('json')) ? $(event.relatedTarget).data('json') : { id: $util.guid(), new: true };
        console.log(item);


        var listarItem = function listarItem(item) {
            $('#item_id').val(item.id);
            $('#item_descricao').val(item.descricao);

            if (item.correto) {
                $('#sim').prop('checked', true);
            } else {
                $('#nao').prop('checked', true);
            }
        };

        listarItem(item);

        var salvarItem = function salvarItem(event) {
            event.preventDefault();

            // Edição
            var element = document.getElementById('item' + item.id.toString());
            item.descricao = $('#item_descricao').val();
            item.correto = $('#sim').prop('checked');

            var html = '';

            if ($('#itens tbody tr').length == 0) {
                $dom.populateTable('#itens', [], { descricao: 'Descrição', 'correto|boolean': 'Correto', status: 'Status' }, 'item', '#modal_item');
            }

            console.log($('input[name=item_correto]').val())
            if (!element) {
                html += `<tr id="item` + item.id + `"> 
                    <td>` + $('#item_descricao').val() + `</td>
                    <td>` + $filter.boolean($('#sim').is(':checked')) + `</td>
                    <td>` + $filter.status(1) + `</td>
                    <td> <div class="form-group"> <a data-toggle="modal" data-json=\'` + JSON.stringify(item) + `\' data-target="#modal_item" data-new="true" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-edit"></i> Editar</a>
                        <button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#modal_remove" data-modal="true" data-model="item" data-id="` + item.id + `" data-description="` + $('#item_descricao').val() + `"><i class="glyphicon glyphicon-remove"></i> Excluir </button> </div> </td>
                 </tr>`;

                $('#itens table tbody').append(html);

            } else {
                html += `
                    <td>` + $('#item_descricao').val() + `</td>
                    <td>` + $filter.boolean($('#sim').is(':checked')) + `</td>
                    <td>` + $filter.status(1) + `</td>
                    <td> <div class="form-group"> <a data-toggle="modal" data-json=\'` + JSON.stringify(item) + `\' data-target="#modal_item"  class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-edit"></i> Editar</a>
                        <button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#modal_remove" data-modal="true" data-model="item" data-id="` + item.id + `" data-description="` + $('#item_descricao').val() + `"><i class="glyphicon glyphicon-remove"></i> Excluir </button> </div> </td>
                 `;

                $('#item' + item.id).html(html);
            }


            $('#modal_item').modal('hide');
        }

        $('#form_item').bind('submit', salvarItem);

    };
    $('#modal_item').on('show.bs.modal', onShowModalItem);



});

})();