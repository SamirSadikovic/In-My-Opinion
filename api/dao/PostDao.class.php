<?php
require_once dirname(__FILE__) . "/BaseDao.class.php";

class PostDao extends BaseDao{

    public function __construct(){
        parent::__construct("posts");
    }

    public function updateByTopic($topic_id, $post) {
        $this->update($topic_id, $post, "topic_id");
    }

    public function getAllComments($id) {
        return $this->query("SELECT c.*, COALESCE(SUM(cv.type), 0) AS votes
                            FROM comments c
                            LEFT JOIN comment_votes cv ON cv.comment_id = c.id
                            WHERE c.post_id = :id
                            GROUP BY c.id", ['id' => $id]);
    }

    public function vote($id, $account_id, $type) {
        try{
            $this->insert('post_votes', ['account_id' => $account_id, 'post_id' => $id, 'type' => $type]);
        } catch(PDOException $e){
            $this->updateComposite('post_votes', ['account_id' => $account_id, 'post_id' => $id], ['type' => $type]);
        }

        // not necessary due to triggers in db
        // $account = new AccountDao();
        // $account->updatePoints($id, $type);
    }

    public function getPosts($search, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT p.*, COALESCE(SUM(pv.type), 0) AS votes
                            FROM posts p
                            LEFT JOIN post_votes pv ON pv.post_id = p.id
                            WHERE LOWER(p.title)
                            LIKE CONCAT('%', :title, '%')
                            GROUP BY p.id
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ['title' => strtolower($search)]);
    }

    public function getVotes($id) {
        return $this->query("SELECT accounts.username
                            FROM post_votes
                            JOIN accounts ON accounts.id = post_votes.account_id
                            JOIN posts ON posts.id = post_votes.post_id
                            WHERE post_id = :id", ['id' => $id]);
    }

    //Override
    public function getById($id) {
        return $this->queryUnique("SELECT p.*, COALESCE(SUM(pv.type), 0) AS votes
                                FROM posts p
                                LEFT JOIN post_votes pv ON pv.post_id = p.id
                                WHERE p.id = :id", ['id' => $id]);
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

        return $this->query("SELECT p.*, COALESCE(SUM(pv.type), 0) AS votes
                            FROM posts p
                            LEFT JOIN post_votes pv ON pv.post_id = p.id
                            GROUP BY p.id
                            ORDER BY ${orderColumn} ${orderDirection} ".
                            "LIMIT ${limit} OFFSET ${offset}", []);
    }
    
}
?>