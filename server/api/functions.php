<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, PUT");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

session_start(); // Initialize session data
date_default_timezone_set("America/Montevideo"); // Set Timezone

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "PHPMailer/Exception.php";
require "PHPMailer/PHPMailer.php";
require "PHPMailer/SMTP.php";
// Access environment variables
$smtp_host = $_ENV["SMTP_HOST"];
$smtp_port = $_ENV["SMTP_PORT"];
$smtp_name = $_ENV["SMTP_NAME"];
$smtp_email = $_ENV["SMTP_EMAIL"];
$smtp_password = $_ENV["SMTP_PASSWORD"];

// ------------------------------------------------------------------------------

$current_date = date('Y-m-d'); // Date. Example: 1990-10-31
$current_datetime = date('Y-m-d H:i:s'); // Datetime. Example: 1990-10-31 17:00:00

$string_regex = "/^[A-Za-z'áéíóúâêôãõñĕäöüčňçøæ ]+$/"; // Only alphabetic values
$only_has_numbers_regex = "/^[\d]+$/"; // Only numeric values
$has_letter = "/[a-z]/i"; // Must have a letter
$has_number = "/\d/"; // Must have a number
$has_special_char = "/\W/"; // Must have a special character

$email_font_family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;";
$official_uri = "https://dentalclinic4u.vercel.app/";
$logo = '<figure style="align-items: center; display: flex; flex-direction: column; justify-content: center; margin-top: 40px;">
            <img src="https://res.cloudinary.com/dgehnwmjf/image/upload/icon_izegzu" alt="Dental Clinic" title="Dental Clinic" style="height: 128px; margin-block: 5px; width: 128px;" />
            <figcaption style="color: #000000; font-weight: 600; font-size: 12pt;">Dental Clinic</figcaption>
        </figure>
        <a
            href=' . $official_uri . '
            rel="noopener noreferrer"
            style="color: #6b7280; font-weight: 400; font-size: 8pt; margin-bottom: 40px; text-decoration: none;"
            target="_blank"
        >' . $official_uri . '</a>';

function mailerSettings(&$mailer)
{
    global $smtp_host;
    global $smtp_port;
    global $smtp_name;
    global $smtp_email;
    global $smtp_password;

    $mailer->isSMTP(); // Set PHPMailer to use SMTP
    $mailer->Host = $smtp_host; // SMTP host name 
    $mailer->SMTPAuth = true; // SMTP host requires authentication to send e-mail
    $mailer->Username = $smtp_email; // Provide username
    $mailer->Password = $smtp_password; // Provide password
    $mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // SMTP Encryption
    $mailer->Port = $smtp_port; // TCP port to connect to

    $mailer->setFrom($smtp_email, $smtp_name);

    $mailer->SMTPOptions = array("ssl" => array(
        "verify_peer"       => false,
        "verify_peer_name"  => false,
        "allow_self_signed" => true
    ));

    $mailer->isHTML(true); // Set e-mail format to HTML
    $mailer->CharSet = "UTF-8";
}

function testRegEx($value, $test)
{
    if (preg_match($value, $test)) {
        return true;
    } else {
        return false;
    }
}

function calculateAge($birth_date)
{
    $date = strtotime($birth_date);
    $today = strtotime(date("Y-m-d"));
    // Calculate the age
    $age = date('Y', $today) - date('Y', $date);
    // Correct age for leap year
    return (date('md', date('U', $date)) > date('md', date('U', $today))) ? (int)$age - 1 : (int)$age;
}

function validateDate($date)
{
    if ($date !== "") {
        list($year, $month, $day) = explode('-', $date);
        return checkdate((int)$month, (int)$day, (int)$year);
    }
}

