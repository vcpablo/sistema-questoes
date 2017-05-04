<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\Habilidade;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;
use \phputil\JSON;


class HabilidadeCollection implements ICollection {

	const _TABLE = 'habilidade';
    private $_softDelete = true;

	private $pdow;
	private $objetoConhecimentoCollection;

	public function __construct(PDOWrapper $pdow, ObjetoConhecimentoCollection $objetoConhecimentoCollection) {
		$this->pdow = $pdow;
		$this->objetoConhecimentoCollection = $objetoConhecimentoCollection;
	}

	public function convert($row) {
        $habilidade = new Habilidade($row);
        $habilidade->setObjetoConhecimento($this->objetoConhecimentoCollection->get(array('id' => $row['objeto_conhecimento_id'])));

        return $habilidade;
    } 

	public function get(array $params = array()) {
        $status = (isset($params["status"])) ? $params["status"] : 1;
        
        
        if (isset($params["id"])) {
            return $this->getById($params["id"], $status);
        } else if(isset($params['objeto_conhecimento'], $params['competencia'])) {
            return $this->getByObjetoConhecimentoAndCompetencia($params['objeto_conhecimento'], $params['competencia'], $status);
        } else if(isset($params['objeto_conhecimento'])) {
            return $this->getByObjetoConhecimento($params['objeto_conhecimento'], $status);
        } else if(isset($params['competencia'])) {
            return $this->getByCompetencia($params['competencia'], $status);
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
            throw new CollectionException("Error getting all habilidades." . $e->getMessage(), 400, $e);
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
        	$habilidades = $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
            
            return (count($habilidades) > 0) ? $habilidades[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting habilidade by id." . $e->getMessage(), 400, $e);
        }
        
    }


    private function getByObjetoConhecimento($objetoConhecimento, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE objeto_conhecimento_id = :objeto_conhecimento_id";
        $params = array("objeto_conhecimento_id" => $objetoConhecimento);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting habilidades by objetos conhecimento." . $e->getMessage(), 400, $e);
        }
        
    }

    private function getByCompetencia($competencia, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE competencia = :competencia";
        $params = array("competencia" => $competencia);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting habilidades by objetos competencia." . $e->getMessage(), 400, $e);
        }
        
    }

    private function getByObjetoConhecimentoAndCompetencia($objetoConhecimento, $competencia, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE objeto_conhecimento_id = :objeto_conhecimento_id AND competencia = :competencia";
        $params = array("competencia" => $competencia, 'objeto_conhecimento_id' => $objetoConhecimento);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting habilidades by objetos objeto de conhecimento e competencia." . $e->getMessage(), 400, $e);
        }
        
    }


	public function insert(&$habilidade) {
        $this->validate($habilidade);
		$sql = "INSERT INTO " . self::_TABLE . "(descricao, objeto_conhecimento_id, competencia, status) VALUES (:descricao, :objeto_conhecimento_id, :competencia, :status)";
        $params = array(
            'descricao' => $habilidade->getDescricao(),
            'objeto_conhecimento_id' => $habilidade->getObjetoConhecimento(),
            'competencia' => $habilidade->getCompetencia(),
            'status' => $habilidade->getStatus()
        );

       

        try {
            $this->pdow->execute($sql, $params);
            $habilidade->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting habilidade.", 400, $e);
        }
	}

	public function update($habilidade) {
        $this->validate($habilidade);
		$sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, objeto_conhecimento_id = :objeto_conhecimento_id, competencia = :competencia, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
        	'id' => $habilidade->getId(),
            'descricao' => $habilidade->getDescricao(),
            'objeto_conhecimento_id' => $habilidade->getObjetoConhecimento(),
            'competencia' => $habilidade->getCompetencia(),
            'status' => $habilidade->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating habilidade de conhecimento.", 400, $e);
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
            throw new CollectionException("Error removing habilidade de conhecimento.", 400, $e);
        }

	}


    public function validate($habilidade) {
        $errors = array();

        if(strlen($habilidade->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(is_null($habilidade->getObjetoConhecimento())) {
            array_push($errors, 'Por favor, informe o objeto de conhecimento');
        }


        if($habilidade->getCompetencia() === 0) {
            array_push($errors, 'Por favor, informe a competência');
        }

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }

     
    }


}