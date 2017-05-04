<?php

namespace Api\Controllers;

use Api\Collections\CollectionFactory;
use Api\Library\Util;
use Api\Models\Questao;
use Api\Models\Item;


class QuestaoController{

	private $questaoCollection;

	public function __construct() {
		$this->questaoCollection = CollectionFactory::createQuestaoCollection();
	}

	public function get() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		$params = (count($id) > 0) ? array( 'id' => $id[0] ) : Util::get();

		return $this->questaoCollection->get($params);
	}
	public function insert() {
		$params = Util::post();

		// $params = (array) $params;
	
		$itensCriar = array();
		$itens = array();
		$itensAlterar = array();


		$questao = new Questao($params);


		$this->questaoCollection->insert($questao);


		
		if(count($questao->getItens()) > 0) {
			$itens = $questao->getItens();

			foreach ($itens as $param) {
				$item = new Item($param);
				$item->setQuestao($questao->getId());

				array_push($itens, $item);

				if(isset($param['new'])) {
					array_push($itensCriar, $item);
				} else {
					array_push($itensAlterar, $item);
				}
			}
		}

		
		// $this->questaoCollection->deleteItensByQuestao($questao->getId());

		if(count($itensCriar) > 0) {
	 		$this->questaoCollection->insertItens($questao->getTipo(), $itensCriar);
		}

		if(count($itensAlterar) > 0) {
	 		$this->questaoCollection->updateItens($questao->getTipo(), $itensAlterar);
		}

		return 'Questao criada com sucesso';
	}

	public function update() {
		$params = Util::post();

		// $params = (array) $params;
	
		$itensCriar = array();
		$itens = array();
		$itensAlterar = array();


		$questao = new Questao($params);

		// $questao->setId(2);


		



		$this->questaoCollection->update($questao);

		// die($questao->getId());

		
		if(count($questao->getItens()) > 0) {
			$itens = $questao->getItens();

			foreach ($itens as $param) {
				$item = new Item($param);
				$item->setQuestao($questao->getId());

				array_push($itens, $item);

				if(isset($param['new'])) {
					array_push($itensCriar, $item);
				} else {
					array_push($itensAlterar, $item);
				}
			}
		}

		
		if($questao->getTipo() == 'DISSERTATIVA') {
			$this->questaoCollection->deleteItensByQuestao($questao->getId());
		}
		//  print_r($itensCriar);
		// print_r($itensAlterar);
		// exit;


		if(count($itensCriar) > 0) {
	 		$this->questaoCollection->insertItens($questao->getTipo(), $itensCriar);
		}

		if(count($itensAlterar) > 0) {
	 		$this->questaoCollection->updateItens($questao->getTipo(), $itensAlterar);
		}


		return 'Questao atualizada com sucesso';
		
	}

	public function delete() {
		preg_match('/[0-9]+.*/', Util::server('PATH_INFO'), $id);
		if (count($id) > 0) {
			$this->questaoCollection->delete($id[0]);
			return 'Questao removida com sucesso';
		}
	}

}