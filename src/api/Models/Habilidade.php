<?php

namespace Api\Models;
use Api\Collections\CollectionFactory;

class Habilidade extends Base {
    private $objetoConhecimento = null;
    private $competencia = 0;

    public function getObjetoConhecimento() {
        return $this->objetoConhecimento;
    }
    
    public function setObjetoConhecimento($objetoConhecimento) {
        return $this->objetoConhecimento = $objetoConhecimento;
    }

    public function getCompetencia() {
        return $this->competencia;
    }
    
    public function setCompetencia($competencia) {
        return $this->competencia = $competencia;
    }

}