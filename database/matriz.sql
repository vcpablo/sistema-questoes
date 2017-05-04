/*
SQLyog Ultimate v12.4.1 (64 bit)
MySQL - 5.7.16 : Database - matriz
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`matriz` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `matriz`;

/*Table structure for table `disciplina` */

DROP TABLE IF EXISTS `disciplina`;

CREATE TABLE `disciplina` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição da disciplina',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Define o status do registro do ponto de vista do sistema: 1. Ativo, 2. Inativo, 3. Excluído',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `grande_tema` */

DROP TABLE IF EXISTS `grande_tema`;

CREATE TABLE `grande_tema` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição do grande tema',
  `disciplina_id` int(11) NOT NULL COMMENT 'Identificação da disciplina',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Define o status do registro do ponto de vista do sistema: 1. Ativo, 2. Inativo, 3. Excluído',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`),
  KEY `fk__grande_tema_disciplina` (`disciplina_id`),
  CONSTRAINT `fk__grande_tema_disciplina` FOREIGN KEY (`disciplina_id`) REFERENCES `disciplina` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `habilidade` */

DROP TABLE IF EXISTS `habilidade`;

CREATE TABLE `habilidade` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição da competência',
  `objeto_conhecimento_id` int(11) NOT NULL COMMENT 'Referência do objeto de conhecimento',
  `competencia` enum('OBSERVAR','COMPREENDER','REALIZAR') DEFAULT NULL COMMENT 'Competência que será avalisada na questaão',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Status do registro: 1. ativo - 2. inativo',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`),
  KEY `fk__competencia_objeto_conhecimento` (`objeto_conhecimento_id`),
  CONSTRAINT `fk__competencia_objeto_conhecimento` FOREIGN KEY (`objeto_conhecimento_id`) REFERENCES `objeto_conhecimento` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `item` */

DROP TABLE IF EXISTS `item`;

CREATE TABLE `item` (
  `id` varchar(36) NOT NULL COMMENT 'Identificação única do registro no sistema',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição do item',
  `correto` int(11) NOT NULL DEFAULT '0' COMMENT 'Define se o item é considerado correto (questão de múltipla escolha) ou verdadeiro (questões de verdadeiro/falso)',
  `questao_id` int(11) NOT NULL COMMENT 'ReferÊncia à habilidade à qual o item pertence',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Define o status do registro do ponto de vista do sistema: 1. Ativo, 2. Inativo, 3. Excluído',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`),
  KEY `fk__item_habilidade` (`questao_id`),
  CONSTRAINT `fk__item_questao` FOREIGN KEY (`questao_id`) REFERENCES `questao` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `objeto_conhecimento` */

DROP TABLE IF EXISTS `objeto_conhecimento`;

CREATE TABLE `objeto_conhecimento` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` varchar(255) NOT NULL COMMENT 'Descrição do objeto de conhecimento',
  `grande_tema_id` int(11) NOT NULL COMMENT 'Identificação do grande tema',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Define o status do registro do ponto de vista do sistema: 1. Ativo, 2. Inativo, 3. Excluído',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`),
  KEY `fk__objeto_conhecimento_grande_tema` (`grande_tema_id`),
  CONSTRAINT `fk__objeto_conhecimento_grande_tema` FOREIGN KEY (`grande_tema_id`) REFERENCES `grande_tema` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `questao` */

DROP TABLE IF EXISTS `questao`;

CREATE TABLE `questao` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Identificação única do registro',
  `descricao` text NOT NULL COMMENT 'Descrição da habilidade',
  `tipo` enum('DISSERTATIVA','MULTIPLA_ESCOLHA','VERDADEIRO_FALSO') NOT NULL COMMENT 'Define se a questão é: 1. Discursiva (somente enunciado), 2. Múltipla escolha - possui até 5 itens com somente uma resposta verdadeira, 3. Única Escolha (verdadeiro e falso) com no máximo 5 questões que devem ser marcadas cada uma como verdeiro ou falso',
  `habilidade_id` int(11) NOT NULL COMMENT 'Identificação da habilidade que está sendo avaliada na questão',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT 'Define o status do registro do ponto de vista do sistema: 1. Ativo, 2. Inativo, 3. Excluído',
  `__date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Define a data e hora da última atualização/inclusão do registro',
  PRIMARY KEY (`id`),
  KEY `fk__habilidade_objeto_conhecimento` (`habilidade_id`),
  CONSTRAINT `fk__questao_habilidade` FOREIGN KEY (`habilidade_id`) REFERENCES `habilidade` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
