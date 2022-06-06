<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once dirname(__FILE__) . '/../vendor/autoload.php';

require_once dirname(__FILE__) . '/routes/accounts.php';
require_once dirname(__FILE__) . '/routes/topics.php';
require_once dirname(__FILE__) . '/routes/posts.php';
require_once dirname(__FILE__) . '/routes/comments.php';

require_once dirname(__FILE__) . '/services/AccountService.class.php';
require_once dirname(__FILE__) . '/services/TopicService.class.php';
require_once dirname(__FILE__) . '/services/PostService.class.php';
require_once dirname(__FILE__) . '/services/CommentService.class.php';

Flight::set('flight.log_errors', true);

Flight::register('accountService', 'AccountService');
Flight::register('topicService', 'TopicService');
Flight::register('postService', 'PostService');
Flight::register('commentService', 'CommentService');

Flight::map('query', function($name, $defaultValue = NULL) {
    $request = Flight::request();

    $queryParam = @$request->query->getData()[$name];
    $queryParam = $queryParam ? $queryParam : $defaultValue;
    return $queryParam;
});

Flight::route('GET /', function(){
    Flight::redirect('../dummy.html');
});

Flight::start();