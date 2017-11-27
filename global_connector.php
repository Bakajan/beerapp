<?php
Class Connecter
{
  var $conn;
  
  function __construct()
  {
    $configs = include(dirname(__FILE__) . '/config.php');

    try 
    {
      $this->conn = new PDO("mysql:host=" . $configs['server'] . ";dbname=" . $configs['dbname'], $configs['username'], $configs['password']);
      // set the PDO error mode to exception
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e)
    {
      echo "<br>" . $e->getMessage();
    }
  }
}
?>