<?php

include '.env';



$conexion = new mysqli($DB_HOST,$DB_NAME,$DB_USER,$DB_PASS);

if ($conexion-> connect_errno) {
    die("conexion fallida" . $conexion->connect_errno);
} else {
    echo "conectado";
}

?>
