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
        return $this->query("SELECT *, getCommentVotes(id) AS votes
                            FROM comments
                            WHERE post_id = :id
                            GROUP BY id", ['id' => $id]);
    }

    public function vote($id, $account_id, $type) {
        try{
            return $this->insert('post_votes', ['account_id' => $account_id, 'post_id' => $id, 'type' => $type]);
        } catch(PDOException $e){
            return $this->updateComposite('post_votes', ['account_id' => $account_id, 'post_id' => $id], ['type' => $type]);
        }
    }

    public function getPosts($search, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT *, getPostVotes(id) AS votes
                            FROM posts
                            WHERE LOWER(title)
                            LIKE '%' || :title || '%'
                            GROUP BY id
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ['title' => strtolower($search)]);
    }

    public function getVoters($id, $type) {
        return $this->query("SELECT accounts.*
                            FROM post_votes
                            JOIN accounts ON accounts.id = post_votes.account_id
                            JOIN posts ON posts.id = post_votes.post_id
                            WHERE post_id = :id
                            AND type = :type", ['id' => $id, 'type' => $type]);
    }

    //Override
    public function getById($id) {
        return $this->queryUnique("SELECT *, getPostVotes(id) AS votes
                                FROM posts
                                WHERE id = :id
                                GROUP BY id", ['id' => $id]);
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
        
        $orderColumn = substr($order, 1);

        return $this->query("SELECT *, getPostVotes(id) AS votes
                            FROM posts
                            GROUP BY id
                            ORDER BY ${orderColumn} ${orderDirection} ".
                            "LIMIT ${limit} OFFSET ${offset}", []);
    }
    
}
?>