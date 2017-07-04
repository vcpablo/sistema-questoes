<?php
require 'vendor/autoload.php';

use Api\Library\Util;
use \phputil\JSON;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header("Content-Type: application/json");

set_include_path(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'controllers' . PATH_SEPARATOR . get_include_path());

spl_autoload_register(function ($class) {

    $classname = (strtoupper(substr(PHP_OS, 0, 3)) !== 'WIN') ? str_replace('\\', '/', $class . '.php') : $class . '.php';
    $filepath = dirname(__FILE__) . DIRECTORY_SEPARATOR .  '%folder%' . DIRECTORY_SEPARATOR . $classname;    

    $isCollection = file_exists(str_replace("%folder%", "Collections", $filepath));
    $isController = file_exists(str_replace("%folder%", "Controllers", $filepath));
    $isException = file_exists(str_replace("%folder%", "Exceptions", $filepath));
    $isModel = file_exists(str_replace("%folder%", "Models", $filepath));
    $isViewModel = file_exists(str_replace("%folder%", "ViewModels", $filepath));
    $isLibrary = file_exists(str_replace("%folder%", "Library", $filepath));

    if ( $isCollection || $isController || $isException || $isModel || $isViewModel || $isLibrary ) {
        require_once($classname);
    } else {
        Util::responseStatus(500);
        echo json_encode('Class not found:' . $filepath);
    }
});

$paths = array( 'disciplina', 'grande_tema', 'objeto_conhecimento', 'habilidade', 'questao', 'item', 'teste');

if(Util::isValidRequest(Util::server('PATH_INFO'), $paths)) {

    preg_match('/' . implode( '|', $paths ) . '/', str_replace('/', ',', Util::server('PATH_INFO')), $module);
    preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $params);

    if(count($module) > 0) {
        $namespace = 'Api\\Controllers\\' . Util::dashesToCamelCase($module[0], true) . 'Controller';
        

        $instance = new $namespace();


        try {
            $statusCode = 200;

            

            switch(Util::server('REQUEST_METHOD')) {
                case "GET":
                    // $data = (count($params) > 0) ? $instance->get($params) : $instance->get();
                    $data = $instance->get();
                    break;
                case "POST":
                    if(count($params) == 0) {
                        $data = $instance->insert();
                        $statusCode = 201;
                    } else {
                        $data = $instance->update();
                    }
                    break;
                case "DELETE":
                    
                    if(count($params) > 0) {
                        $data = $instance->delete();
                    }
                    break;
            }

            Util::responseStatus($statusCode);

            if(isset($data)) {
                echo JSON::encode($data);
            }

        } catch (Exception $e) {
            $statusCode = $e->getCode();
            Util::responseStatus(($statusCode == 0) ? 400 : $statusCode);
            echo $e->getMessage();
        }
    } else {
        Util::responseStatus(404);
    }
}  else {
        Util::responseStatus(404);
    }
