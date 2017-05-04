(function() {
    new Sandbox('$ajax', '$dom', '$util', '$filter', function($ajax, $dom, $util, $filter) {
    var _tiposQuestoes, _disciplinas, _grandesTemas, _objetosConhecimento, _habilidades;
    var _disciplinasFiltered, _grandesTemasFiltered, _objetosConhecimentoFiltered, _habilidadesFiltered;

    var id = $util.getUrlParams()[1];

    /*var salvarHabilidade = function salvarHabilidade(event) {
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
    };*/

    // var listarObjetosConhecimento = function listarObjetosConhecimento(objetosConhecimento) {
    //     objetosConhecimento.unshift({id:'TODOS', descricao:'Todos'});
    //     $dom.populateCombobox('#objeto_conhecimento', objetosConhecimento, { value: 'id', text: 'descricao' });
    // };

    // var listarGrandesTemas = function listarGrandesTemas(grandesTemas) {
    //     grandesTemas.unshift({id:'TODOS', descricao:'Todos'});
    //     $dom.populateCheckbox('#grandes_temas', grandesTemas, { value: 'id', text: 'descricao' }, 'grande_tema');
    // };

    // var listarHabilidades = function listarHabilidades(habilidades, id) {
    //     var html = '';

    //     if (habilidades.length > 0) {
    //         html += '<table class="table table-striped"><tr><th>Habilidade</th><th>Competência</th></tr>';
    //         var checked;

    //         $(habilidades).each(function(index, habilidade) {
    //             checked = (habilidade.id == id) ? ' checked ' : '';
    //             html += '<tr data-competencia="' + habilidade.competencia + '">' +
    //                 '<td class="text-justify">' +
    //                 '<input type="radio" name="habilidade" id="habilidade_' + habilidade.id + '" value="' + habilidade.id + '"  ' + checked + ' > ' +
    //                 habilidade.descricao +
    //                 '</td>' +
    //                 '<td>' + habilidade.competencia + '</td></tr>'
    //         });

    //         html += '</table>';
    //         $('#filtro_competencia').removeClass('hidden');
    //     } else {
    //         html += '<p>Nenhuma habilidade encontrada</p>';
    //     }

    //     $('#habilidades').html(html).parent().removeClass('hidden');

    //     // $dom.populateRadio('#habilidades', habilidades, { value: 'id', text: 'descricao' }, 'habilidade');
    // };

    // var alterarDisciplina = function alterarDisciplina() {
    //     console.log($(this).val())
    //     $ajax.query('grande_tema', { disciplina: $(this).val() }).done(listarGrandesTemas);
    // };

    // var alterarGrandeTema = function alterarGrandeTema() {
    //     var grandeTema = $(this).val();

    //     if(grandeTema == 'TODOS') {
    //         $ajax.query('objeto_conhecimento', { disciplina: $('#disciplina').val() }).done(listarObjetosConhecimento);
    //     } else {
    //         $ajax.query('objeto_conhecimento', { grande_tema: grandeTema}).done(listarObjetosConhecimento);
    //     }
    // };

    // var alterarObjetoConhecimento = function alterarObjetoConhecimento() {
    //     var objetoConhecimento = $(this).val();

    //     if(objetoConhecimento == 'TODOS') {
    //         if($('#grande_tema').val() !== 'TODOS') {
    //             $ajax.query('habilidade', { grande_tema: $('#grande_tema').val() }).done(listarHabilidades);
    //         } else {
    //             $ajax.query('habilidade', { grande_tema: $('#grande_tema').val() }).done(listarHabilidades);
    //         }
    //     } else {
    //         $ajax.query('habilidade', { objeto_conhecimento: $('#objeto_conhecimento').val() }).done(listarHabilidades);
    //     }

    //     $('#competencia').val('');
    // };

    // var alterarTipo = function alterarTipo() {
    //     if ($(this).val() == 'DISSERTATIVA') {
    //         if (!$('#configuracao_itens').hasClass('hidden')) {
    //             $('#configuracao_itens').addClass('hidden');
    //         }
    //     } else {
    //         console.log($(this).val())
    //         $('#configuracao_itens').removeClass('hidden');
    //     }
    // };

    var alterarCompetencia = function alterarCompetencia() {
        var that = $(this);


        $('[data-competencia]').each(function(index, el) {


            if (that.val() == 'TODAS') {
                $(this).removeClass('hidden');
            } else {
                if ($(this).data('competencia') !== that.val()) {
                    $(this).addClass('hidden');
                } else {
                    $(this).removeClass('hidden');
                }
            }

        });
    };


    // $('#grande_tema').change(alterarGrandeTema);
    // $('#tipo').change(alterarTipo);
    // $('#objeto_conhecimento').change(alterarObjetoConhecimento);
    // $('#competencia').change(alterarCompetencia);

    // $('#form_questao').on('submit', salvarHabilidade);



    // var listarQuestao = function listarQuestao(questao) {
    //     $('#tipo').val(questao.tipo).trigger('change');
    //     $('#descricao').val(questao.descricao);


    //     // $('#' + questao.toLowerCase()).attr('checked', true);
    //     // $('#' + questao.tipo.toLowerCase()).attr('checked', true);

    //     $dom.populateTable('#itens', questao.itens, { descricao: 'Descrição', 'correto|boolean': 'Correto', status: 'Status' }, 'item', '#modal_item');

    //     if (questao.habilidade) {
    //         $('#disciplina').val(questao.habilidade.objetoConhecimento.grandeTema.disciplina.id);

    //         var promessaGrandesTemas = $ajax.query('grande_tema', { disciplina: $('#disciplina').val() }).done(function(data) {
    //             listarGrandesTemas(data);
    //             $('#grande_tema').val(questao.habilidade.objetoConhecimento.grandeTema.id);

    //             var promessaObjetosConhecimento = $ajax.query('objeto_conhecimento', { grande_tema: $('#grande_tema').val() }).done(function(data) {
    //                 listarObjetosConhecimento(data);
    //                 $('#objeto_conhecimento').val(questao.habilidade.objetoConhecimento.id);
    //                 $('#filtro_competencia').removeClass('hidden');
    //                 $('#selecione_habilidade').removeClass('hidden');

    //                 var promessaHabilidades = $ajax.query('habilidade', { objeto_conhecimento: $('#objeto_conhecimento').val() }).done(function(data) {
    //                     listarHabilidades(data, questao.habilidade.id);
    //                     $('#competencia').val(questao.habilidade.competencia);

    //                 });
    //             });
    //         });

    //     }
    // };

    var filter = function(inputName) {
        return $('input[name=' + inputName + ']').filter(function(index, input) {
            return $(input).is(':checked');
        }).map(function(index, input) {
            return (!isNaN(parseInt($(input).val()))) ? parseInt($(input).val()) : $(input).val();
        }).toArray();
    };

    var carregarTiposQuestoes = function carregarTiposQuestoes() {
        var tiposQuestoes = [
            { id: 1, descricao: 'Dissertativa' },
            { id: 2, descricao: 'Múltipla Escolha' },
            { id: 3, descricao: 'Verdadeiro / Falso' }
        ];

        $dom.populateCheckbox('#tipos_questoes', tiposQuestoes, { value: 'id', text: 'descricao' }, 'tipo');
    };

    var listarDisciplinas = function listarDisciplinas(disciplinas) {
        // disciplinas.unshift({id:'TODOS', descricao:'Todas'});

        _disciplinas = disciplinas;

        $dom.populateCheckbox('#disciplinas', disciplinas, { value: 'id', text: 'descricao' }, 'disciplina');
    };

    var carregarDisciplinas = function carregarDisciplinas() {

        $ajax.get('disciplina').done(listarDisciplinas);
    };

    var listarGrandesTemas = function listarGrandesTemas(grandesTemas) {

        _grandesTemas = grandesTemas;

        var disciplinasSelecionadas = filter('disciplina');

        if (disciplinasSelecionadas.length > 0) {
            _grandesTemasFiltered = _grandesTemas.filter(function(grandeTema) {
                return disciplinasSelecionadas.indexOf(grandeTema.disciplina.id) !== -1;
            });
        } else {
            _grandesTemasFiltered = _grandesTemas;
        }


        $dom.populateCheckbox('#grandes_temas', _grandesTemasFiltered, { value: 'id', text: 'descricao' }, 'grande_tema');
    };

    var carregarGrandesTemas = function carregarGrandesTemas() {
        $ajax.get('grande_tema').done(listarGrandesTemas);
    };

    var listarObjetosConhecimento = function listarObjetosConhecimento(objetosConhecimento) {

        _objetosConhecimento = objetosConhecimento;

        var grandesTemasSelecionados = filter('grande_tema');

        if (grandesTemasSelecionados.length > 0) {
            _objetosConhecimentoFiltered = _objetosConhecimento.filter(function(objetoConhecimento) {
                return grandesTemasSelecionados.indexOf(objetoConhecimento.grandeTema.id) !== -1;
            });
        } else {
            _objetosConhecimentoFiltered = _objetosConhecimento;
        }

        $dom.populateCheckbox('#objetos_conhecimento', _objetosConhecimentoFiltered, { value: 'id', text: 'descricao' }, 'objeto_conhecimento');
    };

    var carregarObjetosConhecimento = function carregarObjetosConhecimento() {
        $ajax.get('objeto_conhecimento').done(listarObjetosConhecimento);
    };

    var carregarCometencias = function carregarCometencias() {
        var competencias = [
            { id: 1, descricao: 'Compreender' },
            { id: 2, descricao: 'Observar' },
            { id: 3, descricao: 'Realizar' }
        ];

        $dom.populateCheckbox('#competencias', competencias, { value: 'id', text: 'descricao' }, 'competencia');
    };

    var listarHabilidades = function listarHabilidades(habilidades) {

        _habilidades = habilidades;

        var objetosConhecimentoSelecionados = filter('objeto_conhecimento');

        var competenciasSelecionadas = filter('competencia');


        _habilidadesFiltered = _habilidades.filter(function(habilidade) {
            var objetoConhecimentoFiltro = true,
                competenciaFiltro = true;

            if (objetosConhecimentoSelecionados.length > 0) {
                objetoConhecimentoFiltro = objetosConhecimentoSelecionados.indexOf(habilidade.objetoConhecimento.id) !== -1
            }


            if (competenciasSelecionadas.length > 0) {
                var competencia = 1;
                if(habilidade.competencia == 'OBSERVAR') {
                    competencia = 2;
                } else if(habilidade.competencia == 'REALIZAR')  {
                    competencia = 3;
                }

                competenciaFiltro = competenciasSelecionadas.indexOf(competencia) !== -1
            }

            return objetoConhecimentoFiltro && competenciaFiltro;
        });


        $dom.populateCheckbox('#habilidades', _habilidadesFiltered, { value: 'id', text: 'descricao' }, 'habilidade');
    };

    var carregarHabilidades = function carregarHabilidades() {
        $ajax.get('habilidade').done(listarHabilidades);
    };

    var listarQuestoes = function listarQuestoes(questoes) {

        _questoes = questoes;

        var habilidadesSelecionadas = filter('habilidade');
        var tiposSelecionados = filter('tipo');


        _questoesFiltered = _questoes.filter(function(questao) {
            var habilidadeFiltro = true,
                tipoFiltro = true;

            if (habilidadesSelecionadas.length > 0) {
                habilidadeFiltro = habilidadesSelecionadas.indexOf(questao.habilidade.id) !== -1;
            }

            if (tiposSelecionados.length > 0) {
                var tipo = 1;
                if(questao.tipo == 'MULTIPLA_ESCOLHA') {
                    tipo = 2;
                } else if(questao.tipo == 'VERDADEIRO_FALSO') {
                    tipo = 3;
                }

                tipoFiltro = tiposSelecionados.indexOf(tipo) !== -1;
            }

            return habilidadeFiltro && tipoFiltro;
        });


        $dom.populateCheckbox('#questoes', _questoesFiltered, { value: 'id', text: 'descricao' }, 'questao');
    };

    var carregarQuestoes = function carregarQuestoes() {
        $ajax.get('questao').done(listarQuestoes);
    };

    var recomecar = function recomecar() {
        $('#tipos_questoes').html('Todos');
        $('#disciplinas').html('Todos');
        $('#grandes_temas').html('Todos');
        $('#objetos_conhecimento').html('Todos');
        $('#competencias').html('Todos');
        $('#habilidades').html('Todos');
        $('#questoes').html('Todos');
    };

    var listarTeste = function listarTeste(questoes) {
        var html = '', itens;

        if(questoes.length == 0) {
            html += '<h2>Nenhuma questão encontrada</h2>';
        } else {
            console.log(questoes)
            $(questoes).each(function(index, questao) {
                html += '<div class="row">' + 
                    '<div class="col-sm-12">' +
                        '<label>' + questao.descricao + '</label>' +
                    '</div></div><div class="row"><div class="col-sm-12">';

                if(questao.tipo !== 'DISSERTATIVA') {
                    html += '<p>';

                    if(questao.tipo == 'MULTIPLA_ESCOLHA') {
                        html += 'Marque a alternativa correta abaixo:';
                    } else if(questao.tipo == 'VERDADEIRO_FALSO') {
                        html += 'Marque (V) para Verdadeiro e (F) para falso:';
                    }

                    html += '</p>';

                    $(questao.itens).each(function(index, item) {
                        html += '<p>' + ((questao.tipo == 'MULTIPLA_ESCOLHA') ? (index + 1) + ') ' : '(  ) ' ) + item.descricao + '</p>'
                    });

                } else {
                    html += '<p>_________________________________________________________</p>';
                    html += '<p>_________________________________________________________</p>';
                    html += '<p>_________________________________________________________</p>';
                }
                html += '</div></div>';
            });
        }

        $('#teste_gerado').removeClass('hidden');
        $('#teste_questoes').html(html).removeClass('hidden');
    };

    var gerarTeste = function gerarTeste(event) {
        event.preventDefault();
        _tiposQuestoes = filter('tipo').join(',');
        _disciplinas = filter('disciplina').join(',');
        _grandesTemas = filter('grande_tema').join(',');
        _objetosConhecimento = filter('objeto_conhecimento').join(',');
        _competencias = filter('competencia').join(',');
        _habilidades = filter('habilidade').join(',');
        _questoes = filter('questao').join(',');


        $ajax.post('teste', {
            tipos_questoes:_tiposQuestoes,
            disciplinas:_disciplinas,
            grandes_temas:_grandesTemas,
            objetos_conhecimento:_objetosConhecimento,
            competencias:_competencias,
            habilidades:_habilidades,
            questoes:_questoes,
            numero_questoes:$('#numero_questoes').val()
        }).done(listarTeste);
        
    };





    $('#definir_tipos_questoes').click(carregarTiposQuestoes);
    $('#definir_disciplinas').click(carregarDisciplinas);
    $('#definir_grandes_temas').click(carregarGrandesTemas);
    $('#definir_objetos_conhecimento').click(carregarObjetosConhecimento);
    $('#definir_competencias').click(carregarCometencias);
    $('#definir_habilidades').click(carregarHabilidades);
    $('#definir_questoes').click(carregarQuestoes);

    $('#btn_recomecar').click(recomecar);
    $('#form_teste').submit(gerarTeste);


});

})();