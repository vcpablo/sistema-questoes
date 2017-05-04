(function(){
	new Sandbox('$ajax', '$dom','$util', function($ajax, $dom, $util) {
	$util.checkMessages();

	var done = function(data, textStatus, jqXHR) {
    	$dom.populateTable('#grandes_temas', data, {descricao:'Descrição', status:'Status', 'disciplina.descricao':'Disciplina'}, 'grande_tema');
    };
    var fail = function(jqXHR, textStatus, errorThrown) {
    	console.log(jqXHR, textStatus, errorThrown)
    };

    $ajax.get('grande_tema').done(done).fail(fail);

});
})();