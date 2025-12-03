<?php
namespace MyAPI\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use MyAPI\DataBase;

class AuthController extends DataBase
{
    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        parent::__construct();
    }

    public function login(Request $request, Response $response)
    {
        $params = $request->getParsedBody();
        $email = trim($params['email'] ?? '');
        $password = $params['password'] ?? '';

        $sql = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        $user = $result->fetch_assoc();
        if (!$user) {
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => "DEBUG: Error en el email o contraseña"
            ], 401);
        }

        if (!password_verify($password, $user["password_hash"])) {
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => "DEBUG: Error en el email o contraseña"
            ], 401);
        }


        session_regenerate_id();
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["user_name"] = $user["name"];

        // Registrar acceso
        $sqlAccess = "INSERT INTO access (id_user, date_access) VALUES (?, NOW())";
        $stmtAccess = $this->conexion->prepare($sqlAccess);
        if ($stmtAccess) {
            $stmtAccess->bind_param("i", $user['id']);
            $stmtAccess->execute();
            $stmtAccess->close();
        }

        return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Login correcto']);
    }

    public function register(Request $request, Response $response)
    {
        $params = $request->getParsedBody();

        if (empty($params["name"]))
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'Nombre requerido'], 400);
        if (strlen($params["password"]) < 8)
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'La contraseña debe tener al menos 8 caracteres'], 400);
        if (!preg_match('/[a-z]/i', $params["password"]))
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'La contraseña debe tener al menos una letra'], 400);
        if (!preg_match('/[0-9]/', $params["password"]))
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'La contraseña debe tener al menos un número'], 400);
        if ($params["password"] !== $params["password_confirmation"])
            return $this->jsonResponse($response, ['status' => 'error', 'message' => 'No coinciden'], 400);

        $password_hash = password_hash($params["password"], PASSWORD_DEFAULT);


        $responseData = [];
        $statusCode = 200;

        $sql = "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

        $stmt = $this->conexion->prepare($sql);

        if ($stmt) {
            $stmt->bind_param("sss", $params["name"], $params["email"], $password_hash);

            try {

                $stmt->execute();

                $responseData = ['status' => 'success', 'message' => 'Usuario registrado'];
                $statusCode = 200;

            } catch (\mysqli_sql_exception $e) {

                if ($e->getCode() === 1062) {
                    $responseData = ['status' => 'error', 'message' => 'El email ya existe'];
                    $statusCode = 409; // el google dice que es 409 para duplicados
                } else {
                    $responseData = ['status' => 'error', 'message' => 'Error de BD: ' . $e->getMessage()];
                    $statusCode = 500;
                }
            }

            $stmt->close();
        } else {
            $responseData = ['status' => 'error', 'message' => 'Error al preparar consulta'];
            $statusCode = 500;
        }

        return $this->jsonResponse($response, $responseData, $statusCode);
    }

    public function logout(Request $request, Response $response)
    {
        session_destroy();
        return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Logout correcto']);
    }

    public function checkEmail(Request $request, Response $response)
    {
        $queryParams = $request->getQueryParams();
        $email = $queryParams['email'] ?? '';

        $sql = "SELECT * FROM users WHERE email = '{$email}'";
        $result = $this->conexion->query($sql);

        $is_available = ($result->num_rows === 0);
        return $this->jsonResponse($response, ["available" => $is_available]);
    }

    public function status(Request $request, Response $response)
    {
        if (isset($_SESSION['user_id'])) {
            return $this->jsonResponse($response, [
                'is_logged_in' => true,
                'user' => [
                    'id' => $_SESSION['user_id'],
                    'name' => $_SESSION['user_name'] ?? ''
                ]
            ]);
        }
        return $this->jsonResponse($response, ['is_logged_in' => false]);
    }

    private function jsonResponse(Response $response, $data, $status = 200)
    {
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

}