<?php
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
    $mail->Password = 'fqna srbp zdhv ulox';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // 🚀 AQUI (CORREÇÃO DE ACENTOS)
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';
    $mail->Subject = mb_encode_mimeheader('Novo contato do portfólio', 'UTF-8');

    $mail->setFrom('maxebina@gmail.com', 'Portfolio Max');
    $mail->addAddress('maxebina@gmail.com');

    $mail->isHTML(true);

    $mail->Body = "
        Nome: {$_POST['nome']}<br>
        Email: {$_POST['email']}<br>
        Telefone: {$_POST['telefone']}<br>
        Assunto: {$_POST['assunto']}<br>
        Mensagem: {$_POST['mensagem']}
    ";

    $mail->send();
    echo "OK";

} catch (Exception $e) {
    echo "Erro: {$mail->ErrorInfo}";
}