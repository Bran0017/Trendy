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

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $idCategoria = isset($_GET['idCategoria']) ? $_GET['idCategoria'] : null;
        $data = json_decode(file_get_contents("php://input"), true);
        $nuevaCategoria = isset($data['categoria']) ? $data['categoria'] : null;

        if (!$idCategoria || !$nuevaCategoria) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de categoría y un nuevo nombre de categoría para actualizarla."]);
            exit;
        }

        // Actualizar la categoría en la base de datos
        $sqlUpdate = "UPDATE categorias SET categoria = :categoria WHERE idCategoria = :idCategoria";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':categoria', $nuevaCategoria);
        $sentenciaUpdate->bindParam(':idCategoria', $idCategoria, PDO::PARAM_INT);

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Categoría actualizada correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar la categoría: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }

        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
