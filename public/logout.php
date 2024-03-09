<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Origin: http://localhost:3000");

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'GET' || $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Destruir todas las variables de sesión
    $_SESSION = array();

    // Si deseas destruir la sesión completamente, borra también la cookie de sesión.
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }

    // Finalmente, destruir la sesión.
    session_destroy();

    // Responder con un mensaje JSON indicando que la sesión se ha cerrado correctamente.
    echo json_encode(["mensaje" => "Sesión cerrada correctamente"]);
    exit();
} else {
    // Si la solicitud no es ni GET ni POST, responder con un mensaje de error.
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}
?>
