<?php
header("Content-Type: application/json");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require __DIR__.'/vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$servidor = $_ENV['DB_HOST'] . ':' . $_ENV['DB_PORT'];
$usuario = $_ENV['DB_USER'];
$contrasena = $_ENV['DB_PASS'];
$dbname = $_ENV['DB_NAME'];

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $codigo = $_POST['codigo'];
        $descuento = isset($_POST['descuento']) ? $_POST['descuento'] : 0.00;

        if (!empty($codigo)) {
            // Verificar si el código ya existe
            $sqlCheck = "SELECT idCodigo FROM `codigos` WHERE codigo = :codigo";
            $stmtCheck = $conexion->prepare($sqlCheck);
            $stmtCheck->bindParam(':codigo', $codigo);
            $stmtCheck->execute();

            if ($stmtCheck->rowCount() > 0) {
                echo json_encode(["error" => "El código ya existe"]);
            } else {
                // Almacenar en la base de datos
                $sqlInsert = "INSERT INTO `codigos` (codigo, descuento) VALUES (:codigo, :descuento)";
                $stmt = $conexion->prepare($sqlInsert);
                $stmt->bindParam(':codigo', $codigo);
                $stmt->bindParam(':descuento', $descuento);
                $stmt->execute();

                // Obtener el ID de la última inserción
                $lastId = $conexion->lastInsertId();

                // Respuesta JSON con ID del código creado
                echo json_encode([
                    "mensaje" => "Código creado exitosamente",
                    "idCodigo" => $lastId
                ]);
            }
        } else {
            echo json_encode(["error" => "Por favor, proporcione el código"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}

?>