<?php
namespace MyAPI\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use MyAPI\DataBase;

class ResourceController extends DataBase
{
    public function __construct()
    {
        parent::__construct();
    }

    public function create(Request $request, Response $response)
    {
        $params = $request->getParsedBody();
        $responseArray = ["status" => "error", "message" => "Datos incompletos"];

        if (isset($params['name'])) {
            // Verificar si existe (SQL Directo)
            $name = $params['name'];
            $sqlCheck = "SELECT * FROM resources WHERE name = '{$name}' AND `delete` = 0";
            $resultCheck = $this->conexion->query($sqlCheck);

            if ($resultCheck->num_rows == 0) {


                $sqlInsert = "INSERT INTO resources (name,departamento,empresa,description,route,type,language,category,date,id_user) 
                              VALUES (
                                  '{$params['name']}', 
                                  '{$params['departamento']}',
                                  '{$params['empresa']}',
                                  '{$params['description']}', 
                                  '{$params['route']}', 
                                  '{$params['type']}', 
                                  '{$params['language']}', 
                                  '{$params['category']}', 
                                  '{$params['date']}', 
                                  '{$params['id_user']}'
                              )";

                if ($this->conexion->query($sqlInsert)) {
                    $responseArray = [
                        "status" => "success",
                        "message" => "Recurso agregado",
                        "id" => $this->conexion->insert_id
                    ];
                } else {
                    $responseArray["message"] = "Error SQL: " . $this->conexion->error;
                }
            } else {
                $responseArray["message"] = "Ya existe un recurso con ese nombre";
            }
        }

        return $this->jsonResponse($response, $responseArray);
    }


    public function delete(Request $request, Response $response)
    {
        $params = $request->getParsedBody();
        $id = $params['id'] ?? null;
        $responseArray = ["status" => "error", "message" => "ID no proporcionado"];

        if ($id) {
            // SQL Directo
            $sql = "UPDATE resources SET `delete` = 1 WHERE id_resource = {$id}";

            if ($this->conexion->query($sql)) {
                $responseArray = ["status" => "success", "message" => "Recurso eliminado"];
            } else {
                $responseArray["message"] = "Error SQL: " . $this->conexion->error;
            }
        }

        return $this->jsonResponse($response, $responseArray);
    }

    public function getAll(Request $request, Response $response)
    {
        $data = [];
        // SQL Directo
        $sql = "SELECT * FROM resources WHERE `delete` = 0";
        $result = $this->conexion->query($sql);

        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        }

        return $this->jsonResponse($response, $data);
    }

    public function getUserResources(Request $request, Response $response)
    {
        $id = $request->getQueryParams()['id_user'] ?? null;
        $data = [];

        $sql = "SELECT * FROM resources WHERE id_user = {$id} AND `delete` = 0";
        $result = $this->conexion->query($sql);

        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        }

        return $this->jsonResponse($response, $data);
    }

    public function search(Request $request, Response $response)
    {
        $queryParams = $request->getQueryParams();
        $search = $queryParams['search'] ?? '';

        // SQL Directo con concatenación de %
        $sql = "SELECT * FROM resources WHERE (name LIKE '%{$search}%' OR description LIKE '%{$search}%' OR type LIKE '%{$search}%') AND `delete` = 0";

        $result = $this->conexion->query($sql);
        $data = [];

        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
            $result->free();
        }

        return $this->jsonResponse($response, $data);
    }


    public function getOne(Request $request, Response $response)
    {
        $params = $request->getParsedBody();
        $id = $params['id'] ?? 0;

        $sql = "SELECT * FROM resources WHERE id_resource = {$id}";
        $result = $this->conexion->query($sql);

        $data = [];
        if ($result) {
            $data = $result->fetch_assoc();
        }

        return $this->jsonResponse($response, $data ?: []);
    }


    public function getByName(Request $request, Response $response)
    {
        $queryParams = $request->getQueryParams();
        $name = $queryParams['name'] ?? '';

        $sql = "SELECT * FROM resources WHERE name = '{$name}' AND `delete` = 0";
        $result = $this->conexion->query($sql);

        $data = [];
        if ($result) {
            $data = $result->fetch_all(MYSQLI_ASSOC);
        }

        return $this->jsonResponse($response, $data);
    }

    public function update(Request $request, Response $response)
    {
        $params = $request->getParsedBody();
        $responseArray = ["status" => "error", "message" => "Datos incompletos"];

        if (isset($params['id_resource'])) {
            // SQL Directo concatenado
            $sql = "UPDATE resources SET 
                        name = '{$params['name']}', 
                        description = '{$params['description']}', 
                        route = '{$params['route']}', 
                        type = '{$params['type']}', 
                        language = '{$params['language']}', 
                        category = '{$params['category']}', 
                        date = '{$params['date']}' 
                    WHERE id_resource = {$params['id_resource']}";

            if ($this->conexion->query($sql)) {
                $responseArray = ["status" => "success", "message" => "Recurso actualizado"];
            } else {
                $responseArray["message"] = "Error SQL: " . $this->conexion->error;
            }
        }

        return $this->jsonResponse($response, $responseArray);
    }

    public function registerDownload(Request $request, Response $response)
    {
        $params = $request->getParsedBody();

        if (empty($params['id_resource']) || empty($params['id_user'])) {
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Faltan IDs'], 400);
        }

        $id_resource = $params['id_resource'];
        $id_user = $params['id_user'];

        $sql = "INSERT INTO downloads (id_user, id_resource, date_download) 
                VALUES ({$id_user}, {$id_resource}, NOW())";

        if ($this->conexion->query($sql)) {
            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Descarga registrada']);
        } else {
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Error SQL: ' . $this->conexion->error], 500);
        }
    }

    private function jsonResponse(Response $response, $data, $status = 200)
    {
        $payload = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        $response->getBody()->write($payload);
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }
}