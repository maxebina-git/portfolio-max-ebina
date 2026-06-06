<?php

$email = isset($_POST['email']) ? $_POST['email'] : '';

$email = filter_var($email, FILTER_VALIDATE_EMAIL);

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

$mail->Subject = mb_encode_mimeheader(
    'Novo contato do portfólio',
    'UTF-8'
);

$nome = isset($_POST['nome']) ? htmlspecialchars($_POST['nome']) : '';
$emailPost = isset($_POST['email']) ? htmlspecialchars($_POST['email']) : '';
$telefone = isset($_POST['telefone']) ? htmlspecialchars($_POST['telefone']) : '';
$assunto = isset($_POST['assunto']) ? htmlspecialchars($_POST['assunto']) : '';
$mensagem = isset($_POST['mensagem']) ? htmlspecialchars($_POST['mensagem']) : '';

$mail->Body = "
Nome: {$nome}<br>
Email: {$emailPost}<br>
Telefone: {$telefone}<br>
Assunto: {$assunto}<br>
Mensagem: " . nl2br($mensagem);

try {

    $mail->send();

    header("Location: https://www.maxebina.com.br/");
    exit;

} catch (\Throwable $e) {

    echo "ERRO AO ENVIAR MENSAGEM:<br>";
    echo $mail->ErrorInfo;

    exit;
}