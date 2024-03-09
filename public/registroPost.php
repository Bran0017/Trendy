<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
        $nombre = $_POST['nombre'];
        $email = $_POST['email'];
        $contrasena = $_POST['contrasena'];
        $rol = $_POST['rol'];

        // Verificar si el usuario ya existe
        $sqlVerificar = "SELECT * FROM `usuarios` WHERE email = :email";
        $stmtVerificar = $conexion->prepare($sqlVerificar);
        $stmtVerificar->bindParam(':email', $email);
        $stmtVerificar->execute();
        $existeUsuario = $stmtVerificar->fetch();

        if ($existeUsuario) {
            echo json_encode(["error" => "Ya existe un usuario con ese correo electrónico"]);
        } else {
            // Insertar nuevo usuario si no existe
            if (!empty($nombre) && !empty($email) && !empty($contrasena)  && !empty($rol)) {
                // Verificar la longitud de la contraseña
                if (strlen($contrasena) < 6) {
                    echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
                } else {
                    // Hash de la contraseña
                    $hashContrasena = password_hash($contrasena, PASSWORD_DEFAULT);

                    // Obtener la fecha actual
                    $fechaActual = date("Y-m-d H:i:s");

                    $sqlInsert = "INSERT INTO `usuarios` (nombre, email, contrasena, rol, createdAt) 
                                  VALUES (:nombre, :email, :contrasena, :rol, :createdAt)";
                    $stmt = $conexion->prepare($sqlInsert);
                    $stmt->bindParam(':nombre', $nombre);
                    $stmt->bindParam(':email', $email);
                    $stmt->bindParam(':contrasena', $hashContrasena);
                    $stmt->bindParam(':rol', $rol);
                    $stmt->bindParam(':createdAt', $fechaActual);

                    $stmt->execute();

                    echo json_encode(["mensaje" => "Usuario creado exitosamente"]);
                }
            } else {
                echo json_encode(["error" => "Por favor, complete todos los campos correctamente"]);
            }
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
