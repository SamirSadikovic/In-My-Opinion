<?php

require_once dirname(__FILE__) . "/BaseDao.class.php";

class AccountDao extends BaseDao{

    public function __construct() {
        parent::__construct("accounts");
    }

    public function getAccountByEmail($email) {
        return $this->queryUnique("SELECT * FROM accounts WHERE email = :email", ['email' => $email]);
    }

    public function getByUsername($username) {
        return $this->queryUnique("SELECT * FROM accounts WHERE username = :username", ['username' => $username]);
    }

    public function updateAccountByEmail($email, $account) {
        $this->update($email, $account, "email");
    }

    public function getSubscriptions($id) {
        return $this->query("SELECT topics.*
                            FROM subscriptions
                            JOIN accounts ON accounts.id = subscriptions.account_id
                            JOIN topics ON topics.id = subscriptions.topic_id
                            WHERE subscriptions.account_id = :id", ['id' => $id]);
    }

    public function getPoints($id) {
        return array_values($this->queryUnique("SELECT points FROM accounts WHERE id = :id", ['id' => $id]))[0];
    }

    public function getTopicCount($id) {
        return count($this->getSubscriptions($id));
    }

    public function getPostCount($id) {
        return count($this->query("SELECT *
                            FROM posts
                            WHERE account_id = :id", ['id' => $id]));
    }

    public function getCommentCount($id) {
        return count($this->query("SELECT *
                            FROM comments
                            WHERE account_id = :id", ['id' => $id]));
    }

    public function getAccounts($search, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT * 
                            FROM accounts 
                            WHERE LOWER(username) 
                            LIKE '%' || :username || '%'
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ["username" => strtolower($search)]);
    }

    public function voteTypePost($post_id, $account_id) {
        $result = $this->queryUnique("SELECT type
                                FROM post_votes
                                WHERE account_id = :account_id
                                AND post_id = :post_id", ["account_id" => $account_id, "post_id" => $post_id]);
        if($result == null)
            return 0;
        else
            return $result['type'];
    }

    public function voteTypeComment($comment_id, $account_id) {
        $result = $this->queryUnique("SELECT type
                                FROM comment_votes
                                WHERE account_id = :account_id
                                AND comment_id = :comment_id", ["account_id" => $account_id, "comment_id" => $comment_id]);
        if($result == null)
            return 0;
        else
            return $result['type'];
    }
}