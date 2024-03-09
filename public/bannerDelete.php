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
$mensaje = "";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $idBanner = isset($_GET['idBanner']) ? $_GET['idBanner'] : null;

        if (!$idBanner) {
            echo json_encode(["error" => "Se requiere proporcionar un ID de banner para eliminarlo."]);
            exit;
        }

        // Obtener nombres de archivo de la base de datos
        $sqlSelectImagenes = "SELECT imagen FROM banner WHERE idBanner = :idBanner";
        $sentenciaSelectImagenes = $conexion->prepare($sqlSelectImagenes);
        $sentenciaSelectImagenes->bindParam(':idBanner', $idBanner, PDO::PARAM_INT);
        $sentenciaSelectImagenes->execute();
        $imagen = $sentenciaSelectImagenes->fetchColumn();

        // Eliminar el banner de la base de datos
        $sqlDelete = "DELETE FROM banner WHERE idBanner = :idBanner";
        $sentenciaDelete = $conexion->prepare($sqlDelete);
        $sentenciaDelete->bindParam(':idBanner', $idBanner, PDO::PARAM_INT);

        if ($sentenciaDelete->execute()) {
            // Eliminar archivo de la carpeta imagenes_banners
            $carpetaImagenes = '../imagenes_banners/';
            if ($imagen && file_exists($carpetaImagenes . basename($imagen))) {
                unlink($carpetaImagenes . basename($imagen));
            }

            echo json_encode(["mensaje" => "Banner y archivo de imagen asociado eliminados correctamente"]);
        } else {
            echo json_encode(["error" => "Error al eliminar el banner"]);
        }

        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