function registerUser($conn, $id, $email, $password, $first_name, $last_name, $birth_date, $cca2, $phone, &$message)
{
    global $current_date;
    global $email_font_family;
    global $logo;
    global $official_uri;

    $activate_account_token = bin2hex(random_bytes(32));
    $hashed_activate_account_token = hash("sha512", $activate_account_token);
    $activation_link = $official_uri . "account?id=" . $id . "&token=" . $activate_account_token;

    try {
        $mailer = new PHPMailer(true); // Create PHPMailer object

        mailerSettings($mailer);

        $mailer->addAddress($email);
        $mailer->Subject = "Account Verification";
        $mailer->Body = '<div
            style="
                align-items: center;
                background-color: #ffffff;
                color: #000000;
                font-family: ' . $email_font_family . '
                font-size: 14pt;
                font-weight: 500;
                padding: 15px;
                text-align: center;"
        >
            <h1>Hello <span style="color: #ff0000;">' . $first_name . '</span> 👋</h1>
            <p style="font-weight: 400;">Thanks for signing up for Dental Clinic.</p>
            <p style="font-weight: 400;">Please click the button below to activate your account:</p>
            <br />
            <a
                href=' . $activation_link . '
                rel="noopener noreferrer"
                style="text-decoration: none;"
                target="_blank"
            >
                <button
                    style="
                        background-color: #026ac0;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        margin-block: 10px;
                        padding: 10px;"
                >
                    ACTIVATE ACCOUNT
                </button>
            </a>
            ' . $logo . '
        </div>';

        if (!$mailer->send()) {
            $message = $mailer->ErrorInfo;
        } else {
            $mailer->smtpClose();

            $insert = "INSERT INTO users(
                user_id,
                user_email,
                user_password,
                first_name,
                last_name,
                birth_date,
                cca2,
                phone,
                registered,
                activate_account_token
            )
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

            $hashed_password = hash("sha512", $password);

            $stmt = $conn->prepare($insert);
            $stmt->bind_param("ssssssssss", $id, $email, $hashed_password, $first_name, $last_name, $birth_date, $cca2, $phone, $current_date, $hashed_activate_account_token);
            $stmt->execute();
            $stmt->close();

            if ($conn->affected_rows) {
                $message = "Registration successful";
            } else {
                $message = $stmt->error;
            }
        }
    } catch (Exception $error) {
        $message = $error->getMessage();
    }
}

function addLoginAttempt($conn, $email)
{
    $update = "UPDATE users SET login_attempts = login_attempts + 1 WHERE user_email = ?;";

    $stmt = $conn->prepare($update);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->close();
}

function setSession($row, $is_mobile, $hashed_session_token)
{
    $_SESSION['user_id'] = $row['user_id'];
    $_SESSION['user_email'] = $row['user_email'];
    $_SESSION['first_name'] = $row['first_name'];
    $_SESSION['last_name'] = $row['last_name'];
    $_SESSION['cca2'] = $row['cca2'];
    $_SESSION['phone'] = $row['phone'];
    $_SESSION['birth_date'] = $row['birth_date'];
    $_SESSION['age'] = calculateAge($row['birth_date']);
    $_SESSION['profile_picture'] = $row['profile_picture'];
    $_SESSION['registered'] = $row['registered'];
    if ($is_mobile) {
        $_SESSION['session_token_mobile'] = $hashed_session_token;
    } else {
        $_SESSION['session_token_web'] = $hashed_session_token;
    }
}

function logIn($conn, $email, $password, $hashed_session_token, $row, $is_mobile, &$message)
{
    global $current_datetime;

    $hashed_password = hash("sha512", $password);
    $session_token = ($is_mobile) ? $row['session_token_mobile'] : $row['session_token_web'];

    if ($row['activated_account'] === 1) {
        if ($password === "") {
            $message = "Enter your password";
        } else if ($hashed_password === $row['user_password']) {
            if ($session_token === NULL) {
                $message = "Connected";
                setSession($row, $is_mobile, $hashed_session_token);
            } else {
                $message = "You already have an active session";
            }
        } else {
            $message = "Wrong password";

            if ($row['login_attempts'] === 5) {
                $update = "UPDATE users SET blocked_initial_datetime = NULL, login_attempts = 1 WHERE user_email = ?;";

                $stmt = $conn->prepare($update);
                $stmt->bind_param("s", $email);
                $stmt->execute();
                $stmt->close();
            }

            if ($row['login_attempts'] < 2) {
                addLoginAttempt($conn, $email);
            } else if ($row['login_attempts'] === 2) {
                addLoginAttempt($conn, $email);
                $message = "You have 2 login attempts left";
            } else if ($row['login_attempts'] === 3) {
                addLoginAttempt($conn, $email);
                $message = "You have 1 login attempts left";
            } else if ($row['login_attempts'] === 4) {
                addLoginAttempt($conn, $email);
                $update = "UPDATE users SET blocked_initial_datetime = ? WHERE user_email = ?;";

                $stmt = $conn->prepare($update);
                $stmt->bind_param("ss", $current_datetime, $email);
                $stmt->execute();
                $stmt->close();

                $message = "Maximum login attempts reached";
            }
        }
    } else {
        $message = "Check your e-mail and activate your account";
    }
}

