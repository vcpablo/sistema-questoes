<?php

namespace Api\Controllers;

use Api\Collections\CollectionFactory;
use Api\Library\Util;
use Api\Models\Habilidade;
use Api\Models\Item;


class HabilidadeController{

	private $habilidadeCollection;

	public function __construct() {
		$this->habilidadeCollection = CollectionFactory::createHabilidadeCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : Util::get();

		$result = $this->habilidadeCollection->get($params);
		// print_r($result);
		return $result;
	}

	public function insert() {
		$habilidade = new Habilidade(Util::post());
		
		$this->habilidadeCollection->insert($habilidade);
		return 'Habilidade criada com sucesso';
	}

	public function update() {
		$habilidade = new Habilidade(Util::post());

		$this->habilidadeCollection->update($habilidade);
		return 'Habilidade atualizada com sucesso';
		
	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->habilidadeCollection->delete($id[0]);
			return 'Habilidade removida com sucesso';
		}
	}

}