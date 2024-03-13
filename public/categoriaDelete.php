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
        $idCategoria = isset($_GET['idCategoria']) ? $_GET['idCategoria'] : null;

        if (!$idCategoria) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de categoría para eliminarla."]);
            exit;
        }

        // Eliminar la categoría de la base de datos
        $sqlDelete = "DELETE FROM categorias WHERE idCategoria = :idCategoria";
        $sentenciaDelete = $conexion->prepare($sqlDelete);
        $sentenciaDelete->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);

        if ($sentenciaDelete->execute()) {
            echo json_encode(["mensaje" => "Categoría eliminada correctamente"]);
        } else {
            echo json_encode(["error" => "Error al eliminar la categoría"]);
        }

        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