function requestChangeEmail($conn, $id, $new_email, &$message)
{
    global $email_font_family;
    global $logo;
    global $official_uri;

    $email_token = bin2hex(random_bytes(32));
    $change_email_link = $official_uri . "account?id=" . $id . "&new_email=" . $new_email . "&token=" . $email_token;

    try {
        $mailer = new PHPMailer(true); // Create PHPMailer object

        mailerSettings($mailer);

        $mailer->addAddress($new_email);
        $mailer->Subject = "Update your e-mail";
        $mailer->Body = '<div
            style="
                align-items: center;
                background-color: #ffffff;
                color: #000000;
                font-family: ' . $email_font_family . '
                font-size: 14pt;
                font-weight: 500;
                padding: 15px;
                text-align: center;"
        >
            <p style="font-weight: 400;">We received a request to update your Dental Clinic\'s e-mail address.</p>
            <p style="font-weight: 400;">Please click the button below to update your e-mail address:</p>
            <br />
            <a
                href=' . $change_email_link . '
                rel="noopener noreferrer"
                style="text-decoration: none;"
                target="_blank"
            >
                <button
                    style="
                        background-color: #026ac0;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        margin-block: 10px;
                        padding: 10px;"
                >
                    UPDATE E-MAIL
                </button>
            </a>
            ' . $logo . '
        </div>';

        if (!$mailer->send()) {
            $message = $mailer->ErrorInfo;
        } else {
            $mailer->smtpClose();

            $hashed_email_token = hash("sha512", $email_token);

            $update = "UPDATE users SET email_token = ? WHERE user_id = ?;";

            $stmt = $conn->prepare($update);
            $stmt->bind_param("ss", $hashed_email_token, $id);
            $stmt->execute();
            $stmt->close();

            if ($conn->affected_rows) {
                $message = "Please confirm your new e-mail";
            } else {
                $message = $stmt->error;
            }
        }
    } catch (Exception $error) {
        $message = $error->getMessage();
    }
}

function changeEmail($conn, $id, $new_email, &$message)
{
    $update = "UPDATE users SET user_email = ?, email_token = NULL WHERE user_id = ?;";

    $stmt = $conn->prepare($update);
    $stmt->bind_param("ss", $new_email, $id);
    $stmt->execute();
    $stmt->close();

    ($conn->affected_rows) ? $message = "E-mail updated" : $message = $stmt->error;
}

function changePassword($conn, $id, $hashed_new_password, &$message)
{
    $update = "UPDATE users SET user_password = ? WHERE user_id = ?;";

    $stmt = $conn->prepare($update);
    $stmt->bind_param("ss", $hashed_new_password, $id);
    $stmt->execute();
    $stmt->close();

    ($conn->affected_rows) ? $message = "Password updated" : $message = $stmt->error;
}

function disableAccount($conn, $id, &$message)
{
    $update = "UPDATE users SET disabled_account = 1 WHERE user_id = ?;";

    $stmt = $conn->prepare($update);
    $stmt->bind_param("s", $id);
    $stmt->execute();

    if ($conn->affected_rows) {
        $message = "Your account has been disabled";
    } else {
        $message = $stmt->error;
    }

    $stmt->close();
}

function updateProfile($conn, $id, $session_token, $is_mobile, $column, $set_value, &$message)
{
    $query_token = ($is_mobile) ? 'session_token_mobile' : 'session_token_web';
    $update = "UPDATE users SET $column = '$set_value' WHERE user_id = ? AND $query_token = ? LIMIT 1;";

    $stmt = $conn->prepare($update);
    $stmt->bind_param("ss", $id, $session_token);
    $stmt->execute();

    ($conn->affected_rows) ? $message = "Profile updated" : $message = $stmt->error;

    $stmt->close();
}

