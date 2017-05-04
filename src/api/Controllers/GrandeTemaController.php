<?php

namespace Api\Controllers;

use Api\Models\GrandeTema;
use Api\Collections\CollectionFactory;
use Api\Library\Util;



class GrandeTemaController{

	private $grandeTemaCollection;

	public function __construct() {
		$this->grandeTemaCollection = CollectionFactory::createGrandeTemaCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);	
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : Util::get();


		return $this->grandeTemaCollection->get($params);
	}

	public function insert() {
		$grandeTema = new GrandeTema(Util::post());
		$this->grandeTemaCollection->insert($grandeTema);
		return 'Grande tema criado com sucesso';
	}

	public function update() {
		$grandeTema = new GrandeTema(Util::post());
		$this->grandeTemaCollection->update($grandeTema);
		return 'Grande tema atualizado com sucesso';
	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->grandeTemaCollection->delete($id[0]);
			return 'Grande tema removido com sucesso';
		}
	}

}