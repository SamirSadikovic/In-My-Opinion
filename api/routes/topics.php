<?php

Flight::route('GET /topics', function(){
    $search = Flight::query('search');
    $offset = Flight::query('offset', 0);
    $limit = Flight::query('limit', 25);
    $order = Flight::query('order', "-id");

    Flight::json(Flight::topicService()->getTopics($search, $offset, $limit, $order));
});

Flight::route('GET /topics/@id', function($id){
    $topic = Flight::topicService()->getById($id);
    Flight::json($topic);
});

Flight::route('POST /topics/create', function(){
    $data = Flight::request()->data->getData();
    $topic = Flight::topicService()->create($data);
    Flight::json($topic);
});

Flight::route('PUT /topics/@id', function($id){
    $data = Flight::request()->data->getData();
    $topic = Flight::topicService()->update($id, $data);
    Flight::json($topic);
});

Flight::route('GET /topics/posts/@id', function($id){
    $posts = Flight::topicService()->getPosts($id);
    Flight::json($posts);
});

Flight::route('GET /topics/admins/@id', function($id){
    $admins = Flight::topicService()->getAdministrators($id);
    Flight::json($admins);
});

Flight::route('POST /topics/admins/@id', function($id){
    $account = Flight::request()->data->getData()['account_id'];
    $admin = Flight::topicService()->setAdministrator($id, $account);
    Flight::json($admin);
});

Flight::route('GET /topics/subscriptions/@id', function($id){
    $subscribers = Flight::topicService()->getSubscribers($id);
    Flight::json($subscribers);
});

Flight::route('POST /topics/subscriptions/@id', function($id){
    $account = Flight::request()->data->getData()['account_id'];
    Flight::topicService()->subscribeAccount($id, $account);
    Flight::json(['message' => "You have been subscribed."]);
});

Flight::route('GET /topics/subscriptions/number/@id', function($id){
    $number = Flight::topicService()->getNumberOfSubscribers($id);
    Flight::json($number);
});