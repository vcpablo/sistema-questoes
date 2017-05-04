<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\GrandeTema;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;
use \phputil\JSON;


class GrandeTemaCollection implements ICollection {

	const _TABLE = 'grande_tema';
    private $_softDelete = true;

	private $pdow;
	private $disciplinaCollection;

	public function __construct(PDOWrapper $pdow, DisciplinaCollection $disciplinaCollection) {
		$this->pdow = $pdow;
		$this->disciplinaCollection = $disciplinaCollection;
	}

	public function convert($row) {
        $grandeTema = new GrandeTema($row);
        $grandeTema->setDisciplina($this->disciplinaCollection->get(array('id' => $row['disciplina_id'])));
        return $grandeTema;
    } 

	public function get(array $params = array()) {
        
        $status = (isset($params["status"])) ? $params["status"] : 1;
        
        
        if (isset($params["id"])) {
            return $this->getById($params["id"], $status);
        } 

        if(isset($params['disciplina'])) {
            return $this->getByDisciplina($params["disciplina"], $status);
        }
        
        return $this->getAll($status);
    }

    private function getAll($status) {
        $sql = "SELECT * FROM " . self::_TABLE;
        
        $params = array();
        
        
        $sql .= " WHERE status = :status ORDER BY __date DESC";
        $params["status"] = $status;
        
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting all grandes temas." . $e->getMessage(), 400, $e);
        }
    }

     private function getByDisciplina($disciplina, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE disciplina_id = :disciplina_id";
        $params = array("disciplina_id" => $disciplina);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting grandes temas by disciplina." . $e->getMessage(), 400, $e);
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
        	$grandesTemas = $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
            
            return (count($grandesTemas) > 0) ? $grandesTemas[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting grande tema by id." . $e->getMessage(), 400, $e);
        }
        
    }


	public function insert(&$grandeTema) {
        $this->validate($grandeTema);
		$sql = "INSERT INTO " . self::_TABLE . "(descricao, disciplina_id, status) VALUES (:descricao, :disciplina_id, :status)";
        $params = array(
            'descricao' => $grandeTema->getDescricao(),
            'disciplina_id' => $grandeTema->getDisciplina(),
            'status' => $grandeTema->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
            $grandeTema->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting disciplina.", 400, $e);
        }
	}

	public function update( $grandeTema) {
        $this->validate($grandeTema);
		$sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, disciplina_id = :disciplina_id, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
        	'id' => $grandeTema->getId(),
            'descricao' => $grandeTema->getDescricao(),
            'disciplina_id' => $grandeTema->getDisciplina(),
            'status' => $grandeTema->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating grande tema.", 400, $e);
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
            throw new CollectionException("Error removing grande tema.", 400, $e);
        }

	}

   private function validate($grandeTema) {
        $errors = array();

        if(is_null($grandeTema->getDisciplina())) {
            array_push($errors, 'Por favor, informe a disciplina');
        }

        if(strlen($grandeTema->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }

        return true;
    }

}