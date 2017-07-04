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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `disciplina` */

insert  into `disciplina`(`id`,`descricao`,`status`,`__date`) values 
(1,'Biologia',1,'2017-05-01 12:34:48');

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*Data for the table `grande_tema` */

insert  into `grande_tema`(`id`,`descricao`,`disciplina_id`,`status`,`__date`) values 
(1,'Origem da vida e evolução biológica',1,1,'2017-05-01 12:36:51'),
(2,'Biologia molecular e celular',1,1,'2017-05-01 12:37:08'),
(3,'Biotecnologia',1,1,'2017-05-01 12:37:15'),
(4,'Classificação e nomenclatura biológica',1,1,'2017-05-01 12:37:34'),
(5,'Ecologia',1,1,'2017-05-01 12:37:43'),
(6,'Fisiologia animal e humana',1,1,'2017-05-01 12:37:53'),
(7,'Fisiologia vegetal',1,1,'2017-05-01 12:38:01'),
(8,'Histologia e embriologia animal',1,1,'2017-05-01 12:38:21'),
(9,'Genética',1,1,'2017-05-01 12:38:29'),
(10,'História da ciência e método científico',1,1,'2017-05-01 12:38:48'),
(11,'Protistas e fungos',1,1,'2017-05-01 12:39:01'),
(12,'Reino animal',1,1,'2017-05-01 12:39:06'),
(13,'Reino vegetal',1,1,'2017-05-01 12:39:12'),
(14,'Saúde humana',1,1,'2017-05-01 12:39:23'),
(15,'Vírus e reino monera',1,1,'2017-05-01 12:39:35');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `habilidade` */

insert  into `habilidade`(`id`,`descricao`,`objeto_conhecimento_id`,`competencia`,`status`,`__date`) values 
(1,'Comparar o funcionamento normal de uma enzima com o que ocorre sob a ação de inibidores da ação enzimática,  a partir das informações de um gráfico sobre essas duas situações.',5,'REALIZAR',1,'2017-05-01 12:54:40'),
(2,'Indicar dentre eventos, como a formação da crosta terrestre, big bang, formação da via Láctea, formação do Sol, qual é o mais antigo',1,'OBSERVAR',1,'2017-05-01 12:44:26'),
(3,'Identificar a presença de água líquida como condição básica para a existência de vida como a conhecemos, dentre alguns itens em uma tabela\n',1,'OBSERVAR',1,'2017-05-01 12:45:48'),
(4,'Fazer generalizações entre a necessidade de água líquida e a existênica de vida',4,'COMPREENDER',1,'2017-05-01 12:55:09');

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

/*Data for the table `item` */

insert  into `item`(`id`,`descricao`,`correto`,`questao_id`,`status`,`__date`) values 
('23ec4662-20ab-3390-943e-f075e3b8d148','Item 2',1,4,1,'2017-05-01 15:04:03'),
('78bafc24-1e3b-e392-3e13-ea27642a6fcf','Item 1',0,4,1,'2017-05-01 15:04:03'),
('d3c9e8c3-4e85-5229-45c0-1db104699e09','Item 3',0,4,1,'2017-05-01 15:04:03');

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `objeto_conhecimento` */

insert  into `objeto_conhecimento`(`id`,`descricao`,`grande_tema_id`,`status`,`__date`) values 
(1,'Composição química da vida',1,1,'2017-05-01 12:41:23'),
(2,'Hípótese de Oparin',1,1,'2017-05-01 12:41:41'),
(3,'Composição química da célula',2,1,'2017-05-01 12:42:09'),
(4,'Água e sais minerais',2,1,'2017-05-01 12:42:17'),
(5,'Proteínas',2,1,'2017-05-01 12:42:25');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `questao` */

insert  into `questao`(`id`,`descricao`,`tipo`,`habilidade_id`,`status`,`__date`) values 
(1,'Questão 1','DISSERTATIVA',2,1,'2017-05-01 13:47:49'),
(2,'Questão 2','DISSERTATIVA',2,1,'2017-05-01 14:58:08'),
(3,'Questão 3','MULTIPLA_ESCOLHA',1,0,'2017-05-01 19:06:09'),
(4,'Questão 3','MULTIPLA_ESCOLHA',1,1,'2017-05-01 19:06:13');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
