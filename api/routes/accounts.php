<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route('POST /register', function(){
    $data = Flight::request()->data->getData();
    $user = Flight::accountDao()->getAccountByEmail($data['email']);

    if(isset($user['id'])){
        Flight::json(["message" => "User already exists"], 400);
    } else {
        $result = Flight::accountService()->register($data);
        $returnedUser = Flight::accountService()->getById($result['id']);
        unset($returnedUser['password']);
        $jwt = JWT::encode($returnedUser, Config::JWT_SECRET, 'HS256');
        Flight::json(["token" => $jwt]);
    }
});

Flight::route('POST /login', function(){
    $data = Flight::request()->data->getData();
    $user = Flight::accountDao()->getAccountByEmail($data['email']);

    if(isset($user['id'])){
        if($user['password'] == $data['password']){
            unset($user['password']);
            $jwt = JWT::encode($user, Config::JWT_SECRET, 'HS256');
            Flight::json(["token" => $jwt]);
        } else {
            Flight::json(["message" => "Wrong password."], 404);
        }
    } else {
        Flight::json(["message" => "User does not exist."], 404);
    }
});

Flight::route('GET /accounts', function(){
    $search = Flight::query('search');
    $offset = Flight::query('offset', 0);
    $limit = Flight::query('limit', 25);
    $order = Flight::query('order', "-id");

    Flight::json(Flight::accountService()->getAccounts($search, $offset, $limit, $order));
});

Flight::route('GET /accounts/@id', function($id){
    $account = Flight::accountService()->getById($id);
    Flight::json($account);
});

Flight::route('GET /accounts/@username', function($username){
    $account = Flight::accountService()->getByUsername($username);
    Flight::json($account);
});

Flight::route('PUT /accounts/@id', function($id){
    $data = Flight::request()->data->getData();
    $account = Flight::accountService()->update($id, $data);
    Flight::json($account);
});

Flight::route('GET /accounts/subscriptions/list', function(){
    $id = Flight::get('user')['id'];
    $subscriptions = Flight::accountService()->getSubscriptions($id);
    Flight::json($subscriptions);
});

Flight::route('GET /accounts/points/@id', function($id){
    $points = Flight::accountService()->getPoints($id);
    Flight::json($points);
});

Flight::route('GET /profile/@id', function($id){
    if($id == 'user')
        $id = FLight::get('user')['id'];

    $account = Flight::accountService()->getById($id);
    $topics = Flight::accountService()->getTopicCount($id);
    $posts = Flight::accountService()->getPostCount($id);
    $comments = Flight::accountService()->getCommentCount($id);
    $profile = ['username' => $account['username'],
                'points' => $account['points'],
                'topics' => $topics,
                'posts' => $posts,
                'comments' => $comments];
    Flight::json($profile);
});

Flight::route('PUT /accounts/deactivate/@id', function($id){
    $account = Flight::accountService()->update($id, ["status" => "inactive"]);
    Flight::json($account);
});