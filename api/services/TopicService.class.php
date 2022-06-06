<?php

require_once dirname(__FILE__) . "/BaseService.class.php";
require_once dirname(__FILE__) . "/../dao/TopicDao.class.php";

class TopicService extends BaseService{

    public function __construct() {
        $this->dao = new TopicDao();
    }

    public function getTopics($search, $offset, $limit, $order) {
        if($search)
            return $this->dao->getTopics($search, $offset, $limit, $order);
        else
            return $this->dao->getAll($offset, $limit, $order);
    }

    public function create($topic) {
        if(!isset($topic['name']))
            throw new Exception("Name is not set.");

        return parent::add($topic);
    }

    public function getPosts($id) {
        return $this->dao->getAllPosts($id);
    }

    public function getAdministrators($id) {
        return $this->dao->getAdministrators($id);
    }

    public function setAdministrator($id, $account_id) {
        return $this->dao->setAdministrator($id, $account_id);
    }

    public function getSubscribers($id) {
        return $this->dao->getSubscribers($id);
    }

    public function subscribeAccount($id, $account_id) {
        $this->dao->subscribeAccount($id, $account_id);
    }

    public function getNumberOfSubscribers($id) {
        return $this->dao->getNumberOfSubscribers($id);
    }

}