function sendResetPasswordToken($conn, $email, &$message)
{
    global $current_datetime;
    global $email_font_family;
    global $logo;
    global $official_uri;

    $reset_password_token = bin2hex(random_bytes(32));
    $reset_password_link = $official_uri . "account?email=" . $email . "&token=" . $reset_password_token;

    try {
        $mailer = new PHPMailer(true); // Create PHPMailer object

        mailerSettings($mailer);

        $mailer->addAddress($email);
        $mailer->Subject = "Reset your password";
        $mailer->Body = '<div
            style="
                align-items: center;
                background-color: #ffffff;
                color: #000000;
                font-family: ' . $email_font_family . '
                font-size: 14pt;
                font-weight: 500;
                padding: 15px;
                text-align: center;"
        >
            <p style="font-weight: 400;">We received a request to reset password of your Dental Clinic\'s account.</p>
            <p style="font-weight: 400;">Please click the button below to reset your password:</p>
            <br />
            <a
                href=' . $reset_password_link . '
                rel="noopener noreferrer"
                style="text-decoration: none;"
                target="_blank"
            >
                <button
                    style="
                        background-color: #026ac0;
                        color: #ffffff;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        margin-block: 10px;
                        padding: 10px;"
                >
                    RESET PASSWORD
                </button>
            </a>
            <p style="color: #6b7280; font-weight: 400; font-size: 8pt;">This link is valid for 30 minutes</p>
            ' . $logo . '
        </div>';

        if (!$mailer->send()) {
            $message = $mailer->ErrorInfo;
        } else {
            $mailer->smtpClose();

            $time = new DateTime($current_datetime);
            $time->modify('+30 minutes');
            $expire_time = $time->format('Y-m-d H:i:s');

            $hashed_reset_password_token = hash("sha512", $reset_password_token);

            $update = "UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE user_email = ?;";

            $stmt = $conn->prepare($update);
            $stmt->bind_param("sss", $hashed_reset_password_token, $expire_time, $email);
            $stmt->execute();
            $stmt->close();

            if ($conn->affected_rows) {
                $message = "E-mail has been sended";
            } else {
                $message = $stmt->error;
            }
        }
    } catch (Exception $error) {
        $message = $error->getMessage();
    }
}

function resetPassword($conn, $email, $new_password, $confirm_new_password, &$message)
{
    global $has_letter;
    global $has_number;
    global $has_special_char;

    $new_password_has_letter = testRegEx($has_letter, $new_password);
    $new_password_has_number = testRegEx($has_number, $new_password);
    $new_password_has_special_char = testRegEx($has_special_char, $new_password);

    if ($new_password === "") {
        $message = "Enter your new password";
    } else if ($confirm_new_password === "") {
        $message = "Confirm your new password";
    } else if (strlen(($new_password) < 8 or strlen($confirm_new_password) < 8) or (strlen($new_password) > 50 or strlen($confirm_new_password) > 50)) {
        $message = "Your new password have between 8 and 50 characters";
    } else if (!$new_password_has_letter or !$new_password_has_number or !$new_password_has_special_char) {
        $message = "New password must contain at least one letter, one number and one special character";
    } else if ($new_password !== $confirm_new_password) {
        $message = "Your new password must match";
    } else {
        $hashed_new_password = hash("sha512", $new_password);

        $update = "UPDATE users SET user_password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE user_email = ? LIMIT 1;";

        $stmt = $conn->prepare($update);
        $stmt->bind_param("ss", $hashed_new_password, $email);
        $stmt->execute();

        if ($conn->affected_rows) {
            $message = "Your password has been reseted";
        } else {
            $message = $stmt->error;
        }

        $stmt->close();
    }
}

function scheduleAppt($conn, $id, $appt_type, $req_appt_time, &$message)
{
    global $current_datetime;

    $seconds_diff = strtotime($req_appt_time) - strtotime($current_datetime);
    if ($seconds_diff > 3600) {
        $insert = "INSERT INTO appointments(user_id, appt_type, appt_date) VALUES(?, ?, ?);";

        $stmt = $conn->prepare($insert);
        $stmt->bind_param("sss", $id, $appt_type, $req_appt_time);
        $stmt->execute();
        $stmt->close();

        if ($conn->affected_rows) {
            $message = "Booked successfully";
        } else {
            $message = $stmt->error;
        }
    } else {
        $message = "It's too late, choose another time";
    }
}
?>