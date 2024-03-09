<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de solicitudes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Cargar variables de entorno desde el archivo .env
require __DIR__.'/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Obtener los valores de las variables de entorno
$servidor = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
$usuario = $_ENV['DB_USER'];
$contrasena = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];
$mensaje = "";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $idContacto = isset($_GET['idContacto']) ? $_GET['idContacto'] : null;
        $data = json_decode(file_get_contents("php://input"), true);
        $nuevoNombre = isset($data['nombre']) ? $data['nombre'] : null;
        $nuevoTelefono = isset($data['telefono']) ? $data['telefono'] : null;
        $nuevoInstagram = isset($data['instagram']) ? $data['instagram'] : null;
        $nuevoEmail = isset($data['email']) ? $data['email'] : null;
        $nuevaDireccion = isset($data['direccion']) ? $data['direccion'] : null;
        $nuevaLocalidad = isset($data['localidad']) ? $data['localidad'] : null; 

        $sqlUpdate = "UPDATE contacto SET  nombre = :nombre, telefono = :telefono, instagram = :instagram, email = :email, direccion = :direccion, localidad = :localidad WHERE idContacto = :idContacto";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':nombre', $nuevoNombre);
        $sentenciaUpdate->bindParam(':telefono', $nuevoTelefono);
        $sentenciaUpdate->bindParam(':instagram', $nuevoInstagram);
        $sentenciaUpdate->bindParam(':email', $nuevoEmail);
        $sentenciaUpdate->bindParam(':direccion', $nuevaDireccion);
        $sentenciaUpdate->bindParam(':localidad', $nuevaLocalidad); 
        $sentenciaUpdate->bindParam(':idContacto', $idContacto, PDO::PARAM_INT);

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Contacto actualizado correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar el contacto: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }
        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
