<?php

Flight::route('GET /posts', function(){
    $search = Flight::query('search');
    $offset = Flight::query('offset', 0);
    $limit = Flight::query('limit', 25);
    $order = Flight::query('order', "-id");

    Flight::json(Flight::postService()->getPosts($search, $offset, $limit, $order));
});

Flight::route('GET /posts/@id', function($id){
    $account_id = Flight::get('user')['id'];
    $post = Flight::postService()->getById($id);
    $post['voteByUser'] = Flight::accountDao()->voteTypePost($post['id'], $account_id);
    Flight::json($post);
});

Flight::route('POST /posts/create', function(){
    $account_id = Flight::get('user')['id'];
    $data = Flight::request()->data->getData();
    $data['account_id'] = $account_id;
    $post = Flight::postService()->create($data);
    $post['username'] = Flight::get('user')['username'];
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
    $account_id = Flight::get('user')['id'];
    $postComments = [];
    foreach ($comments as $comment) {
        $comment['voteByUser'] = Flight::accountDao()->voteTypeComment($comment['id'], $account_id);
        array_push($postComments, $comment);
    }
    //return posts with like/dislike from current user
    Flight::json($postComments);
});

Flight::route('GET /posts/voters/@id/@type', function($id, $type){
    $votes = Flight::postService()->getVoters($id, $type);
    Flight::json($votes);
});

Flight::route('POST /posts/vote/@id', function($id){
    $account_id = Flight::get('user')['id'];
    $type = Flight::request()->data->getData()['type'];
    $results = Flight::postService()->vote($id, $account_id, $type);
    Flight::json($results);
});