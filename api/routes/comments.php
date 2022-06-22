<?php

Flight::route('GET /comments', function(){
    $account = Flight::query('account_id');
    $offset = Flight::query('offset', 0);
    $limit = Flight::query('limit', 25);
    $order = Flight::query('order', "-id");

    Flight::json(Flight::commentService()->getComments($account, $offset, $limit, $order));
});

Flight::route('GET /comments/@id', function($id){
    $comment = Flight::commentService()->getById($id);
    Flight::json($comment);
});

Flight::route('POST /comments/create', function(){
    $data = Flight::request()->data->getData();
    $comment = Flight::commentService()->create($data);
    Flight::json($comment);
});

Flight::route('PUT /comments/@id', function($id){
    $data = Flight::request()->data->getData();
    $comment = Flight::commentService()->update($id, $data);
    Flight::json($comment);
});

Flight::route('PUT /comments/post/@post_id', function($post_id){
    $data = Flight::request()->data->getData();
    Flight::commentService()->updateByPost($post_id, $data);
    Flight::json(['message' => "Comments sucessfully updated."]);
});

Flight::route('GET /comments/voters/@id', function($id){
    $votes = Flight::commentService()->getVoters($id);
    Flight::json($votes);
});

Flight::route('POST /comments/vote/@id', function($id){
    $account = Flight::request()->data->getData()['account_id'];
    $type = Flight::request()->data->getData()['type'];
    Flight::commentService()->vote($id, $account, $type);
});