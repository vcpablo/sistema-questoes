<?php

namespace Api\Controllers;

use Api\Models\ObjetoConhecimento;
use Api\Collections\CollectionFactory;
use Api\Library\Util;


class ObjetoConhecimentoController{

	private $objetoConhecimentoCollection;

	public function __construct() {
		$this->objetoConhecimentoCollection = CollectionFactory::createObjetoConhecimentoCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : Util::get();

		return $this->objetoConhecimentoCollection->get($params);
	}

	public function insert() {
		$objetoConhecimento = new ObjetoConhecimento(Util::post());
		$this->objetoConhecimentoCollection->insert($objetoConhecimento);
		return 'Objeto de conhecimento criado com sucesso';
	}

	public function update() {
		$objetoConhecimento = new ObjetoConhecimento(Util::post());
		$this->objetoConhecimentoCollection->update($objetoConhecimento);
		return 'Objeto de conhecimento atualizado com sucesso';
	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->objetoConhecimentoCollection->delete($id[0]);
			return 'Objeto de conhecimento removido com sucesso';
		}
	}

}