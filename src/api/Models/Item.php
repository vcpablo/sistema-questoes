<?php

namespace Api\Models;
use Api\Collections\CollectionFactory;

class Item extends Base {
	private $correto = 0;
	private $questao = 0;

	public function getQuestao() {
	    return $this->questao;
	}
	
	public function setQuestao($questao) {
	    return $this->questao = $questao;
	}

	public function getCorreto() {
	    return $this->correto;
	}
	
	public function setCorreto($correto) {
		$correto = ($correto === "true" || $correto == 1) ? 1 : 0;
	    return $this->correto = $correto;
	}
}