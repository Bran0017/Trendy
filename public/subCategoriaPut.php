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
        $idSubCategoria = isset($_GET['idSubCategoria']) ? $_GET['idSubCategoria'] : null; 
        $data = json_decode(file_get_contents("php://input"), true);
        $nuevaSubcategoria = isset($data['subcategoria']) ? $data['subcategoria'] : null; 

        if (!$idSubCategoria || !$nuevaSubcategoria) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de subcategoría y un nuevo nombre de subcategoría para actualizarla."]); // Cambio en el mensaje de error
            exit;
        }

        // Actualizar la subcategoría en la base de datos
        $sqlUpdate = "UPDATE subcategorias SET subcategoria = :subcategoria WHERE idSubCategoria = :idSubCategoria"; 
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':subcategoria', $nuevaSubcategoria); 
        $sentenciaUpdate->bindParam(':idSubCategoria', $idSubCategoria, PDO::PARAM_INT); 

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Subcategoría actualizada correctamente"]); 
        } else {
            echo json_encode(["error" => "Error al actualizar la subcategoría: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }

        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
