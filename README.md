# sistema-questoes
CEFET Campus Nova Friburgo / RJ - Sistema de Gerenciamento de Questões

https://github.com/vcpablo/sistema-questoes


# Preparação do Ambiente
## Banco de Dados
1. Baixe a versão mais recente do MySQL Installer e realize a instalação padrão do MySQL Server https://dev.mysql.com/downloads/installer/
2. Crie uma base de dados com o nome de `matriz` e faça o import do script SQL presente na pasta `database`

## Node e NPM
Baixe e instale a versão mais recente do NodeJS e NPM https://nodejs.org/en/download/

## PHP
Baixe a versão mais recente do PHP http://php.net/downloads.php e descompacte na pasta `C:/PHP7`

## Composer
Baixe e instale a versão mais recente do Composer https://getcomposer.org/download/

# Instalação
1. Clone o projeto ou faça o download dos arquivos e extraia no diretório desejado.  
2. Acesse o diretório com um terminal e faça a instalação dos componentes:

```
npm install 
npm install gulp 
bower install 
composer install 
```

3. Na classe **/src/api/Collections/ColectionFactory.php** é possível definir as configurações de acesso à base de dados de acordo com a sua instalação.


# Rodando a aplicação
```
gulp serve
```







