<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
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

$mensajeLogin = "";

try {
    $dsn = "mysql:host=$servidor;dbname=$dbname";
    $conexion = new PDO($dsn, $usuario, $contrasena);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $emailLogin = $_POST['email'];
        $contrasenaLogin = $_POST['contrasena'];

        // Verificar las credenciales del usuario
        $sqlCheckCredenciales = "SELECT idUsuario, nombre, email, contrasena, rol FROM `usuarios` WHERE email = :email";
        $stmtCheckCredenciales = $conexion->prepare($sqlCheckCredenciales);
        $stmtCheckCredenciales->bindParam(':email', $emailLogin);
        $stmtCheckCredenciales->execute();

        if ($stmtCheckCredenciales->rowCount() > 0) {
            $row = $stmtCheckCredenciales->fetch(PDO::FETCH_ASSOC);
            $contrasenaHash = $row['contrasena'];

            if (password_verify($contrasenaLogin, $contrasenaHash)) {
                // Iniciar sesión solo si el rol es 'admin'
                if ($row['rol'] == 'admin') {
                    session_start();
                    $_SESSION['usuario_id'] = $row['idUsuario'];
                    $_SESSION['rol'] = $row['rol'];

                    // Añadir nombre y email al array del usuario
                    $usuario = [
                        "idUsuario" => $row['idUsuario'],
                        "nombre" => $row['nombre'],
                        "email" => $row['email'],
                    ];

                    echo json_encode(["mensaje" => "Inicio de sesión exitoso como administrador", "redirect" => "dashboard.php", "usuario" => $usuario]);
                } else {
                    echo json_encode(["error" => "No tienes permisos para acceder"]);
                }
                exit();
            } else {
                echo json_encode(["error" => "Contraseña incorrecta"]);
            }
        } else {
            echo json_encode(["error" => "Usuario no encontrado"]);
        }
    } else {
        echo json_encode(["error" => "Método no permitido"]);
    }
} catch (PDOException $error) {
    echo json_encode(["error" => "Error de conexión: " . $error->getMessage()]);
}
?>
