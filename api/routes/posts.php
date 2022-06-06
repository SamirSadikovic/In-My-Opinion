<?php

Flight::route('GET /posts', function(){
    $search = Flight::query('search');
    $offset = Flight::query('offset', 0);
    $limit = Flight::query('limit', 25);
    $order = Flight::query('order', "-id");

    Flight::json(Flight::postService()->getPosts($search, $offset, $limit, $order));
});

Flight::route('GET /posts/@id', function($id){
    $post = Flight::postService()->getById($id);
    Flight::json($post);
});

Flight::route('POST /posts/create', function(){
    $data = Flight::request()->data->getData();
    $post = Flight::postService()->create($data);
    Flight::json($post);
});

Flight::route('PUT /posts/@id', function($id){
    $data = Flight::request()->data->getData();
    $post = Flight::postService()->update($id, $data);
    Flight::json($post);
});

Flight::route('PUT /posts/topic/@topic_id', function($topic_id){
    $data = Flight::request()->data->getData();
    Flight::postService()->updateByTopic($topic_id, $data);
    Flight::json(['message' => "Posts sucessfully updated."]);
});

Flight::route('GET /posts/comments/@id', function($id){
    $comments = Flight::postService()->getComments($id);
    Flight::json($comments);
});

Flight::route('GET /posts/votes/@id', function($id){
    $votes = Flight::postService()->getVotes($id);
    Flight::json($votes);
});

Flight::route('POST /posts/vote/@id', function($id){
    $account = Flight::request()->data->getData()['account_id'];
    $type = Flight::request()->data->getData()['type'];
    Flight::postService()->vote($id, $account, $type);
});