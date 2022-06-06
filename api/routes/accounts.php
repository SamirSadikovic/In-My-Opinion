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

Flight::route('GET /accounts/confirm/@token', function($token){
    Flight::accountService()->confirm($token);
    Flight::json(['message' => "Your account has been activated."]);
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