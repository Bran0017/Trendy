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
        // Verificar si se envió la imagen
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
            // Crear carpeta para imágenes si no existe
            $carpetaImagenes = '../imagenes_banners';
            if (!file_exists($carpetaImagenes)) {
                mkdir($carpetaImagenes, 0777, true);
            }

            // Inicializar ruta de la imagen
            $rutaImagenCompleta = '';

            // Subir la imagen
            $nombreImagen = $_FILES['imagen']['name'];
            $rutaImagen = $carpetaImagenes . '/' . $nombreImagen;
            move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaImagen);
            $rutaImagenCompleta = 'https://www.faugetdigital.shop/' . $rutaImagen;

            // Almacenar enlace completo en la base de datos
            $sqlInsert = "INSERT INTO `banner` (imagen) VALUES (:imagen)";
            $stmt = $conexion->prepare($sqlInsert);
            $stmt->bindParam(':imagen', $rutaImagenCompleta);
            $stmt->execute();

            // Obtener el ID de la última inserción
            $lastId = $conexion->lastInsertId();

            // Obtener la fecha de creación actualizada
            $sqlSelect = "SELECT createdAt FROM `banner` WHERE idBanner = :lastId";
            $stmtSelect = $conexion->prepare($sqlSelect);
            $stmtSelect->bindParam(':lastId', $lastId);
            $stmtSelect->execute();
            $createdAt = $stmtSelect->fetchColumn();

            // Respuesta JSON con enlace de la imagen y fecha de creación
            echo json_encode([
                "mensaje" => "Banner creado exitosamente",
                "imagen" => $rutaImagenCompleta,
                "createdAt" => $createdAt
            ]);
        } else {
            echo json_encode(["error" => "Debe enviarse una imagen"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
