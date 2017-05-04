<?php

namespace Api\Models;
use Api\Collections\CollectionFactory;

class Questao extends Base {
    private $habilidade = null;
    private $tipo = null;
    private $itens = array();

    public function getHabilidade() {
        return $this->habilidade;
    }
    
    public function setHabilidade($habilidade) {
        return $this->habilidade = $habilidade;
    }

    public function getTipo() {
        return $this->tipo;
    }
    
    public function setTipo($tipo) {
        return $this->tipo = $tipo;
    }

    public function getItens() {
        return $this->itens;
    }
    
    public function setItens($itens) {
        return $this->itens = $itens;
    }

}