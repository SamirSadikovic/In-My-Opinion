<?php
require_once dirname(__FILE__) . "/BaseDao.class.php";

class CommentDao extends BaseDao{

    public function __construct(){
        parent::__construct("comments");
    }

    public function updateByPost($post_id, $comment) {
        $this->update($post_id, $comment, "post_id");
    }

    /* Porbably not needed, will see in the future

    public function updateByAccountId($account_id, $comment) {
        $this->update($account_id, $comment, "account_id");
    }

    public function updateByCreationDate($date, $comment) {
        $this->update($date, $comment, "DATE(created_on)");
    }

    */

    public function getComments($account, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT c.*, COALESCE(SUM(cv.type), 0) AS votes
                            FROM comments c
                            LEFT JOIN comment_votes cv ON cv.comment_id = c.id
                            WHERE c.account_id = :account_id
                            GROUP BY c.id
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ['account_id' => $account]);
    }

    public function vote($id, $account_id, $type) {
        try{
            $this->insert("comment_votes", ['account_id' => $account_id, 'comment_id' => $id, 'type' => $type]);
        } catch(PDOException $e){
            $this->updateComposite("comment_votes", ['account_id' => $account_id, 'comment_id' => $id], ['type' => $type]);
        }
    }

    public function getVotes($id) {
        return $this->query("SELECT accounts.username
                            FROM comment_votes
                            JOIN accounts ON accounts.id = comment_votes.account_id
                            JOIN comments ON comments.id = comment_votes.comment_id
                            WHERE comment_id = :id", ['id' => $id]);
    }

    //Override
    public function getById($id) {
        return $this->queryUnique("SELECT c.*, COALESCE(SUM(cv.type), 0) AS votes
                                FROM comments c
                                LEFT JOIN comment_votes cv ON cv.comment_id = c.id
                                WHERE c.id = :id", ['id' => $id]);
    }

    //Override
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
        //$orderColumn = $this->connection->quote(substr($order, 1));
        //TODO investigate this error
        
        $orderColumn = substr($order, 1);

        return $this->query("SELECT c.*, COALESCE(SUM(cv.type), 0) AS votes
                            FROM comments c
                            LEFT JOIN comment_votes cv ON cv.comment_id = c.id
                            GROUP BY c.id
                            ORDER BY ${orderColumn} ${orderDirection} ".
                            "LIMIT ${limit} OFFSET ${offset}", []);
    }
    
}
?>