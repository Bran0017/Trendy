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
        $subcategoria = $_POST['subcategoria']; // Cambio de variable a "subcategoria"

        if (!empty($subcategoria)) {
            // Verificar si la subcategoría ya existe
            $sqlCheck = "SELECT idSubCategoria FROM `subcategorias` WHERE subcategoria = :subcategoria"; // Cambio en la consulta SQL
            $stmtCheck = $conexion->prepare($sqlCheck);
            $stmtCheck->bindParam(':subcategoria', $subcategoria); // Cambio en el parámetro de enlace
            $stmtCheck->execute();

            if ($stmtCheck->rowCount() > 0) {
                echo json_encode(["error" => "La subcategoría ya existe"]);
            } else {
                // Almacenar en la base de datos
                $sqlInsert = "INSERT INTO `subcategorias` (subcategoria) VALUES (:subcategoria)"; // Cambio en la consulta SQL
                $stmt = $conexion->prepare($sqlInsert);
                $stmt->bindParam(':subcategoria', $subcategoria); // Cambio en el parámetro de enlace
                $stmt->execute();

                // Obtener el ID de la última inserción
                $lastId = $conexion->lastInsertId();

                // Respuesta JSON con ID de la subcategoría creada
                echo json_encode([
                    "mensaje" => "Subcategoría creada exitosamente",
                    "idSubCategoria" => $lastId // Cambio en el nombre del ID
                ]);
            }
        } else {
            echo json_encode(["error" => "Por favor, proporcione el nombre de la subcategoría"]); // Cambio en el mensaje de error
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
