<?php

namespace Api\Models;

interface IModel {
	public function getId();
    
    public function setId($id);

    public function getDescricao();
    
    public function setDescricao($descricao);

    public function getStatus();
    
    public function setStatus($status);
}