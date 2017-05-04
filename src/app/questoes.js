(function(){
	new Sandbox('$ajax', '$dom', '$util', function($ajax, $dom, $util) {
	$util.checkMessages();
	var listarQuestoes = function listarQuestoes(questoes) {
    	$dom.populateTable('#questoes', questoes, {descricao:'Descrição', 'tipo|questionType':'Tipo', 'habilidade.descricao':'Habilidade', 'status':'Status'}, 'questao')
	};


    $ajax.get('questao').done(listarQuestoes);

});
})();