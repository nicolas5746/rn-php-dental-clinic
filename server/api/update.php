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
$password = $data->password ?? '';
$new_password = $data->new_password ?? '';
$confirm_new_password = $data->confirm_new_password ?? '';
$first_name = $data->first_name ?? '';
$last_name = $data->last_name ?? '';
$profile_picture = $data->profile_picture ?? '';
$cca2 = $data->cca2 ?? '';
$phone = $data->phone ?? '';
$birth_date = $data->birth_date ?? '';
$session_token_web = $data->session_token_web ?? '';
$session_token_mobile = $data->session_token_mobile ?? '';
$is_mobile = $data->is_mobile ?? '';

$session_token = ($is_mobile) ? $session_token_mobile : $session_token_web;

if (is_bool($is_mobile)) {
    if ($id !== "" and $session_token !== "") {
        $query_token = ($is_mobile) ? 'session_token_mobile' : 'session_token_web';

        $select = "SELECT * FROM users WHERE user_id = ? AND $query_token = ? LIMIT 1;";

        $stmt = $conn->prepare($select);
        $stmt->bind_param("ss", $id, $session_token);
        $stmt->execute();

        $result = $stmt->get_result();

        if (mysqli_num_rows($result) === 1) {
            $row = $result->fetch_array();

            if ($row['disabled_account'] === 1) {
                $message = "This account is disabled";
            } else {
                if ($action === "CHANGE-PROFILE") {
                    $age = calculateAge($birth_date);
                    $valid_first_name = testRegEx($string_regex, $first_name);
                    $valid_last_name = testRegEx($string_regex, $last_name);
                    $valid_phone = testRegEx($only_has_numbers_regex, $phone);
                    $valid_date = validateDate($birth_date);

                    if ($profile_picture !== "") updateProfile($conn, $id, $session_token, $is_mobile, 'profile_picture', $profile_picture, $message);

                    if ($first_name !== "" and !$valid_first_name) {
                        $message = "First name must have alphabetic characters only";
                    } else if ($first_name !== "" and strlen($first_name) < 2) {
                        $message = "First name must have at least 2 characters";
                    } else if ($last_name !== "" and !$valid_last_name) {
                        $message = "Last name must have alphabetic characters only";
                    } else if ($last_name !== "" and strlen($last_name) < 2) {
                        $message = "Last name must have at least 2 characters";
                    } else if ($phone !== "" and !$valid_phone) {
                        $message = "Enter a valid phone";
                    } else if ($birth_date !== "") {
                        if ($valid_date) {
                            if ($age < 18) {
                                $message = "You must be at least 18 years old";
                            } else {
                                if ($birth_date !== $row['birth_date']) updateProfile($conn, $id, $session_token, $is_mobile, 'birth_date', $birth_date, $message);
                                if ($first_name !== "" and $first_name !== $row['first_name'] and $valid_first_name) updateProfile($conn, $id, $session_token, $is_mobile, 'first_name', $first_name, $message);
                                if ($last_name !== "" and $last_name !== $row['last_name'] and $valid_last_name) updateProfile($conn, $id, $session_token, $is_mobile, 'last_name', $last_name, $message);
                                if ($phone !== "" and $phone !== $row['phone'] and $valid_phone) {
                                    if (strlen((string)$phone) < 3 or strlen((string)$phone) > 15) {
                                        $message = "Phone number must have between 3 and 15 numbers";
                                    } else {
                                        updateProfile($conn, $id, $session_token, $is_mobile, 'phone', $phone, $message);
                                    }
                                }
                                if ($cca2 !== "" and $cca2 !== $row['cca2']) updateProfile($conn, $id, $session_token, $is_mobile, 'cca2', $cca2, $message);
                            }
                        } else {
                            $message = "Invalid Date";
                        }
                    } else if ($cca2 !== "" and $cca2 !== $row['cca2']) {
                        updateProfile($conn, $id, $session_token, $is_mobile, 'cca2', $cca2, $message);
                    }
                } else {
                    $hashed_password = hash("sha512", $password);

                    if ($action === "REQUEST-CHANGE-EMAIL") {
                        if ($new_email === "" and $password === "") {
                            $message = "Complete all fields";
                        } else if ($new_email === "") {
                            $message = "Enter your e-mail";
                        } else if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
                            $message = "Enter a valid e-mail";
                        } else if ($email === $new_email) {
                            $message = "Enter a new e-mail address";
                        } else if ($password === "") {
                            $message = "Enter your password";
                        } else if ($hashed_password === $row['user_password']) {
                            requestChangeEmail($conn, $id, $new_email, $message);
                        } else {
                            $message = "Wrong password";
                        }
                    }

                    if ($action === "CHANGE-PASSWORD") {
                        $hashed_new_password = hash("sha512", $new_password);
                        $new_password_has_letter = testRegEx($has_letter, $new_password);
                        $new_password_has_number = testRegEx($has_number, $new_password);
                        $new_password_has_special_char = testRegEx($has_special_char, $new_password);

                        if ($password === "") {
                            $message = "Enter your password";
                        } else if ($new_password === "") {
                            $message = "Enter your new password";
                        } else if ($confirm_new_password === "") {
                            $message = "Confirm your new password";
                        } else if ($new_password !== $confirm_new_password) {
                            $message = "Your new password must match";
                        } else if (strlen(($new_password) < 8 or strlen($confirm_new_password) < 8) or (strlen($new_password) > 50 or strlen($confirm_new_password) > 50)) {
                            $message = "Your new password have between 8 and 50 characters";
                        } else if (!$new_password_has_letter or !$new_password_has_number or !$new_password_has_special_char) {
                            $message = "New password must contain at least one letter, one number and one special character";
                        } else {
                            if ($hashed_password === $row['user_password']) {
                                if ($password === $new_password) {
                                    $message = "Enter a new password";
                                } else {
                                    changePassword($conn, $id, $hashed_new_password, $message);
                                }
                            } else {
                                $message = "Wrong password";
                            }
                        }
                    }

                    if ($action === "DISABLE-ACCOUNT") {
                        if ($password === "") {
                            $message = "Enter your password";
                        } else if ($hashed_password === $row['user_password']) {
                            disableAccount($conn, $id, $message);
                        } else {
                            $message = "Wrong password";
                        }
                    }
                }
            }
        }

        $stmt->close();
    } else {
        $message = "Missing data";
    }
} else {
    $message = "We cannot recognize your device";
}

$response[] = array("Message" => $message);
echo json_encode($response);
$conn->close();
exit;
?>