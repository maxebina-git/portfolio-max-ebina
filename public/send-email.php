<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

echo "PASSOU 1<br>";

$mail->isSMTP();

echo "PASSOU 2<br>";

$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;

echo "PASSOU 3<br>";

$mail->Username = 'maxebina@gmail.com';
$mail->Password = 'vwtv peed tjro ibsg';

echo "PASSOU 4<br>";

$mail->SMTPSecure = 'tls';
$mail->Port = 587;

echo "PASSOU 5<br>";

$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';

echo "PASSOU 6<br>";

$mail->Subject = mb_encode_mimeheader(
    'Novo contato do portfólio',
    'UTF-8'
);

echo "PASSOU 7<br>";