<?php

require_once dirname(__FILE__) . "/BaseDao.class.php";

class AccountDao extends BaseDao{

    public function __construct() {
        parent::__construct("accounts");
    }

    public function getAccountByEmail($email) {
        return $this->queryUnique("SELECT * FROM accounts WHERE email = :email", ['email' => $email]);
    }

    public function updateAccountByEmail($email, $account) {
        $this->update($email, $account, "email");
    }

    public function getSubscriptions($id) {
        return $this->query("SELECT topics.name
                            FROM subscriptions
                            JOIN accounts ON accounts.id = subscriptions.account_id
                            JOIN topics ON topics.id = subscriptions.topic_id
                            WHERE subscriptions.account_id = :id", ['id' => $id]);
    }

    public function updatePoints($post_id, $type) {
        $accountToUpdate = ($this->queryUnique("SELECT a.id, a.points 
                                                FROM posts p
                                                JOIN accounts a ON a.id = p.account_id
                                                WHERE p.id = :post_id", ['post_id' => $post_id]));

    $this->update($accountToUpdate['id'], ['points' => $accountToUpdate['points'] + $type]);
    }

    public function getPoints($id) {
        return array_values($this->queryUnique("SELECT points FROM accounts WHERE id = :id", ['id' => $id]))[0];
    }

    public function getAccounts($search, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT * 
                            FROM accounts 
                            WHERE LOWER(username) 
                            LIKE CONCAT('%', :username, '%') 
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ['username' => strtolower($search)]);
    }

    public function getAccountByToken($token) {
        return $this->queryUnique("SELECT * FROM accounts WHERE token = :token", ['token' => $token]);
    }

}

?>