<?php

require_once dirname(__FILE__) . "/../config.php";

/*
* The base class for interaction with database.
*
* All other Dao classes inherit this class.
*
* @author Samir Sadikovic
*/

class BaseDao {

    protected $connection;

    private $table;

    public static function parseOrder($order) {
        switch($order[0]){
            case '-':
                $orderDirection = "ASC";
                break;
            case '+':
                $orderDirection = "DESC";
                break;
            default:
                throw new Exception("Invalid order format. First character should be '+' or '-'.");
        }
        //TODO prevent SQL injection here
        ////$orderColumn = $this->connection->quote(substr($order, 1));
        
        $orderColumn = substr($order, 1);

        return [$orderColumn, $orderDirection];
    }

    public function __construct($table) {
        $this->table = $table;
        try {
            $this->connection = new PDO("pgsql:host=" . Config::DB_HOST . ";dbname=" . Config::DB_SCHEME . ";port=" . Config::DB_PORT, Config::DB_USERNAME, Config::DB_PASSWORD);
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            // throw $e;
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }
    
    protected function insert($table, $entity) {
        $sql = "INSERT INTO ${table} (";

        foreach($entity as $name => $value)
            $sql .= $name . ", ";

        $sql = substr($sql, 0, -2);
        $sql .= ") VALUES (";

        foreach($entity as $name => $value)
            $sql .= ":" . $name . ", ";

        $sql = substr($sql, 0, -2);
        $sql .= ")";

        $stmt= $this->connection->prepare($sql);
        $stmt->execute($entity);

        if($table == 'subscriptions' || $table == 'post_votes' || $table == 'comment_votes')
            return $entity;

        $entity['id'] = $this->connection->lastInsertId();

        return $entity;
    }

    protected function executeUpdate($table, $id, $entity, $id_column = "id") {
        $sql = "UPDATE ${table} SET ";

        foreach($entity as $name => $value)
            $sql .= $name . " = :" . $name . ", ";

        $sql = substr($sql, 0, -2);
        $sql .= " WHERE ${id_column} = :id";

        $stmt= $this->connection->prepare($sql);
        $entity['id'] = $id;
        $stmt->execute($entity);
    }

    protected function updateComposite($table, $primary_key, $entity) {
        $sql = "UPDATE ${table} SET ";

        foreach($entity as $name => $value)
            $sql .= $name . " = :" . $name . ", ";

        $sql = substr($sql, 0, -2);
        $sql .= " WHERE ";

        foreach($primary_key as $name => $value)
            $sql .= $name . " = :" . $name . " AND ";
        $sql = substr($sql, 0, -5);

        $stmt= $this->connection->prepare($sql);
        foreach($primary_key as $name => $value)
            $entity[$name] = $value;
        $stmt->execute($entity);

        return $entity;
    }

    protected function query($query, $params) {
        $stmt = $this->connection->prepare($query);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    protected function queryUnique($query, $params) {
        $results = $this->query($query, $params);
        
        return reset($results);
    }

    public function add($entity) {
        return $this->insert($this->table, $entity);
    }

    public function update($id, $entity, $id_column = "id") {
        $this->executeUpdate($this->table, $id, $entity, $id_column);
    }

    public function getById($id) {
        return $this->queryUnique("SELECT * FROM $this->table WHERE id = :id", ['id' => $id]);
    }

    public function delete($id){
        $stmt = $this->connection->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
      }

    public function deleteComposite($keyOneName, $keyOne, $keyTwoName, $keyTwo, $table){
        if(!isset($table))
            $table = $this->table;
        
        $stmt = $this->connection->prepare("DELETE FROM ${table} WHERE ${keyOneName} = :keyOne AND ${keyTwoName} = :keyTwo");
        $stmt->bindParam(':keyOne', $keyOne);
        $stmt->bindParam(':keyTwo', $keyTwo);
        $stmt->execute();
    }

    public function getAll($offset = 0, $limit = 25, $order = "-id") {
        switch($order[0]){
            case '-':
                $orderDirection = "ASC";
                break;
            case '+':
                $orderDirection = "DESC";
                break;
            default:
                throw new Exception("Invalid order format. First character should be '+' or '-'.");
        }
        
        $orderColumn = substr($order, 1);


        return $this->query("SELECT * FROM $this->table
                            ORDER BY ${orderColumn} ${orderDirection} ".
                            "LIMIT ${limit} OFFSET ${offset}", []);
    }

}