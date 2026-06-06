<?php

// Honeypot anti-spam
if (!empty($_POST['website'])) {
    exit;
}

// Valida origem
if (
    !isset($_SERVER['HTTP_REFERER']) ||
    strpos($_SERVER['HTTP_REFERER'], 'maxebina.com.br') === false
) {
    exit;
}

// Valida email
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

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'maxebina@gmail.com';
    $mail->Password = 'vwtv peed tjro ibsg';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // 🚀 Encoding correto
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = mb_encode_mimeheader('Novo contato do portfólio', 'UTF-8');

    $mail->setFrom('maxebina@gmail.com', 'Portfolio Max');
    $mail->addAddress('maxebina@gmail.com');

    $mail->isHTML(true);

    $mail->Body = "
    Nome: " . htmlspecialchars($_POST['nome'] ?? '') . "<br>
    Email: " . htmlspecialchars($_POST['email'] ?? '') . "<br>
    Telefone: " . htmlspecialchars($_POST['telefone'] ?? '') . "<br>
    Assunto: " . htmlspecialchars($_POST['assunto'] ?? '') . "<br>
    Mensagem: " . nl2br(htmlspecialchars($_POST['mensagem'] ?? ''));

    $mail->send();

    // 🚀 REDIRECT APÓS SUCESSO
    header("Location: https://www.maxebina.com.br/");
    exit;

} catch (Exception $e) {

    // 🚨 se der erro, não redireciona
    echo "Erro ao enviar mensagem: {$mail->ErrorInfo}";
}