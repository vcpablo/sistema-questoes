(function(){
	new Sandbox('$ajax', '$dom', '$util',function($ajax, $dom, $util) {
	$util.checkMessages();
	var done = function(data, textStatus, jqXHR) {
    	$dom.populateTable('#objetos_conhecimento', data, {descricao:'Descrição', status:'Status', 'grandeTema.descricao':'Grande Tema'}, 'objeto_conhecimento');
    };
    var fail = function(jqXHR, textStatus, errorThrown) {
    	console.log(jqXHR, textStatus, errorThrown)
    };

    $ajax.get('objeto_conhecimento').done(done).fail(fail);

});
})();