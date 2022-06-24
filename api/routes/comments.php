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
    $account_id = Flight::get('user')['id'];
    $data = Flight::request()->data->getData();
    $data['account_id'] = $account_id;
    $comment = Flight::commentService()->create($data);
    $comment['username'] = Flight::get('user')['username'];
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
    $account_id = Flight::get('user')['id'];
    $type = Flight::request()->data->getData()['type'];
    $results = Flight::commentService()->vote($id, $account_id, $type);
    Flight::json($results);
});