<?php

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

Flight::route('POST /accounts/register', function(){
    $data = Flight::request()->data->getData();
    $result = Flight::accountService()->register($data);
    Flight::json($result);
});

Flight::route('PUT /accounts/@id', function($id){
    $data = Flight::request()->data->getData();
    $account = Flight::accountService()->update($id, $data);
    Flight::json($account);
});

Flight::route('GET /accounts/subscriptions/@id', function($id){
    $subscriptions = Flight::accountService()->getSubscriptions($id);
    Flight::json($subscriptions);
});

Flight::route('GET /accounts/points/@id', function($id){
    $points = Flight::accountService()->getPoints($id);
    Flight::json($points);
});

Flight::route('GET /accounts/topics/number/@id', function($id){
    $points = Flight::accountService()->getTopicCount($id);
    Flight::json($points);
});

Flight::route('GET /accounts/posts/number/@id', function($id){
    $points = Flight::accountService()->getPostCount($id);
    Flight::json($points);
});

Flight::route('GET /accounts/comments/number/@id', function($id){
    $points = Flight::accountService()->getCommentCount($id);
    Flight::json($points);
});

Flight::route('PUT /accounts/deactivate/@id', function($id){
    $account = Flight::accountService()->update($id, ["status" => "inactive"]);
    Flight::json($account);
});