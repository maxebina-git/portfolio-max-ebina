<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

echo "PHP OK<br>";

$mail = new PHPMailer(true);

$mail->isSMTP();

$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'maxebina@gmail.com';
$mail->Password = 'vwtv peed tjro ibsg';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

echo "CONFIG SMTP OK<br>";

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

    echo "DEPOIS SEND<br>";

} catch (Exception $e) {

    echo "ERRO:<br>";
    echo $mail->ErrorInfo;
}