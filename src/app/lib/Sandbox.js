function Sandbox() {
    // parse the arguments    
    var args = Array.prototype.slice.call(arguments),
        callback = args.pop(),
        modules = (args[0] && typeof args[0] === 'string') ? args : args[0];

    // add properties for all sandboxes
    this.version = '1.0.0';
    this.name = 'Matriz Biologia';
    this.baseUrl = 'api/';

    // ensure constructor call
    if (!(this instanceof Sandbox)) {
        return new Sandbox(modules, callback);
    }

    // add all modules if no modules were passed
    if (!modules) {
        modules = [];
        for (var i in Sandbox.modules) {
            modules.push(i);
        }
    }

    // initialize and add all modules to the sandbox
    var moduleInstances = modules.map(function(m) {
        return Sandbox.modules[m]();
    });

    // execute the code
    callback.apply(this, moduleInstances);
}



Sandbox.Utils = {
    buttons: function(data, model, modal) {
        var id = data.id;
        var description = data.descricao;

        var buttons = '';

        buttons += '<div class="form-group">';

        if (!modal) {
            buttons += '<a href="cadastro_' + model + '/' + id + '" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-edit"></i> Editar</a> ';
            buttons += '<button type="button"  class="btn btn-sm btn-danger" data-toggle="modal" data-target="#modal_remove" data-model="' + model + '" data-id="' + id + '" data-description="' + description + '"><i class="glyphicon glyphicon-remove"></i> Excluir </button>';
        } else {
            buttons += '<a data-toggle="modal" data-json=\'' + JSON.stringify(data) + '\' data-target="' + modal + '" data-id="' + id + '" class="btn btn-primary btn-sm"><i class="glyphicon glyphicon-edit"></i> Editar</a> ';
            buttons += '<button type="button" data-modal="true" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#modal_remove" data-model="' + model + '" data-id="' + id + '" data-description="' + description + '"><i class="glyphicon glyphicon-remove"></i> Excluir </button>';
        }

        buttons += 
            '</div>'

        return buttons;
    }
};

