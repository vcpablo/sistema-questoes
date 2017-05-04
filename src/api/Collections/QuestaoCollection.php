<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\Questao;
use Api\Models\Habilidade;
use Api\Models\ObjetoConhecimento;
use Api\Models\GrandeTema;
use Api\Models\Disciplina;
use Api\Library\Util;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;
use \phputil\JSON;


class QuestaoCollection implements ICollection {

	const _TABLE = 'questao';
    private $_softDelete = true;

	private $pdow;
	private $habilidadeCollection;
	private $itemCollection;

	public function __construct(PDOWrapper $pdow, HabilidadeCollection $habilidadeCollection, ItemCollection $itemCollection) {
		$this->pdow = $pdow;
		$this->habilidadeCollection = $habilidadeCollection;
		$this->itemCollection = $itemCollection;
	}

	public function convert($row) {
        $questao = new Questao($row);
        $questao->setHabilidade($this->habilidadeCollection->get(array('id' => $row['habilidade_id'])));

        $questao->setItens($this->itemCollection->get(array('questao' => $row['id'])));
        return $questao;
    } 

    public function convertFiltered($row) {

        $questao = new Questao($row);
        $questao->setHabilidade($this->habilidadeCollection->get(array('id' => $row['habilidade_id'])));
        $questao->setItens($this->itemCollection->get(array('questao' => $row['id'])));



        return $questao;
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
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting all questões." . $e->getMessage(), 400, $e);
        }
    }

    public function getAllFiltered($params) {
        
        $sql = "SELECT q.* FROM " . self::_TABLE .  " AS q" . 
            " INNER JOIN habilidade AS h ON h.id = q.habilidade_id " .
            " INNER JOIN objeto_conhecimento AS oc ON oc.id = h.objeto_conhecimento_id " .
            " INNER JOIN grande_tema AS gt ON gt.id = oc.grande_tema_id " .
            " INNER JOIN disciplina AS d ON d.id = gt.disciplina_id ";
        
        $where = array();

        if(!empty($params['questoes'])) {
            array_push($where, "q.id IN (" .  $params['questoes'] . ")");
        } else {

            if(!empty($params['tipos_questoes'])) {
                array_push($where, "q.tipo IN (" . $params['tipos_questoes'] . ")");
            }

            if(!empty($params['competencias'])) {
                array_push($where, "h.competencia IN (" . $params['competencias'] . ")");
            }

            if(!empty($params['habilidades'])) {
                array_push($where, "q.habilidade_id IN (" . $params['habilidades'] . ")");
            }



            
            if(!empty($params['objetos_conhecimento'])) {
                array_push($where, "oc.id IN (" . $params['objetos_conhecimento'] . ")");
            }

            if(!empty($params['grandes_temas'])) {
                array_push($where, "gt.id  IN (" . $params['grandes_temas'] . ")");
            }

            if(!empty($params['disciplinas'])) {
                array_push($where, "d.id IN (" . $params['disciplinas'] . ")");
            }

        }

        array_push($where, "q.status = :status");

        $sql .= " WHERE " . implode(' AND ', $where) . " ORDER BY RAND() LIMIT " . $params['numero_questoes'];
        
        $params = array('status' => 1);
      
        


        try {
            return $this->pdow->queryObjects(array($this, "convertFiltered"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting all questões." . $e->getMessage(), 400, $e);
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
        	$questões = $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
            
            return (count($questões) > 0) ? $questões[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting questao by id." . $e->getMessage(), 400, $e);
        }
        
    }


    private function getByHabilidade($habilidade, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE habilidade_id = :habilidade_id";
        $params = array("habilidade_id" => $habilidade);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting questões by habilidade." . $e->getMessage(), 400, $e);
        }
        
    }


	public function insert(&$questao) {
        $this->validate($questao);
		$sql = "INSERT INTO " . self::_TABLE . " (descricao, habilidade_id, tipo, status) VALUES (:descricao, :habilidade_id, :tipo, :status)";
        $params = array(
            'descricao' => $questao->getDescricao(),
            'habilidade_id' => $questao->getHabilidade(),
            'tipo' => $questao->getTipo(),
            'status' => $questao->getStatus()
        );
        
        try {
            $this->pdow->execute($sql, $params);
            $questao->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting questao.", 400, $e);
        }
	}

	public function update($questao) {
        $this->validate($questao);
		$sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, habilidade_id = :habilidade_id, tipo = :tipo, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
        	'id' => $questao->getId(),
            'descricao' => $questao->getDescricao(),
            'habilidade_id' => $questao->getHabilidade(),
            'tipo' => $questao->getTipo(),
            'status' => $questao->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating questao.", 400, $e);
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
            throw new CollectionException("Error removing questao de conhecimento.", 400, $e);
        }

	}

    public function insertItens($tipo, $itens) {

        $this->validateBatch($tipo, $itens);
        $this->itemCollection->insertBatch($itens);
    }

    public function updateItens($tipo, $itens) {
       
        $this->validateBatch($tipo, $itens);

        $this->itemCollection->updateBatch($itens);
    }

    public function deleteItensByQuestao($questao) {
        $this->itemCollection->deleteByQuestao($questao);
    }

    public function validate($questao) {
        $errors = array();

        if(strlen($questao->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(is_null($questao->getHabilidade())) {
            array_push($errors, 'Por favor, informe a habilidade');
        }

        // $tipo = $questao->getTipo();
        // $itens = $questao->getItens();

        $this->validateItens($questao->getTipo(), $questao->getItens(), $errors);

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }     
    }

    private function validateItens($tipo, $itens, &$errors) {

       

        if(is_null($tipo)) {
            array_push($errors, 'Por favor, informe o tipo');
        } else if($tipo !== 'DISSERTATIVA') {
            if(count($itens) == 0) {
                array_push($errors, 'Questões do tipo ' . Util::filter($tipo, 'questionType') . ' devem possuir pelo menos dois itens');
            } else if(count($itens) > 5) {
                array_push($errors, 'questões do tipo ' . Util::filter($tipo, 'questionType') . ' devem possuir no máximo cinco itens');
            }   

           

            $itensCorretos = array_map(create_function('$item', 'return new Api\Models\Item($item);'), array_filter($itens, create_function('$item', 'return (is_array($item)) ? $item["correto"] == true || $item["correto"] == 1: $item->getCorreto() == true || $item->getCorreto() == 1;')));

           // print_r($itensCorretos);

            if($tipo == 'MULTIPLA_ESCOLHA') {
                if(count($itensCorretos) > 1) {
                    array_push($errors, 'Questões do tipo ' . Util::filter($tipo, 'questionType') . ' devem possuir um único item correto');
                } else if(count($itensCorretos) == 0) {
                    array_push($errors, 'Questões do tipo ' . Util::filter($tipo, 'questionType') . ' devem possuir pelo menos um item correto');
                }
                
            }
                     
        }


       
    }

    private function validateBatch($tipo, $itens) {
        $errors = array();

        $this->validateItens($tipo, $itens, $errors);

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        } 
    }


}