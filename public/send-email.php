<?php

if (!empty($_POST['website'])) {
    exit;
}

$email = filter_var(
    $_POST['email'] ?? '',
    FILTER_VALIDATE_EMAIL
);

if (!$email) {
    exit;
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

$mail->isSMTP();

$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'maxebina@gmail.com';
$mail->Password = 'vwtv peed tjro ibsg';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom(
    'maxebina@gmail.com',
    'Portfolio Max'
);

$mail->addAddress(
    'maxebina@gmail.com'
);

$mail->isHTML(true);

$mail->Subject = 'Teste';

$mail->Body = 'Teste';

echo "ANTES SEND<br>";

try {

    $mail->send();

    header("Location: https://www.maxebina.com.br/");
    exit;

} catch (Exception $e) {

    echo "ERRO:<br>";
    echo $mail->ErrorInfo;
}