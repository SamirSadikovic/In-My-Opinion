<?php

require_once dirname(__FILE__) . "/BaseService.class.php";
require_once dirname(__FILE__) . "/../dao/AccountDao.class.php";

class AccountService extends BaseService{

    private $smtpClient;

    public function __construct() {
        $this->dao = new AccountDao();
    }

    public function getAccounts($search, $offset, $limit, $order) {
        if($search)
            return $this->dao->getAccounts($search, $offset, $limit, $order);
        else
            return $this->dao->getAll($offset, $limit, $order);
    }

    public function register($account) {
        if(!isset($account['username']))
            throw new Exception("Username is not set.");
        else if(!isset($account['email']))
            throw new Exception("Email is not set.");
        else if(!isset($account['password']))
            throw new Exception("Password is not set.");

        try {
            parent::add($account);
        } catch(Exception $e) {
            if(str_contains($e->getMessage(), "accounts.email_UNIQUE"))
                throw new Exception("Account with the same email already exists: " . $account['email'], 400, $e);
            else
                throw $e;
        }
        return $account;
    }

    public function getSubscriptions($id) {
        return $this->dao->getSubscriptions($id);
    }

    public function getPoints($id) {
        return $this->dao->getPoints($id);
    }

}