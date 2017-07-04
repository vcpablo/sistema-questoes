/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.7.16 : Database - matriz-biologia
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `disciplina` */

DROP TABLE IF EXISTS `disciplina`;

CREATE TABLE `disciplina` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição da disciplina',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `grande_tema` */

DROP TABLE IF EXISTS `grande_tema`;

CREATE TABLE `grande_tema` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição do grande tema',
  `disciplina_id` int(11) NOT NULL COMMENT 'Identificação da disciplina',
  PRIMARY KEY (`id`),
  KEY `fk__grande_tema_disciplina` (`disciplina_id`),
  CONSTRAINT `fk__grande_tema_disciplina` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `habilidade` */

DROP TABLE IF EXISTS `habilidade`;

CREATE TABLE `habilidade` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` text NOT NULL COMMENT 'Descrição da habilidade',
  `competencia` enum('OBSERVAR', 'COMPREENDER','REALIZAR') NOT NULL COMMENT 'Competência avaliada na habilidade',
  `objeto_conhecimento_id` int(11) NOT NULL COMMENT 'Identificação do objeto de conhecimento',
  PRIMARY KEY (`id`),
  KEY `fk__habilidade_objeto_conhecimento` (`objeto_conhecimento_id`),
  CONSTRAINT `fk__habilidade_objeto_conhecimento` FOREIGN KEY (`objeto_conhecimento_id`) REFERENCES `objeto_conhecimento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `objeto_conhecimento` */

DROP TABLE IF EXISTS `objeto_conhecimento`;

CREATE TABLE `objeto_conhecimento` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição do objeto de conhecimento',
  `grande_tema_id` int(11) NOT NULL COMMENT 'Identificação do grande tema',
  PRIMARY KEY (`id`),
  KEY `fk__objeto_conhecimento_grande_tema` (`grande_tema_id`),
  CONSTRAINT `fk__objeto_conhecimento_grande_tema` FOREIGN KEY (`grande_tema_id`) REFERENCES `grande_tema` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
