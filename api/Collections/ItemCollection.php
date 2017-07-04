<?php

namespace Api\Collections;

use Api\Exceptions\CollectionException;
use Api\Models\Item;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;
use \phputil\JSON;

class ItemCollection implements ICollection {
    const _TABLE = 'item';
    public $_softDelete = false;

    private $pdow;

    public function __construct(PDOWrapper $pdow) {
        $this->pdow = $pdow;
    }

    public function convert($row) {
        
        $item = new Item($row);
        $item->setQuestao($row['questao_id']);
        // $item->setQuestao($row['questao_id']);
        
        return $item;
    }


    public function get(array $params = array()) {
        $status = (isset($params["status"])) ? $params["status"] : 1;
        
        
        if (isset($params["id"])) {
            return $this->getById($params["id"], $status);
        } 

        if(isset($params['questao'])) {
            return $this->getByQuestao($params['questao'], $status);
        }
        
        return $this->getAll($status);
    }

    private function getAll($status) {
        $sql = "SELECT * FROM " . self::_TABLE;
        
        $params = array();
        
        
        $sql .= " WHERE status = :status ORDER BY __date DESC";
        $params["status"] = $status;
        
        try {
            return $this->pdow->queryObjects(array($this, "convert"), $sql, $params);//$this->pdow->fetchObjects($sql, $params, 'Api\Models\Item');
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting all itens." . $e->getMessage(), 400, $e);
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
            $itens = $this->pdow->fetchObjects($sql, $params, 'Api\Models\Item');
            return (count($itens) > 0) ? $itens[0] : false;
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting item by id." . $e->getMessage(), 400, $e);
        }
        
    }   
    
    private function getByQuestao($questao, $status) {
        $sql = "SELECT * FROM " . self::_TABLE . " WHERE questao_id = :questao_id ";
        $params = array("questao_id" => $questao);
        
        if(!is_null($status)) {
            $sql .= " AND status = :status";
            $params["status"] = $status;
        }

        $sql .= " ORDER BY __date DESC";


        try {
            return  $this->pdow->queryObjects(array($this, "convert"), $sql, $params);//$this->pdow->fetchObjects($sql, $params, 'Api\Models\Item');
        } catch (\PDOException $e) {
            throw new CollectionException("Error getting item by questão." . $e->getMessage(), 400, $e);
        }
        
    }


    public function insert(&$item) {
        $this->validate($item);
        $sql = "INSERT INTO " . self::_TABLE . "(descricao, correto, habilidade_id, status) VALUES (:descricao, :correto, :habilidade_id, :status)";
        $params = array(
            'descricao' => $item->getDescricao(),
            'correto' => ($item->getCorreto()) ? 1 : 0,
            'habilidade_id' => $item->getHabilidade(),
            'status' => $item->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
            $item->setId($this->pdow->lastInsertId());
        } catch (Exception $e) {
            throw new CollectionException("Error inserting item.", 400, $e);
        }
    }

    public function insertBatch($itens) {
        // $this->validateBatch($itens);
        $sql = "INSERT INTO " . self::_TABLE . "(id, descricao, correto, questao_id, status) VALUES";
        $params = array();
        $names = array();
        $queries = array();




        foreach ($itens as $key => $item) {
            $names = array();
            array_push($names, ':id_' . $key, ':descricao_' . $key, ':correto_' . $key, ':questao_id_' . $key, ':status_' . $key);
            // $names = '(' . implode(',', $names) . ')';
            array_push($queries,'(' . implode(',', $names) . ')');


            $params['id_' . $key] = $item->getId();
            $params['descricao_' . $key] = $item->getDescricao();
            $params['correto_' . $key] = ($item->getCorreto() == true) ? 1 : 0;
            $params['questao_id_' . $key] = $item->getQuestao();
            $params['status_' . $key] = $item->getStatus();
        }

        $sql .= implode(',', $queries) . ';';


        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error inserting item.", 400, $e);
        }
    }

    public function updateBatch($itens) {
        // $this->validateBatch($itens);

        
        foreach ($itens as $key => $item) {
            // $sql = "";
            // $queries = array();
            $params = array();
            $names = array();
            array_push($names, 'descricao = :descricao', 'correto = :correto', 'questao_id = :questao_id', 'status = :status');
            // array_push($queries,'' . implode(',', $names) . '');
            // $names = implode(',', $names) . ' WHERE id = :id_' . $key;
            $sql = "UPDATE " . self::_TABLE . " SET " . implode(',', $names) . ' WHERE id = :id;';
            // array_push($queries, $query);

            $params['descricao'] = $item->getDescricao();
            $params['correto'] = $item->getCorreto();
            $params['questao_id'] = $item->getQuestao();
            $params['status'] = $item->getStatus();
            $params['id'] = $item->getId();

            // $sql .= implode(';', $queries) . ';';
            // print_r($params);
            // echo($sql);
            try {
                 $this->pdow->execute($sql, $params);
            } catch (Exception $e) {
                throw new CollectionException("Error inserting item.", 400, $e);
            }
        }




        
    }


    public function update($item) {
        $this->validate($item);
        $sql = "UPDATE " . self::_TABLE . " SET descricao = :descricao, corretp = :correto, habilidade_id = :habilidade_id, status = :status WHERE " . self::_PK . " = :id";
        $params = array(
            'id' => $item->getId(),
            'descricao' => $item->getDescricao(),
            'correto' => $item->getCorreto(),
            'descricao' => $item->getHabilidade(),
            'status' => $item->getStatus()
        );

        try {
            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error updating item.", 400, $e);
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
            throw new CollectionException("Error removing item.", 400, $e);
        }

    }

    public function deleteByQuestao($questao) {
        try {
            $params = array( "questao_id" => $questao);

            if($this->_softDelete) {
                $params["status"] = 0;
                $sql = "UPDATE " . self::_TABLE . " SET status = :status WHERE questao_id = :questao_id";   
            } else {
                $sql = "DELETE FROM " . self::_TABLE . " WHERE questao_id = :questao_id";   
            }



            $this->pdow->execute($sql, $params);
        } catch (Exception $e) {
            throw new CollectionException("Error removing item.", 400, $e);
        }

    }

    public function validate($item) {
         $errors = array();

        if(strlen($item->getDescricao()) == 0) {
            array_push($errors, 'Por favor, informe a descrição');
        }

        if(is_null($item->getHabilidade())) {
            array_push($errors, 'Por favor, informe a habilidade');
        }

        if(count($errors) > 0) {
            throw new CollectionException(JSON::encode($errors), 400);
        }

        return true;
    }

}