<?php 

    $pathInfo = (isset($_SERVER['PATH_INFO'])) ? $_SERVER['PATH_INFO'] : 'home';

	$paths = array( 'disciplinas', 'cadastro_disciplina', 'grandes_temas',  'cadastro_grande_tema', 'objetos_conhecimento', 'cadastro_objeto_conhecimento', 'habilidades', 'cadastro_habilidade' ,'questoes', 'cadastro_questao',  'home', 'gerar_teste');

	preg_match('/' . implode( '|', $paths ) . '/', str_replace('/', ',', $pathInfo), $page);
    preg_match('/[0-9]+.*/', $pathInfo, $params);

    $pagesDir = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'partials' . DIRECTORY_SEPARATOR;
    $baseUrl = 'http://localhost:3000/';


?>

<!DOCTYPE html>
<html dir="ltr" lang="pt-br">

<head>
	<!-- Meta Tags -->
	<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
	<meta name="description" content="Programação de Clientes Web" />
	<meta name="author" content="Pablo Veiga" />
	<base href="<?= $baseUrl; ?>"/>
	<!-- Page Title -->
	<title>Programação de Clientes Web</title>

    <link rel="stylesheet" type="text/css" href="/bower_components/bootstrap/dist/css/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="/bower_components/bootstrap/dist/css/bootstrap-theme.css">
    <link rel="stylesheet" type="text/css" href="public/css/style.css">
    <script type="text/javascript" src="./bower_components/jquery/dist/jquery.js"></script>
    
    <script type="text/javascript" src="./app/lib/Sandbox.js"></script>
</head>
<body>

	<?php include($pagesDir . 'header.html');  ?>

	<div class="container">
    	<?php

	    	$page = (count($page) > 0) ? $page[0] . '.html' : 'home.html';
	    	$file = $pagesDir . $page;

	    	include((file_exists($file)) ? $file : $pagesDir . '404.html' );
		?>
	</div>

	<div class="modal fade" id="modal_remove" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Confirmar Exclusão</h4>
            </div>
            <form id="form_modal_remove">
                <div class="modal-body">
                    <input type="hidden" name="modal_remove_id" id="modal_remove_id" />
                    <p id="modal_remove_message" class="form-group">
                    </p>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">
                        <i class="glyphicon glyphicon-remove"></i> Não
                    </button>
                    <button type="submit" class="btn btn-success">
                        <i class="glyphicon glyphicon-ok"></i>  Sim
                    </button>
                </div>
            </form>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
</body>


<script type="text/javascript" src="./bower_components/bootstrap/dist/js/bootstrap.js"></script>


<script type="text/javascript" src="./app/main.js"></script>

</html>
