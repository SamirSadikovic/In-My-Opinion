<?php

require_once dirname(__FILE__) . "/BaseService.class.php";
require_once dirname(__FILE__) . "/../dao/PostDao.class.php";

class PostService extends BaseService{

    public function __construct() {
        $this->dao = new PostDao();
    }

    public function getPosts($search, $offset, $limit, $order) {
        if($search)
            return $this->dao->getPosts($search, $offset, $limit, $order);
        else
            return $this->dao->getAll($offset, $limit, $order);
    }

    public function create($post) {
        if(!isset($post['title']))
            throw new Exception("Title is not set.");

        return parent::add($post);
    }

    public function updateByTopic($topic_id, $data) {
        $this->dao->updateByTopic($topic_id, $data);
    }

    public function getComments($id) {
        return $this->dao->getAllComments($id);
    }

    public function getVoters($id) {
        return $this->dao->getVoters($id);
    }

    public function vote($id, $account_id, $type) {
        $this->dao->vote($id, $account_id, $type);
    }
}