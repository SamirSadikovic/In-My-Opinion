<?php

require_once dirname(__FILE__) . "/BaseService.class.php";
require_once dirname(__FILE__) . "/../dao/CommentDao.class.php";

class CommentService extends BaseService{

    public function __construct() {
        $this->dao = new CommentDao();
    }

    public function getComments($account, $offset, $limit, $order) {
        if($account)
            return $this->dao->getComments($account, $offset, $limit, $order);
        else
            return $this->dao->getAll($offset, $limit, $order);
    }

    public function create($comment) {
        if(!isset($comment['body']))
            throw new Exception("Body is not set.");

        return parent::add($comment);
    }

    public function updateByPost($post_id, $data) {
        $this->dao->updateByPost($post_id, $data);
    }

    public function getVotes($id) {
        return $this->dao->getVotes($id);
    }

    public function vote($id, $account_id, $type) {
        $this->dao->vote($id, $account_id, $type);
    }

}