<?php

namespace Api\Library;

class Util {
	const HTTP_STATUS = array(
		200 => 'Ok',
		201 => 'Created',
		204 => 'No Content',
		400 => 'Bad Request',
		404 => 'Not Found',
		500 => 'Internal Server Error'
	);

	public static function responseStatus($statusCode, $statusMessage = false, $data = null) {
		if(!$statusMessage) {
			$statusMessage = self::HTTP_STATUS[$statusCode];
		}

		header($_SERVER['SERVER_PROTOCOL'] . ' ' . $statusCode . ' ' . $statusMessage);
	}

	public static function isValidRequest($path, $paths) {
		if(is_array($paths)) {
			$paths = implode('|', $paths);
		}

		return 1 === preg_match( '/^\/(' . $paths . ')(\/[0-9]+.*)?$/', $path );
	}

	public static function dashesToCamelCase($string, $capitalizeFirstCharacter = true) {
	    $str = str_replace(' ', '', ucwords(str_replace('_', ' ', $string)));
	    if (!$capitalizeFirstCharacter) {
	        $str[0] = strtolower($str[0]);
	    }
	    return $str;
	}

	public static function isInput() {
        $input = file_get_contents('php://input');
        return strlen($input) > 0;
    }

     /**
     * Return a value from the $_SERVER array using some options.
     * @see {@code value()}.
     */
    static function server($key = null, $useTrim = true, $encodeAll = false) {
        if(is_null($key))
            return self::all($_SERVER, $useTrim, $encodeAll);
        return self::value($_SERVER, $key, $useTrim, $encodeAll);
    }

       static function input($key = null, $useTrim = true, $encodeAll = false) {
        $input = (array)json_decode( mb_convert_encoding(file_get_contents('php://input'), null));
        if(is_null($key))
            return self::all($input, $useTrim, $encodeAll);
        return self::value($input, $key, $useTrim, $encodeAll);
    }

     /**
     * Returns a value from an array using some options.
     *
     * @param array		the target array.
     * @param key		the array key.
     * @param useTrim	option to use trim() in the value.
     * @param encodeAll	option to encode all the characters, using
     * 					{@code htmlentities()}, or not, using
     * 					{@code htmlspecialchars()}. Remember that the latter
     * 					replaces only <, >, ", ', and & and it is recommended
     * 					for	most cases, since the accents are kept.
     * @return			the encoded value or null if the key is not found.
     */
    private static function value(array $array, $key, $useTrim, $encodeAll) {
        if (!isset($array[$key])) {
            return null;
        }
        
        $content = ( gettype($array[$key]) == 'string' && $useTrim ) ? trim($array[$key]) : $array[$key];
        if ($encodeAll) {
            return htmlentities($content, ENT_COMPAT, 'UTF-8');
        }
        return $content;
    }
    private static function all(array $array, $useTrim = true, $encodeAll = true) {
        
        foreach($array as $key => $value) {
            if(gettype($value) == 'string') {
                $array[$key] = ($useTrim) ? trim($value) : $value;
                // $array[$key] = ($encodeAll) ? htmlentities($value, ENT_COMPAT, 'UTF-8') : htmlspecialchars($value, ENT_COMPAT, 'UTF-8');
            }
            
        }
        return $array;
    }

     /**
     * Return a value from the $_GET array using some options.
     * @see {@code value()}.
     */
    static function get($key = null, $useTrim = true, $encodeAll = false) {
        if(is_null($key)) {
            return self::all($_GET, $key, $useTrim, $encodeAll);
        }
        return self::value($_GET, $key, $useTrim, $encodeAll);
    }

    /**
     * Return a value from the $_GET array using some options.
     * @see {@code value()}.
     */
    static function post($key = null, $useTrim = true, $encodeAll = false) {
        if(self::isInput() && ($_SERVER['HTTP_ORIGIN'] == 'http://localhost:8080' || $_SERVER['HTTP_ORIGIN'] == 'http://localhost:8081') ) {
            return self::input($key, $useTrim, $encodeAll);
        }

        if(is_null($key)) {
            return self::all($_POST, $key, $useTrim, $encodeAll);
        }
        return self::value($_POST, $key, $useTrim, $encodeAll);
    }

    static function filter($value, $filter) {
        if($filter == 'questionType') {
            switch($value) {
                case 'MULTIPLA_ESCOLHA':
                    return 'Múltipla Escolha';
                case 'VERDADEIRO_FALSO':
                    return 'Verdadeiro / Falso';
                default:
                    return 'Dissertativa';
            }
        }
    }


    
}