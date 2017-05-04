<?php

require_once('DisciplinaTestCase.php');
class DisciplinaTest extends DisciplinaTestCase {

    public $fixtures = array( 'disciplina' );

    function testReadDatabase() {
        $conn = $this->getConnection()->getConnection();

        // fixtures auto loaded, let's read some data
        $query = $conn->query('SELECT * FROM disciplina');
        $results = $query->fetchAll(PDO::FETCH_COLUMN);
        $this->assertEquals(2, count($results));

        // now delete them
        $conn->query('TRUNCATE disciplina');

        $query = $conn->query('SELECT * FROM disciplina');
        $results = $query->fetchAll(PDO::FETCH_COLUMN);
        $this->assertEquals(0, count($results));

        // now reload them
        $ds = $this->getDataSet(array('disciplina'));
        $this->loadDataSet($ds);

        $query = $conn->query('SELECT * FROM disciplina');
        $results = $query->fetchAll(PDO::FETCH_COLUMN);
        $this->assertEquals(2, count($results));
    }

}