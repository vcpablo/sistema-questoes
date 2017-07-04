(function(){
	new Sandbox('$util', function($util) {
	$('#clock').html($util.clock());
	
	setInterval(function() {
		$('#clock').html($util.clock());
	},1000);
});
})();