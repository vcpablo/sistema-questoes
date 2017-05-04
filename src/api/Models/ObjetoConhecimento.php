<?php

namespace Api\Models;
use Api\Collections\CollectionFactory;

class ObjetoConhecimento extends Base {
    private $grandeTema = null;

    public function getGrandeTema() {
        return $this->grandeTema;
    }
    
    public function setGrandeTema($grandeTema) {
        return $this->grandeTema = $grandeTema;
    }
}