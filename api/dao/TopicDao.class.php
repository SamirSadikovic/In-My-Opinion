<?php
require_once dirname(__FILE__) . "/BaseDao.class.php";

class TopicDao extends BaseDao{

    public function __construct(){
        parent::__construct("topics");
    }

    public function getAllPosts($id) {
        return $this->query("SELECT p.*, COALESCE(SUM(pv.type), 0) AS votes
                            FROM posts p
                            LEFT JOIN post_votes pv ON pv.post_id = p.id
                            WHERE p.topic_id = :id
                            GROUP BY p.id", ['id' => $id]);
    }

    public function getTopics($search, $offset, $limit, $order = "-id") {
        list($orderColumn, $orderDirection) = self::parseOrder($order);
        
        return $this->query("SELECT * 
                            FROM topics 
                            WHERE LOWER(name) 
                            LIKE CONCAT('%', :name, '%') 
                            ORDER BY ${orderColumn} ${orderDirection}
                            LIMIT ${limit} OFFSET ${offset}", ['name' => strtolower($search)]);
    }

    public function getCreator($id) {
        return $this->query("SELECT *
                            FROM accounts
                            JOIN topics ON topics.account_id = accounts.id
                            WHERE topics.id = :id", ['id' => $id]);
    }

    public function subscribeAccount($id, $account_id) {
        $this->insert("subscriptions", ['topic_id' => $id, 'account_id' => $account_id]);
    }

    public function unsubscribeAccount($id, $account_id) {
        $this->deleteComposite("account_id", $account_id, "topic_id", $id, "subscriptions");
    }

    public function getSubscribers($id) {
        return $this->query("SELECT *
                            FROM subscriptions
                            JOIN accounts ON accounts.id = subscriptions.account_id
                            JOIN topics ON topics.id = subscriptions.topic_id
                            WHERE topic_id = :id", ['id' => $id]);
    }

    public function getNumberOfSubscribers($id) {
        return count($this->getSubscribers($id));
    }
}
?>