Sandbox.modules = {

    $util: function() {
        var util = this;
        return {
            clock: function clock() {

                var currentTime = new Date()
                var horas = currentTime.getHours();
                var minutos = currentTime.getMinutes();
                var segundos = currentTime.getSeconds(); 
                var dia = currentTime.getDate(); 
                var mes = currentTime.getMonth();
                var ano = currentTime.getFullYear();  
                var Dia = currentTime.getDay(); 
                var Mes = currentTime.getUTCMonth();

                if (minutos < 10)
                    minutos = "0" + minutos
                if (segundos < 10)
                    segundos = "0" + segundos
                if (dia < 10)
                    dia = "0" + dia
                if (mes < 10)
                    mes = "0" + mes

                arrayDia = new Array();
                   arrayDia[0] = "Domingo";
                   arrayDia[1] = "Segunda-Feira";
                   arrayDia[2] = "Terça-Feira";
                   arrayDia[3] = "Quarta-Feira";
                   arrayDia[4] = "Quinta-Feira";
                   arrayDia[5] = "Sexta-Feira";
                   arrayDia[6] = "Sabado";

                var arrayMes = new Array();
                   arrayMes[0] = "Janeiro";
                   arrayMes[1] = "Fevereiro";
                   arrayMes[2] = "Março";      
                   arrayMes[3] = "Abril";
                   arrayMes[4] = "Maio";
                   arrayMes[5] = "Junho";
                   arrayMes[6] = "Julho";
                   arrayMes[7] = "Agosto";
                   arrayMes[8] = "Setembro";
                   arrayMes[9] = "Outubro";
                   arrayMes[10] = "Novembro";
                   arrayMes[11] = "Dezembro";

                   return dia + " de " + arrayMes[Mes] + " de " + ano + ' ' + horas + ":" + minutos + ":" + segundos;

            },
            guid: function guid() {
                 return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' +
                        Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + '-' + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);;
            },
            redirectWithMessage: function redirectWithMessage(options) {
                var storage = Sandbox.modules.$storage();
                storage.set(options.type + '_message', options.message);
                window.location.href = options.location;
            },
            getUrlParams: function getUrlParams() {
                return window.location.pathname.replace('/', '').split('/');
            },
            objectToQueryString: function objectToQueryString(obj, prefix) {
                var str = [];
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p,
                            v = obj[p];

                        str.push(typeof v == "object" ?
                            Sandbox.modules.$util().objectToQueryString(v, k) :
                            encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                }
                return str.join("&");
            },
            checkMessages: function checkMessages() {
                var storage = Sandbox.modules.$storage();

                var successMessage = storage.get('success_message');
                if (null !== successMessage) {
                    this.showSuccessMessage(successMessage);
                }
                storage.remove('success_message');

                var errorMessage = storage.get('error_message');
                if (null !== errorMessage) {
                    this.showErrorMessage(errorMessage);
                }
                storage.remove('error_message');


            },
            showErrorMessage: function showErrorMessage(message) {
                console.log(message)
                if (typeof message != 'string') {
                    message = message.join('<br>');
                }


                var element = $('#error').html(message).parent();
                element.show()[0].scrollIntoView();

                setTimeout(function() {
                    element.fadeOut('slow');
                }, 3000);
            },
            showSuccessMessage: function showSuccessMessage(message) {
                if (typeof message != 'string') {
                    message = message.join('<br>');
                }

                var element = $('#success').html(message).parent();
                element.show();

                setTimeout(function() {
                    element.fadeOut('slow');
                }, 3000);
            }
        }
    },
    $filter: function() {
        return {
            status: function(value) {
                return (value == 1) ? 'Ativo' : 'Inativo';
            },
            undefined: function(value) {
                return (value == undefined) ? '-' : value;
            },
            boolean: function(value) {
                console.log(value)
                return (value == true || value == '1') ? 'Sim' : 'Não';
            }, 
            questionType: function(value) {
                switch(value) {
                    case 'DISSERTATIVA': return 'Dissertativa';
                    case 'MULTIPLA_ESCOLHA': return 'Múltipla Escolha';
                    case 'VERDADEIRO_FALSO': return 'Verdadeiro / Falso';
                }
            }
        }
    },
    $storage: function() {
        return {
            set: function(key, value) {
                if (typeof value !== 'string') {
                    value = JSON.stringify(value);
                }

                window.localStorage.setItem(key, value);
            },
            get: function(key) {
                return window.localStorage.getItem(key);
            },
            remove: function(key) {
                window.localStorage.removeItem(key);
            },
            clear: function() {
                window.localStorage.clear();
            }
        }
    },
    $ajax: function() {
        var _baseUrl = 'api/';
        var _defaultOptions = {
            dataType: 'json'
        };

        return {
            get: function(url, id, options) {
                if (id) {
                    url += '/' + id;
                }

                options = $.extend({ url: _baseUrl + url, method: 'GET' }, $.extend(_defaultOptions, options));

                return $.ajax(options);
            },
            post: function(url, data, options) {
                options = $.extend({ url: _baseUrl + url, method: 'POST', data: data }, options);

                return $.ajax(options);
            },
            put: function(url, data, options) {
                url += '/' + data.id;
                options = $.extend({ url: _baseUrl + url, method: 'POST', data: data }, options);

                return $.ajax(options);
            },
            delete: function(url, id, options) {
                url += '/' + id;
                options = $.extend({ url: _baseUrl + url, method: 'DELETE' }, options);

                return $.ajax(options);
            },
            query: function(url, params, options) {
                if (Object.keys(params).length > 0) {
                    url += '?' + Sandbox.modules.$util().objectToQueryString(params);
                }
                console.log(url);

                options = $.extend({ url: _baseUrl + url, method: 'GET' }, options);

                return $.ajax(options);
            }



        }
    },
    $dom: function() {
        return {
            populateRadio: function populateRadio(target, data, fields, name) {
                var html = '';

                if (data.length > 0) {
                    $(data).each(function(index, value) {
                        html += '<div class="radio"><label>';
                        html += '<input type="radio" ' + ((index == 0) ? 'checked="checked"': '') + ' name="' + name + '" id="' + name + '_' + index + '" value="' + value[fields.value] + '"/>' + value[fields.text];
                        html += '</label></div>';
                    });

                    $(target).html(html);
                } else {
                    html += '<div>Nenhuma opção encontrada</div>';
                    $(target).html(html);
                }

            },
             populateCheckbox: function populateCheckbox(target, data, fields, name) {
                var html = '';
                
                if (data.length > 0) {
                    $(data).each(function(index, value) {
                        html += '<div class="checkbox"><label>';
                        html += '<input type="checkbox" name="' + name + '" id="' + name + '_' + index + '" value="' + value[fields.value] + '"> ' + value[fields.text];//<input type="radio" ' + ((index == 0) ? 'checked="checked"': '') + ' name="' + name + '" id="' + name + '_' + index + '" value="' + value[fields.value] + '"/>' + value[fields.text];
                        html += '</label></div>';
                    });

                    $(target).html(html);
                } else {
                    html += '<div>Nenhuma opção encontrada</div>';
                    $(target).html(html);
                }

            },
            populateCombobox: function populateCombobox(target, data, fields, text) {
                var html = '';
                text = (undefined === text) ? 'Selecione uma opção' : text;
                if (data.length > 0) {
                    html += '<option value="">' + text + '</option>';
                    $(data).each(function(index, value) {
                        html += '<option value="' + value[fields.value] + '">' + value[fields.text] + '</option>';
                    });
                    $(target).html(html).attr('disabled', false);
                } else {
                    html += '<option value="">Nenhuma opção encontrada</option>';
                    $(target).html(html).attr('disabled', 'disabled');
                }

            },


            populateTable: function populateTable(target, data, fields, model, modal) {
                $.extend(fields, { options: 'Opções' });

                var filter = Sandbox.modules.$filter();
                var header = '';
                var content = '';
                var value, split;
                var table = '<table class="table table-striped">';

                for (var i in fields) {
                    header += '<th>' + fields[i] + '</th>';
                }
                
                if (data.length > 0) {


                    for (var i in data) {
                        content += '<tr id="' + model + data[i].id.toString() + '">';
                        data[i].options = Sandbox.Utils.buttons(data[i], model, modal);

                        for (var j in fields) {
                            split = j.split('.');

                            if (split.length > 1) {
                                value = filter['undefined'](data[i][split[0]][split[1]]);
                            } else {
                                split = j.split('|');

                                if (split.length > 1) {
                                    value = filter[split[1]](data[i][split[0]]);
                                } else {
                                    value = (filter[j]) ? filter[j](data[i][j]) : data[i][j];
                                }
                            }
                            content += '<td>' + value + '</td>'
                        }

                        content += '</tr>';
                    }

                    header = '<tr>' + header + '</tr>';

                }

                table += header + content;
                table += '</table>'
                $(target).html(table);
                //  else {
                //     $(target).html('No entry found');
                // }
            },
            populateNotFound: function(message) {
                var html = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    ' <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                    message;

                $('form').hide();
                $('.error').html(html).show();
            }
        }
    }
};
