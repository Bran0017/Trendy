<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $nombre = $_POST['nombre'];
        $telefono = $_POST['telefono'];
        $instagram = $_POST['instagram'];
        $email = $_POST['email'];
        $direccion = $_POST['direccion'];
        $facebook = $_POST['facebook'];

        if (!empty($telefono) && !empty($instagram) && !empty($email) && !empty($direccion) && !empty($facebook) && !empty($nombre)) {

            // Almacenar en la base de datos
            $sqlInsert = "INSERT INTO `contacto` (nombre, telefono, instagram, email, direccion, facebook) 
                          VALUES (:nombre ,:telefono, :instagram, :email, :direccion, :facebook)";
            $stmt = $conexion->prepare($sqlInsert);
            $stmt->bindParam(':nombre', $nombre);
            $stmt->bindParam(':telefono', $telefono);
            $stmt->bindParam(':instagram', $instagram);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':direccion', $direccion);
            $stmt->bindParam(':facebook', $facebook);

            $stmt->execute();

            // Obtener el ID de la última inserción
            $lastId = $conexion->lastInsertId();

            // Respuesta JSON con el mensaje y el ID del nuevo contacto
            echo json_encode([
                "mensaje" => "Contacto creado exitosamente",
                "idContacto" => $lastId
            ]);
        } else {
            echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
