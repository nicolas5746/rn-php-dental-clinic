<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST, PUT");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");

include("conn.php");
include("functions.php");

$appointments = array();
$message = "";
$data = json_decode(file_get_contents("php://input"));

$action = $data->action ?? '';
$id = $data->id ?? '';
$session_token_web = $data->session_token_web ?? '';
$session_token_mobile = $data->session_token_mobile ?? '';
$appt_id = $data->appt_id ?? '';
$appt_type = $data->appt_type ?? '';
$appt_date = $data->appt_date ?? '';
$appt_time = $data->appt_time ?? '';
$is_mobile = $data->is_mobile ?? '';

$session_token = ($is_mobile) ? $session_token_mobile : $session_token_web;

$types = array("consultation", "orthodontics", "whitening", "extractions", "implants");
$hours = array("10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30");

if (is_bool($is_mobile)) {
    if ($id !== "" and $session_token !== "") {
        $query_token = ($is_mobile) ? 'session_token_mobile' : 'session_token_web';

        $select_user = "SELECT * FROM users WHERE user_id = ? AND $query_token = ? LIMIT 1;";

        $user_stmt = $conn->prepare($select_user);
        $user_stmt->bind_param("ss", $id, $session_token);
        $user_stmt->execute();

        $user_result = $user_stmt->get_result();

        if (mysqli_num_rows($user_result) === 1) {
            $user_row = $user_result->fetch_array();

            if ($user_row['disabled_account'] === 1) {
                $message = "This account is disabled";
            } else {
                $valid_date = validateDate($appt_date);
                $req_appt_time = $appt_date . " " . $appt_time . ":00";
                $holidays = ['*-01-01', '*-05-01', '*-12-25'];
                $is_holiday = in_array((new DateTime($appt_date))->format('*-m-d'), $holidays);
                $is_weekend = date('N', strtotime($appt_date)) > 5;
                $date_is_old = $appt_date < $current_date;
                $cancelations = array();

                if ($action === "GET APPOINTMENTS") {
                    $select_appt = "SELECT * FROM appointments WHERE user_id = ?;";

                    $appt_stmt = $conn->prepare($select_appt);
                    $appt_stmt->bind_param("s", $id);
                    $appt_stmt->execute();

                    $appt_result = $appt_stmt->get_result();

                    if (mysqli_num_rows($appt_result) >= 1) {
                        $appt_date_times = array();

                        while ($appt_row = $appt_result->fetch_assoc()) {
                            $appt_date_time = new DateTime($appt_row['appt_date']);
                            $_SESSION['appt_id'] = $appt_row['appt_id'];
                            $_SESSION['appt_type'] = $appt_row['appt_type'];
                            $_SESSION['appt_date'] = $appt_date_time->format("Y/m/d");
                            $_SESSION['appt_time'] = $appt_date_time->format("H:i");
                            $_SESSION['cancelation'] = $appt_row['cancelation'];

                            array_push($cancelations, $appt_row['cancelation']);

                            $seconds_diff = strtotime($appt_row['appt_date']) - strtotime($current_datetime);
                            if ($seconds_diff > 0) {
                                $appointments[] = $_SESSION;
                                if ($appt_row['cancelation'] === 0) array_push($appt_date_times, $appt_row['appt_date']);
                            }
                        }

                        if (count($appointments) > 0) {
                            foreach ($appointments as $appt => $key) {
                                $appt_dates[] = $key['appt_date'];
                                $appt_times[] = $key['appt_time'];
                            }

                            array_multisort($appt_dates, SORT_ASC, $appt_times, SORT_ASC, $appointments);

                            if (count($appt_date_times) > 0) {
                                $message = "Appointments are loaded";
                            } else {
                                $message = "You have no appointments scheduled";
                            }
                        } else {
                            $message = "You have no appointments scheduled";
                        }
                    } else {
                        $message = "You have no appointments scheduled";
                    }

                    $appt_stmt->close();
                }

                if ($action === "CHECK AVAILABILITY") {
                    $all_appts = "SELECT appt_date, cancelation FROM appointments;";
                    $all_appts_stmt = $conn->prepare($all_appts);
                    $all_appts_stmt->execute();

                    $all_appts_result = $all_appts_stmt->get_result();

                    if ($valid_date) {
                        if ($is_weekend or $date_is_old or $is_holiday) $hours = array();
                        if ($is_weekend) {
                            $message = "We are closed on weekends";
                        }else if ($date_is_old) {
                            $message = "That date has already passed";
                        } else if ($is_holiday) {
                            $message = "We are closed on holidays";
                        }  else {
                            if (mysqli_num_rows($all_appts_result) >= 1) {
                                while ($all_appts_row = $all_appts_result->fetch_assoc()) {
                                    $date_time = new DateTime($all_appts_row['appt_date']);
                                    if ($appt_date === $date_time->format("Y-m-d") and $all_appts_row['cancelation'] === 0 and $reserved = array_search($date_time->format("H:i"), $hours)) {
                                        unset($hours[$reserved]);    
                                    }
                                }
                            }
                            $message = "These hours are available";
                        }
                    } else {
                        $message = "Invalid Date";
                    }
                }

                if ($action === "ADD APPOINTMENT") {
                    $all_appts = "SELECT appt_date, cancelation FROM appointments WHERE appt_date = ?;";
                    $all_appts_stmt = $conn->prepare($all_appts);
                    $all_appts_stmt->bind_param("s", $req_appt_time);
                    $all_appts_stmt->execute();
                    $all_appts_result = $all_appts_stmt->get_result();

                    if ($valid_date) {
                        if (!in_array($appt_type, $types)) {
                            $message = "Choose an appointment type";
                        } else if ($date_is_old) {
                            $message = "That date has already passed";
                        } else if ($is_weekend) {
                            $message = "Choose a date between monday and friday";
                        } else if ($is_holiday) {
                            $message = "We are closed on holidays";
                        }  else if (!in_array($appt_time, $hours)) {
                            $message = "Choose an appointment time";
                        } else if (new DateTime($req_appt_time) < new DateTime($appt_date . " " . "10:00:00") or new DateTime($req_appt_time) > new DateTime($appt_date . " " . "17:30:00")) {
                            $message = "Choose a time between 10:00 and 17:30";
                        } else if (mysqli_num_rows($all_appts_result) >= 1) {
                            while ($all_appts_row = $all_appts_result->fetch_assoc()) {
                                array_push($cancelations, $all_appts_row['cancelation']);
                            }

                            if (in_array(0, $cancelations)) {
                                $message = "This time is already taken";
                            } else {
                                scheduleAppt($conn, $id, $appt_type, $req_appt_time, $message);
                            }
                        } else {
                            scheduleAppt($conn, $id, $appt_type, $req_appt_time, $message);
                        }
                    } else {
                        $message = "Invalid Date";
                    }

                    $all_appts_stmt->close();
                }

                if ($action === "CANCEL APPOINTMENT") {
                    $select_appt = "SELECT * FROM appointments WHERE user_id = ?;";

                    $appt_stmt = $conn->prepare($select_appt);
                    $appt_stmt->bind_param("s", $id);
                    $appt_stmt->execute();

                    $appt_result = $appt_stmt->get_result();

                    if (mysqli_num_rows($appt_result) > 0) {
                        $appt_update = "UPDATE appointments SET cancelation = 1 WHERE appt_id = ? LIMIT 1;";

                        $appt_update_stmt = $conn->prepare($appt_update);
                        $appt_update_stmt->bind_param("s", $appt_id);
                        $appt_update_stmt->execute();

                        ($conn->affected_rows) ? $message = "Your appointment has been canceled" : $message = $appt_update_stmt->error;

                        $appt_update_stmt->close();
                    }

                    $appt_stmt->close();
                }
            }
        }

        $user_stmt->close();
    } else {
        $message = "Missing data";
    }
} else {
    $message = "We cannot recognize your device";
}

$response[] = array("Appointments" => $appointments, "Types" => $types, "Hours" => $hours, "Message" => $message);
echo json_encode($response);
$conn->close();
exit;
?>