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
$new_email = $data->new_email ?? '';
$new_password = $data->new_password ?? '';
$confirm_new_password = $data->confirm_new_password ?? '';
$token = $data->token ?? '';

$hashed_token = hash("sha512", $token);

if ($action === "ACTIVATE") {
    if ($id !== "" and $token !== "") {
        $select = "SELECT * FROM users WHERE user_id = ? LIMIT 1;";

        $stmt = $conn->prepare($select);
        $stmt->bind_param("s", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if (mysqli_num_rows($result) === 1) {
            $row = $result->fetch_array();

            if ($row['activated_account'] === 1) {
                $message = "This account is already activated";
            } else if ($hashed_token === $row['activate_account_token']) {
                $activate = "UPDATE users SET activate_account_token = NULL, activated_account = 1 WHERE user_id = ?;";

                $activation_stmt = $conn->prepare($activate);
                $activation_stmt->bind_param("s", $id);
                $activation_stmt->execute();

                if ($conn->affected_rows) {
                    $message = "Verification successful";
                } else {
                    $message = $activation_stmt->error;
                }

                $activation_stmt->close();
            } else {
                $message = "Invalid token";
            }
        }

        $stmt->close();
    } else {
        $message = "Missing data";
    }
}

if ($action === "CHANGE-EMAIL") {
    $select = "SELECT * FROM users WHERE user_id = ? LIMIT 1;";

    $stmt = $conn->prepare($select);
    $stmt->bind_param("s", $id);
    $stmt->execute();

    $result = $stmt->get_result();

    if (mysqli_num_rows($result) === 1) {
        $row = $result->fetch_array();

        if ($row['disabled_account'] === 1) {
            $message = "This account is disabled";
        } else {
            if ($hashed_token === $row['email_token']) {
                changeEmail($conn, $id, $new_email, $message);
            } else {
                $message = "Invalid token";
            }
        }
    }
}

if ($action === "REQUEST-RESET-PASSWORD") {
    $select = "SELECT * FROM users WHERE user_email = ? LIMIT 1;";

    $stmt = $conn->prepare($select);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($email === "") {
        $message = "Enter your e-mail";
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "Enter a valid e-mail";
    } else if (mysqli_num_rows($result) === 0) {
        $message = "E-mail is not registered";
    } else if (mysqli_num_rows($result) === 1) {
        $row = $result->fetch_array();

        $now = strtotime($current_datetime);
        $expiry = strtotime($row['reset_token_expires_at'] ?? '');

        if ($now - $expiry > 1800) {
            sendResetPasswordToken($conn, $email, $message);
        } else {
            $message = "Wait a few minutes to request again";
        }
    }

    $stmt->close();
}

if ($action === "RESET-PASSWORD") {
    $select = "SELECT * FROM users WHERE user_email = ? LIMIT 1;";

    $stmt = $conn->prepare($select);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $result = $stmt->get_result();

    if (mysqli_num_rows($result) === 1) {
        $row = $result->fetch_array();

        if ($hashed_token === $row['reset_token']) {
            resetPassword($conn, $email, $new_password, $confirm_new_password, $message);
        } else {
            $message = "Invalid token";
        }
    } else {
        $message = "E-mail is not registered";
    }

    $stmt->close();
}

if ($action !== "") {
    $response[] = array("Message" => $message);
    echo json_encode($response);
}

$conn->close();
exit;
?>