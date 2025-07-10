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

$id = bin2hex(random_bytes(16));
$email = $data->email ?? '';
$password = $data->password ?? '';
$confirm_password = $data->confirm_password ?? '';
$first_name = $data->first_name ?? '';
$last_name = $data->last_name ?? '';
$birth_date = $data->birth_date ?? '';
$cca2 = $data->cca2 ?? '';
$phone = $data->phone ?? '';

$data_array = array($email, $password, $confirm_password, $first_name, $last_name, $birth_date, $phone);

if (in_array("", $data_array)) {
    $message = "Complete all fields";
} else {
    $age = calculateAge($birth_date);
    $password_has_letter = testRegEx($has_letter, $password);
    $password_has_number = testRegEx($has_number, $password);
    $password_has_special_char = testRegEx($has_special_char, $password);
    $valid_first_name = testRegEx($string_regex, $first_name);
    $valid_last_name = testRegEx($string_regex, $last_name);
    $valid_phone = testRegEx($only_has_numbers_regex, $phone);
    $valid_date = validateDate($birth_date);

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $select = "SELECT * FROM users WHERE user_email = ? LIMIT 1;";

        $stmt = $conn->prepare($select);
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if (mysqli_num_rows($result) > 0) {
            $message = "E-mail is already registered";
        } else if (!$valid_first_name) {
            $message = "First name must have alphabetic characters only";
        } else if (!$valid_last_name) {
            $message = "Last name must have alphabetic characters only";
        } else if (strlen($first_name) < 2) {
            $message = "First name must have at least 2 characters";
        } else if (strlen($last_name) < 2) {
            $message = "Last name must have at least 2 characters";
        } else if (strlen($password) < 8 or strlen($password) > 50) {
            $message = "Password must have between 8 and 50 characters";
        } else if ($password !== $confirm_password) {
            $message = "Password must match";
        } else if (!$password_has_letter or !$password_has_number or !$password_has_special_char) {
            $message = "Password must contain at least one letter, one number and one special character";
        } else if (!$valid_date) {
            $message = "Invalid Date";
        } else if ($age < 18) {
            $message = "You must be at least 18 years old";
        }  else if ($age > 100) {
            $message = "Please enter your real age";
        } else if ($cca2 === "") {
            $message = "Enter your country code";
        } else if (!$valid_phone) {
            $message = "Enter a valid phone";
        } else if (strlen((string)$phone) < 3 or strlen((string)$phone) > 15) {
            $message = "Phone number must have between 3 and 15 characters";
        } else {
            registerUser($conn, $id, $email, $password, $first_name, $last_name, $birth_date, $cca2, $phone, $message);
        }

        $stmt->close();
    } else {
        $message = "Enter a valid e-mail";
    }
}

$response[] = array("Message" => $message);
echo json_encode($response);
$conn->close();
exit;
?>