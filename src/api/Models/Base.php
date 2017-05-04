<?php

namespace Api\Models;

use Api\Library\Util;

class Base {
    private $id = 0;
    private $descricao = '';
    private $status = 1;

    public function __construct($options = null, $utf = false) {
        if(is_object($options)) {
            $options = (array) $options;
        }

        if (is_array($options)) {
            $this->set($options, $utf);
        }
    }

    public function __set($key, $value) {
        $method = 'set' . Util::dashesToCamelCase($key);

        if (method_exists($this, $method)) {
            $this->$method($value);
        }
    }

    public function __get($key) {
        $method = 'get' . Util::dashesToCamelCase($key);

        if (method_exists($this, $method)) {
            return $this->$method();
        }
    }

    public function set(array $options, $utf = false) {
        $methods = get_class_methods($this);
        foreach ($options as $chave => $value) {
            $method = 'set' . Util::dashesToCamelCase($chave);
            
            if (in_array($method, $methods)) {
                if (gettype($value) == 'string')
                    if ($utf)
                        $value = utf8_decode($value);
                $this->$method($value);
            }
        }
        return $this;
    }
    

   public function getId() {
        return $this->id;
    }
    
    public function setId($id) {
        $this->id = $id;
    }

    public function getDescricao() {
        return $this->descricao;
    }
    
    public function setDescricao($descricao) {
        $this->descricao = trim(preg_replace('/\\\\r|\\\\n|\\\\t/i', ' ', $descricao));
    }

    public function getStatus() {
        return $this->status;
    }
    
    public function setStatus($status) {
        $this->status = $status;
    }

    
}