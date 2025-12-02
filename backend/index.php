<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

// Importamos los Controladores
use MyAPI\Controllers\AuthController;
use MyAPI\Controllers\ResourceController;
use MyAPI\Controllers\StatsController;

require __DIR__ . '/../vendor/autoload.php';


$app = AppFactory::create();


$app->setBasePath('/proyecto/backend');

$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);



$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write("API funcionando correctamente");
    return $response->withHeader('Content-Type', 'text/html; charset=utf-8');
});

$app->get('/health', function (Request $request, Response $response) {
    $data = [
        'status' => 'OK',
        'message' => 'API RESTful funcionando correctamente',
        'timestamp' => date('Y-m-d H:i:s'),
        'endpoints' => [
            '/auth' => 'Autenticacion',
            '/resources' => 'Recursos',
            '/stats' => 'Estadisticas',
            '/health' => 'Estado del API'
        ]
    ];
    $response->getBody()->write(json_encode($data, JSON_PRETTY_PRINT));
    return $response->withHeader('Content-Type', 'application/json');
});

// Rutas para autenticacion
$app->group('/auth', function ($group) {
    $group->post('/login', AuthController::class . ':login');
    $group->post('/signup', AuthController::class . ':register');
    $group->post('/logout', AuthController::class . ':logout');
    $group->get('/validate-email', AuthController::class . ':checkEmail');
    $group->get('/status', AuthController::class . ':status');
});

// Rutas para recursos
$app->group('/resources', function ($group) {
    $group->get('', ResourceController::class . ':getAll');
    $group->post('', ResourceController::class . ':create');
    $group->post('/update', ResourceController::class . ':update');
    $group->post('/delete', ResourceController::class . ':delete');
    $group->get('/search', ResourceController::class . ':search');
    $group->post('/single', ResourceController::class . ':getOne');
    $group->get('/check-name', ResourceController::class . ':getByName');
    $group->post('/download', ResourceController::class . ':registerDownload');
});

//Rutas para estadisticas
$app->group('/stats', function ($group) {
    // CUANTOS USARIOS, RECURSOS Y DESCARGAS
    $group->get('/counts', StatsController::class . ':getCounts');
    //QUE SE DESCARGA
    $group->get('/by-date', StatsController::class . ':getDownloadsByDate');
    $group->get('/by-type', StatsController::class . ':getDownloadsByType');
    $group->get('/top-contributors', StatsController::class . ':getTopContributors');
    $group->get('/top-resources', StatsController::class . ':getTopResources');
    //QUE TEMAS HAY
    $group->get('/by-category', StatsController::class . ':getResourcesByCategory');
    $group->get('/type-abs', StatsController::class . ':getResourcesByType');
});




$app->run();