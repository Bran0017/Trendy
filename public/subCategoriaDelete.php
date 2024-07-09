<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
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

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $idSubCategoria = isset($_GET['idSubCategoria']) ? $_GET['idSubCategoria'] : null; // Cambio de variable a "idSubCategoria"

        if (!$idSubCategoria) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de subcategoría para eliminarla."]); // Cambio en el mensaje de error
            exit;
        }

        // Eliminar la subcategoría de la base de datos
        $sqlDelete = "DELETE FROM subcategorias WHERE idSubCategoria = :idSubCategoria"; // Cambio en la tabla
        $sentenciaDelete = $conexion->prepare($sqlDelete);
        $sentenciaDelete->bindParam(':idSubCategoria', $idSubCategoria, PDO::PARAM_INT); // Cambio en el parámetro de enlace

        if ($sentenciaDelete->execute()) {
            echo json_encode(["mensaje" => "Subcategoría eliminada correctamente"]); // Cambio en el mensaje de éxito
        } else {
            echo json_encode(["error" => "Error al eliminar la subcategoría"]); // Cambio en el mensaje de error
        }

        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
