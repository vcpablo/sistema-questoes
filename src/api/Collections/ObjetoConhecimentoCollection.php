<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\ObjetoConhecimento;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;
use \phputil\JSON;


class ObjetoConhecimentoCollection implements ICollection {

	const _TABLE = 'objeto_conhecimento';
    private $_softDelete = true;

	private $pdow;
	private $grandeTemaCollection;

	public function __construct(PDOWrapper $pdow, GrandeTemaCollection $grandeTemaCollection) {
		$this->pdow = $pdow;
		$this->grandeTemaCollection = $grandeTemaCollection;
	}

	public function convert($row) {
        $objetoConhecimento = new ObjetoConhecimento($row);
        $objetoConhecimento->setGrandeTema($this->grandeTemaCollection->get(array('id' => $row['grande_tema_id'])));
        return $objetoConhecimento;
    } 

	public function get(array $params = array()) {
        $status = (isset($params["status"])) ? $params["status"] : 1;

        
        if (isset($params['id'])) {
            return $this->getById($params['id'], $status);
        } else if(isset($params['grande_tema'])) {
            return $this->getByGrandeTema($params['grande_tema'], $status);
        } else if(isset($params['disciplina'])) {
            return $this->getByDisciplina($params['disciplina'], $status);
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
            throw new CollectionException("Error getting all objetos de conhecimento." . $e->getMessage(), 400, $e);
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
        	$objetosConhecimento = $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
            
            return (count($objetosConhecimento) > 0) ? $objetosConhecimento[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting objeto de conhecimento by id." . $e->getMessage(), 400, $e);
        }
        
    }

    private function getByGrandeTema($grandeTema, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE grande_tema_id = :grande_tema_id";
        $params = array("grande_tema_id" => $grandeTema);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }

        $sql .= " ORDER BY __date DESC";
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting objetos de conhecimento by grande tema." . $e->getMessage(), 400, $e);
        }
        
    }

    private function getByDisciplina($disciplinaId, $status) {
        $sql = "SELECT oc.* FROM " . self::_TABLE . " AS oc " . 
        " INNER JOIN grande_tema AS gt ON oc.grande_tema_id = gt.id WHERE gt.disciplina_id = :disciplina_id";
        $params = array("disciplina_id" => $disciplinaId);
        
        if(!is_null($status)) {
            $sql .= " AND oc.status = :status";
            $params["status"] = $status;
        }

        $sql .= " ORDER BY oc.__date DESC";
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting objetos de conhecimento by disciplinas." . $e->getMessage(), 400, $e);
        }
        
    }



	public function insert(&$objetoConhecimento) {
        $this->validate($objetoConhecimento);
		$sql = "INSERT INTO " . self::_TABLE . "(descricao, grande_tema_id, status) VALUES (:descricao, :grande_tema_id, :status)";
        $params = array(
            'descricao' => $objetoConhecimento->getDescricao(),
            'grande_tema_id' => $objetoConhecimento->getGrandeTema(),
            'status' => $objetoConhecimento->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
            $objetoConhecimento->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting disciplina.", 400, $e);
        }
	}

	public function update($objetoConhecimento) {
        $this->validate($objetoConhecimento);
		$sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, grande_tema_id = :grande_tema_id, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
        	'id' => $objetoConhecimento->getId(),
            'descricao' => $objetoConhecimento->getDescricao(),
            'grande_tema_id' => $objetoConhecimento->getGrandeTema(),
            'status' => $objetoConhecimento->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating objeto de conhecimento.", 400, $e);
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
            throw new CollectionException("Error removing objeto de conhecimento.", 400, $e);
        }

	}

     public function validate($item) {
         $errors = array();

        if(strlen($item->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(is_null($item->getGrandeTema())) {
            array_push($errors, 'Por favor, informe o grande tema');
        }

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }

        return true;
    }

}