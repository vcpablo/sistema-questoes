<?php

namespace Api\Models;
use Api\Collections\CollectionFactory;

class GrandeTema extends Base {
    private $disciplina = null;

    public function getDisciplina() {
        return $this->disciplina;
    }
    
    public function setDisciplina($disciplina) {
        return $this->disciplina = $disciplina;
    }
}