(function(){
	new Sandbox('$ajax', '$dom', '$util', function($ajax, $dom, $util) {
	$util.checkMessages();
	var listarHabilidades = function listarHabilidades(habilidades) {
    	$dom.populateTable('#habilidades', habilidades, 
    		{descricao:'Descrição', 'competencia':'Competência', 'status':'Status','objetoConhecimento.descricao':'Objeto de Conhecimento'}, 'habilidade')
	};


    $ajax.get('habilidade').done(listarHabilidades);

});
})();