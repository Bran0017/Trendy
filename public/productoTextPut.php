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
        $idProducto = isset($_REQUEST['idProducto']) ? $_REQUEST['idProducto'] : null;
        $data = json_decode(file_get_contents("php://input"), true);
    
        $nuevaDescripcion = isset($data['nuevaDescripcion']) ? $data['nuevaDescripcion'] : null;
        $nuevoTitulo = isset($data['nuevoTitulo']) ? $data['nuevoTitulo'] : null;
        $nuevaCategoria = isset($data['nuevaCategoria']) ? $data['nuevaCategoria'] : null;
        $nuevoPrecio = isset($data['nuevoPrecio']) ? $data['nuevoPrecio'] : null;
        $masVendido = isset($data['masVendido']) ? $data['masVendido'] : null; 

        if (empty($nuevaCategoria)) {
            $sqlSelect = "SELECT categoria FROM productos WHERE idProducto = :idProducto";
            $stmt = $conexion->prepare($sqlSelect);
            $stmt->bindParam(':idProducto', $idProducto, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $nuevaCategoria = $row['categoria'];
        }

        $sqlUpdate = "UPDATE productos SET descripcion = :descripcion, titulo = :titulo,   categoria = :categoria, precio = :precio, masVendido = :masVendido WHERE idProducto = :idProducto";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':descripcion', $nuevaDescripcion);
        $sentenciaUpdate->bindParam(':titulo', $nuevoTitulo);
        $sentenciaUpdate->bindParam(':categoria', $nuevaCategoria); 
        $sentenciaUpdate->bindParam(':precio', $nuevoPrecio);
        $sentenciaUpdate->bindParam(':masVendido', $masVendido); 
        $sentenciaUpdate->bindParam(':idProducto', $idProducto, PDO::PARAM_INT);

        if ($sentenciaUpdate->execute()) {
            echo json_encode(["mensaje" => "Producto actualizado correctamente"]);
        } else {
            echo json_encode(["error" => "Error al actualizar el producto: " . implode(", ", $sentenciaUpdate->errorInfo())]);
        }
        exit;
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
