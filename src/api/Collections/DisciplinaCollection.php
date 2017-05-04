<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\Disciplina;

use \phputil\PDOBuilder;
use \phputil\JSON;
use \phputil\PDOWrapper;


class DisciplinaCollection implements ICollection {
	const _TABLE = 'disciplina';
    private $_softDelete = true;

	private $pdow;

	public function __construct(PDOWrapper $pdow) {
		$this->pdow = $pdow;
	}


	public function get(array $params = array()) {
        $status = (isset($params["status"])) ? $params["status"] : 1;
        
        
        if (isset($params["id"])) {
            return $this->getById($params["id"], $status);
        }
        
        return $this->getAll($status);
    }

    private function getAll($status) {
        $sql = "SELECT * FROM " . self::_TABLE;
        
        $params = array();
        
        
        $sql .= " WHERE status = :status ORDER BY __date DESC";
        $params["status"] = $status;
        
        try {
            return $this->pdow->fetchObjects($sql, $params, 'Api\Models\Disciplina');
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting all disciplinas." . $e->getMessage(), 400, $e);
        }
    }
    
    
    private function getById($id, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE " . self::_PK . " = :id";
        $params = array("id" => $id);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }


        try {
            $disciplinas = $this->pdow->fetchObjects($sql, $params, 'Api\Models\Disciplina');
            return (count($disciplinas) > 0) ? $disciplinas[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting disciplina by id." . $e->getMessage(), 400, $e);
        }
        
    }


	public function insert(&$disciplina) {
        $this->validate($disciplina);
		$sql = "INSERT INTO " . self::_TABLE . "(descricao, status) VALUES (:descricao, :status)";
        $params = array(
            'descricao' => $disciplina->getDescricao(),
            'status' => $disciplina->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
            $disciplina->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting disciplina.", 400, $e);
        }
	}

	public function update($disciplina) {
        $this->validate($disciplina);
		$sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
        	'id' => $disciplina->getId(),
            'descricao' => $disciplina->getDescricao(),
            'status' => $disciplina->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating disciplina.", 400, $e);
        }
	}
	
	public function delete($id) {
		try {
            if($this->_softDelete) {
                $sql = "UPDATE " . self::_TABLE . " SET status = :status WHERE " . self::_PK . " = :id";   
                $params = array(
                    "id" => $id,
                    "status" => 0);
                $this->pdow->execute($sql, $params);
            } else {
                $this->pdow->deleteWithId( $id, self::_TABLE, self::_PK );
            }
        } catch (Exception $e) {
            throw new CollectionException("Error removing disciplina.", 400, $e);
        }

	}

    private function validate($disciplina) {
        $errors = array();

        if(strlen($disciplina->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }

        return true;
    }

}