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

         // Agregar campos del 1 al 15 como items
         $item1 = isset($data['item1']) ? $data['item1'] : null;
         $item2 = isset($data['item2']) ? $data['item2'] : null;
         $item3 = isset($data['item3']) ? $data['item3'] : null;
         $item4 = isset($data['item4']) ? $data['item4'] : null;
         $item5 = isset($data['item5']) ? $data['item5'] : null;
         $item6 = isset($data['item6']) ? $data['item6'] : null;
         $item7 = isset($data['item7']) ? $data['item7'] : null;
         $item8 = isset($data['item8']) ? $data['item8'] : null;
         $item9 = isset($data['item9']) ? $data['item9'] : null;
         $item10 = isset($data['item10']) ? $data['item10'] : null;
         $precioAnterior = isset($data['precioAnterior']) ? $data['precioAnterior'] : null;
 
        if (empty($nuevaCategoria)) {
            $sqlSelect = "SELECT categoria FROM productos WHERE idProducto = :idProducto";
            $stmt = $conexion->prepare($sqlSelect);
            $stmt->bindParam(':idProducto', $idProducto, PDO::PARAM_INT);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $nuevaCategoria = $row['categoria'];
        }

        $sqlUpdate = "UPDATE productos SET descripcion = :descripcion, titulo = :titulo, categoria = :categoria, precio = :precio, masVendido = :masVendido, 
        item1 = :item1, item2 = :item2, item3 = :item3, item4 = :item4, item5 = :item5, item6 = :item6, item7 = :item7, item8 = :item8, 
        item9 = :item9, item10 = :item10, precioAnterior = :precioAnterior
        WHERE idProducto = :idProducto";
        $sentenciaUpdate = $conexion->prepare($sqlUpdate);
        $sentenciaUpdate->bindParam(':descripcion', $nuevaDescripcion);
        $sentenciaUpdate->bindParam(':titulo', $nuevoTitulo);
        $sentenciaUpdate->bindParam(':categoria', $nuevaCategoria); 
        $sentenciaUpdate->bindParam(':precio', $nuevoPrecio);
        $sentenciaUpdate->bindParam(':masVendido', $masVendido); 
        $sentenciaUpdate->bindParam(':item1', $item1); 
        $sentenciaUpdate->bindParam(':item2', $item2); 
        $sentenciaUpdate->bindParam(':item3', $item3); 
        $sentenciaUpdate->bindParam(':item4', $item4); 
        $sentenciaUpdate->bindParam(':item5', $item5); 
        $sentenciaUpdate->bindParam(':item6', $item6); 
        $sentenciaUpdate->bindParam(':item7', $item7); 
        $sentenciaUpdate->bindParam(':item8', $item8); 
        $sentenciaUpdate->bindParam(':item9', $item9); 
        $sentenciaUpdate->bindParam(':item10', $item10);  
        $sentenciaUpdate->bindParam(':precioAnterior', $precioAnterior);  
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
