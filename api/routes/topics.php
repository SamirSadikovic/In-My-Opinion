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
    $account_id = Flight::get('user')['id'];
    $feedPosts = [];
    foreach ($posts as $post) {
        $post['voteByUser'] = Flight::accountDao()->voteTypePost($post['id'], $account_id);
        array_push($feedPosts, $post);
    }
    //return posts with like/dislike from current user
    Flight::json($feedPosts);
});

Flight::route('GET /topics/creator/@id', function($id){
    $creator = Flight::topicService()->getCreator($id);
    Flight::json($creator);
});

Flight::route('GET /topics/subscriptions/@id', function($id){
    $subscribers = Flight::topicService()->getSubscribers($id);
    Flight::json($subscribers);
});

Flight::route('POST /topics/subscribe/@id', function($id){
    $account_id = Flight::get('user')['id'];
    Flight::topicService()->subscribeAccount($id, $account_id);
    Flight::json(['message' => "You have been subscribed."]);
});

Flight::route('DELETE /topics/unsubscribe/@id', function($id){
    $account_id = Flight::get('user')['id'];
    Flight::topicService()->unsubscribeAccount($id, $account_id);
    Flight::json(['message' => "You have been unsubscribed."]);
});

Flight::route('GET /topics/subscriptions/number/@id', function($id){
    $number = Flight::topicService()->getNumberOfSubscribers($id);
    Flight::json($number);
});