<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, PUT");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

include("conn.php");
include("functions.php");

$message = "";
$data = json_decode(file_get_contents("php://input"));

$action = $data->action ?? '';
$id = $data->id ?? '';
$email = $data->email ?? '';
$password = $data->password ?? '';
$session_token_web = $data->session_token_web ?? '';
$session_token_mobile = $data->session_token_mobile ?? '';
$is_mobile = $data->is_mobile ?? '';

if (is_bool($is_mobile)) {
    if ($action === "LOGIN") {
        $session_token = bin2hex(random_bytes(32));
        $hashed_session_token = hash("sha512", $session_token);

        if ($email === "" and $password === "") {
            $message = "Enter e-mail and password";
        } else if ($email === "" and $password !== "") {
            $message = "Enter your e-mail";
        } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $message = "Enter a valid e-mail";
        } else {
            $select = "SELECT * FROM users WHERE user_email = ? LIMIT 1;";

            $stmt = $conn->prepare($select);
            $stmt->bind_param("s", $email);
            $stmt->execute();

            $result = $stmt->get_result();

            if (mysqli_num_rows($result) === 1) {
                $row = $result->fetch_array();

                if ($row['blocked_initial_datetime'] === NULL) {
                    logIn($conn, $email, $password, $hashed_session_token, $row, $is_mobile, $message);
                } else {
                    $seconds_diff = strtotime($current_datetime) - strtotime($row['blocked_initial_datetime']);

                    if ($seconds_diff > 7200) {
                        $reset_block = "UPDATE users SET blocked_initial_datetime = NULL, login_attempts = 0 WHERE user_email = ?;";

                        $reset_block_stmt = $conn->prepare($reset_block);
                        $reset_block_stmt->bind_param("s", $email);
                        $reset_block_stmt->execute();
                        $reset_block_stmt->close();

                        logIn($conn, $email, $password, $hashed_session_token, $row, $is_mobile, $message);
                    } else {
                        $message = "Your account has been blocked, try again later";
                    }
                }
            } else {
                $message = "E-mail is not registered";
            }

            $stmt->close();
        }

        if ($message === "Connected") {

            $query_token = ($is_mobile) ? 'session_token_mobile' : 'session_token_web';
            $update = "UPDATE users SET last_logged_in = ?, $query_token = ?, email_token = NULL, reset_token = NULL, reset_token_expires_at = NULL, blocked_initial_datetime = NULL, login_attempts = 0, disabled_account = 0 WHERE user_email = ?;";

            $stmt = $conn->prepare($update);
            $stmt->bind_param("sss", $current_datetime, $hashed_session_token, $email);
            $stmt->execute();
            $stmt->close();

            if ($conn->affected_rows) {
                if ($is_mobile) {
                    $_SESSION['session_token_mobile'] = $hashed_session_token;
                } else {
                    $_SESSION['session_token_web'] = $hashed_session_token;
                }
            } else {
                $message = "Could not connect to your account";
            }
        }

        $response[] = array("Info" => $_SESSION, "Message" => $message);
    }

    if ($action === "LOGOUT") {
        $session_token = ($is_mobile) ? $session_token_mobile : $session_token_web;

        if ($id !== "" and $session_token !== "") {

            $query_token = ($is_mobile) ? 'session_token_mobile' : 'session_token_web';
            $update = "UPDATE users SET $query_token = NULL WHERE user_id = ? AND $query_token = ? LIMIT 1;";

            $stmt = $conn->prepare($update);
            $stmt->bind_param("ss", $id, $session_token);
            $stmt->execute();

            if ($conn->affected_rows) {
                $message = "Disconnected";
                $_SESSION = array();
                session_destroy();
            } else {
                $message = $stmt->error;
            }

            $stmt->close();
        }
    }
} else {
    $message = "We cannot recognize your device";
}

if ($action !== "LOGIN") $response[] = array("Message" => $message);

echo json_encode($response);
$conn->close();
exit;
?>