<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once dirname(__FILE__) . '/../vendor/autoload.php';

require_once dirname(__FILE__) . '/services/AccountService.class.php';
require_once dirname(__FILE__) . '/services/TopicService.class.php';
require_once dirname(__FILE__) . '/services/PostService.class.php';
require_once dirname(__FILE__) . '/services/CommentService.class.php';

Flight::map('query', function($name, $defaultValue = NULL) {
    $request = Flight::request();

    $queryParam = @$request->query->getData()[$name];
    $queryParam = $queryParam ? $queryParam : $defaultValue;
    return $queryParam;
});

Flight::register('accountDao', 'AccountDao');
Flight::register('commentDao', 'CommentDao');
Flight::register('postDao', 'PostDao');
Flight::register('topicDao', 'TopicDao');

Flight::register('accountService', 'AccountService');
Flight::register('topicService', 'TopicService');
Flight::register('postService', 'PostService');
Flight::register('commentService', 'CommentService');

Flight::route('/*', function(){
    $path = Flight::request()->url;
    echo($path);
    die;
    if ($path == '/login' || $path == '/')
        return TRUE;
        
 
    $headers = getallheaders();
    if (@!$headers['Authorization']){
        Flight::json(["message" => "Authorization is missing"], 403);
        return FALSE;
    }else{
        try {
        $decoded = (array)JWT::decode($headers['Authorization'], new Key(Config::JWT_SECRET, 'HS256'));
        Flight::set('user', $decoded);
        return TRUE;
        } catch (\Exception $e) {
        Flight::json(["message" => "Authorization token is not valid"], 403);
        return FALSE;
        }
    }
});

Flight::route('GET /', function(){
    Flight::redirect('../pages/index.html?topic=1');
});

require_once dirname(__FILE__) . '/routes/accounts.php';
require_once dirname(__FILE__) . '/routes/topics.php';
require_once dirname(__FILE__) . '/routes/posts.php';
require_once dirname(__FILE__) . '/routes/comments.php';

Flight::start();