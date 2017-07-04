<?php

namespace Api\Collections;

interface ICollection {
	 const _PK = 'id';
	
	public function get(array $params = array());

	public function insert(&$model);

	public function update($model);
	
	public function delete($id);
}