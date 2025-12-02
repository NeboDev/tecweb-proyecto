<?php
namespace MyAPI\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use MyAPI\DataBase;
class StatsController extends DataBase
{
    public function __construct()
    {
        parent::__construct();
    }

    public function getCounts(Request $request, Response $response)
    {
        $data = [];

        $results = $this->conexion->query("SELECT COUNT(*) as total FROM resources WHERE `delete` = 0");
        $data['resources'] = $results->fetch_assoc()['total'];

        $results = $this->conexion->query("SELECT COUNT(*) as total FROM users");
        $data['users'] = $results->fetch_assoc()['total'];

        $results = $this->conexion->query("SELECT COUNT(*) as total FROM downloads");
        $data['downloads'] = $results->fetch_assoc()['total'];

        return $this->jsonResponse($response, $data);
    }

    public function getDownloadsByDate(Request $request, Response $response)
    {
        $sql = "SELECT DATE(date_download) as fecha, COUNT(*) as cantidad 
                FROM downloads 
                GROUP BY DATE(date_download) 
                ORDER BY fecha ASC LIMIT 10";

        $result = $this->conexion->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);

        return $this->jsonResponse($response, $data);
    }

    public function getDownloadsByType(Request $request, Response $response)
    {
        $sql = "SELECT r.language, COUNT(*) as cantidad 
                FROM downloads d
                JOIN resources r ON d.id_resource = r.id_resource
                GROUP BY r.language";
        $results = $this->conexion->query($sql);
        $data = $results->fetch_all(MYSQLI_ASSOC);
        return $this->jsonResponse($response, $data);
    }

    public function getTopContributors(Request $request, Response $response)
    {
        // Contamos cuantos recursos que no estan eliminados tiene cada usuario
        $sql = "SELECT u.name, COUNT(r.id_resource) as total_uploads 
                FROM users u 
                JOIN resources r ON u.id = r.id_user 
                WHERE r.`delete` = 0 
                GROUP BY u.id 
                ORDER BY total_uploads DESC 
                LIMIT 3";

        $result = $this->conexion->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);

        return $this->jsonResponse($response, $data);
    }

    public function getTopResources(Request $request, Response $response)
    {
        // Contamos cuantas veces aparece cada recurso en la tabla downloads
        $sql = "SELECT r.name, COUNT(d.id_download) as total_downloads 
                FROM resources r 
                LEFT JOIN downloads d ON r.id_resource = d.id_resource 
                WHERE r.`delete` = 0 
                GROUP BY r.id_resource 
                ORDER BY total_downloads DESC 
                LIMIT 5";

        $result = $this->conexion->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);

        return $this->jsonResponse($response, $data);
    }

    public function getResourcesByCategory(Request $request, Response $response)
    {
        $sql = "SELECT category, COUNT(*) as cantidad 
                FROM resources 
                WHERE `delete` = 0 
                GROUP BY category";

        $result = $this->conexion->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);

        return $this->jsonResponse($response, $data);
    }

    public function getResourcesByType(Request $request, Response $response)
    {
        $sql = "SELECT type, COUNT(*) as cantidad 
                FROM resources 
                WHERE `delete` = 0 
                GROUP BY type";

        $result = $this->conexion->query($sql);
        $data = $result->fetch_all(MYSQLI_ASSOC);

        return $this->jsonResponse($response, $data);
    }

    private function jsonResponse(Response $response, $data, $status = 200)
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

}