<?php

namespace Api\Collections;

use \phputil\PDOBuilder;
use \phputil\PDOWrapper;


class CollectionFactory {

	public static function createPDO() {
		$pdo = PDOBuilder::with()
						->dsn( 'mysql:dbname=matriz;host=localhost;' )
						->username( 'root' )
						->password( 'root' )
						->options (array( \PDO::ATTR_STRINGIFY_FETCHES => false, \PDO::ATTR_EMULATE_PREPARES => false ))
						->modeException()
						->persistent()
						->mySqlUTF8()
						->build();

		return new PDOWrapper( $pdo );

	}

	public static function createDisciplinaCollection() {
		return new DisciplinaCollection(self::createPDO());
	}

	public static function createGrandeTemaCollection() {
		return new GrandeTemaCollection(self::createPDO(), self::createDisciplinaCollection());
	}

	public static function createObjetoConhecimentoCollection() {
		return new ObjetoConhecimentoCollection(self::createPDO(), self::createGrandeTemaCollection());
	}

	public static function createHabilidadeCollection() {
		return new HabilidadeCollection(self::createPDO(), self::createObjetoConhecimentoCollection());
	}

	public static function createItemCollection() {
		return new ItemCollection(self::createPDO());
	}

	public static function createQuestaoCollection() {
		return new QuestaoCollection(self::createPDO(), self::createHabilidadeCollection(), self::createItemCollection());
	}

}