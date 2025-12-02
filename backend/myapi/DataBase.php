<?php
namespace MyAPI;

abstract class DataBase
{
    protected $conexion;
    protected $data = [];

    //ESTO DEBERIAMOS NORMALIZARO PAR TENER TODOS LO MISMO EN TODOS LOS ARCHIVOS
    private $db_host = 'localhost';
    private $db_user = 'root';
    private $db_pass = '1234567890';
    private $db_name = 'digital_resources';

    public function __construct()
    {
        $this->conexion = @mysqli_connect(
            $this->db_host,
            $this->db_user,
            $this->db_pass,
            $this->db_name
        );

        if (!$this->conexion) {
            die("¡Error crítico de conexión DB! Detalle: " . mysqli_connect_error());
        }
    }

    public function getData()
    {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }
}