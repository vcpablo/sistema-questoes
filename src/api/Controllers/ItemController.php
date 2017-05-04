<?php

namespace Api\Controllers;

use Api\Collections\CollectionFactory;
use Api\Library\Util;


class ItemController{

	private $itemCollection;

	public function __construct() {
		$this->itemCollection = CollectionFactory::createItemCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : array();

		return $this->itemCollection->get($params);
	}

	public function insert() {

	}

	public function update() {

	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->itemCollection->delete($id[0]);
			return 'Item removido com sucesso';
		}
	}

}