<?php

namespace Api\Controllers;

use Api\Models\Disciplina;
use Api\Collections\CollectionFactory;
use Api\Library\Util;


class DisciplinaController{

	private $disciplinaCollection;

	public function __construct() {
		$this->disciplinaCollection = CollectionFactory::createDisciplinaCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : Util::get();

		return $this->disciplinaCollection->get($params);
	}

	public function insert() {
		$disciplina = new Disciplina(Util::post());
		$this->disciplinaCollection->insert($disciplina);
		return 'Disciplina criada com sucesso';
	}

	public function update() {
		$disciplina = new Disciplina(Util::post());
		$this->disciplinaCollection->update($disciplina);
		return 'Disciplina atualizada com sucesso';
	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->disciplinaCollection->delete($id[0]);
			return 'Disciplina removida com sucesso';
		}

	}

}