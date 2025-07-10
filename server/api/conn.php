<?php
// Access environment variables
$host = $_ENV["DB_HOST"];
$database = $_ENV["DB_NAME"];
$port = $_ENV["DB_PORT"];
$username = $_ENV["DB_USERNAME"];
$password = $_ENV["DB_PASSWORD"];
// Open a new connection
$conn = new mysqli($host, $username, $password, $database, $port);
// Checking for connection error
if ($conn->connect_errno) {
    exit($conn->connect_error);
}
// Return the connection
return $conn;
?>