<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {

    // =========================
    // SMTP CONFIG (GMAIL)
    // =========================
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'maxebina@gmail.com';
    $mail->Password = 'fqna srbp zdhv ulox';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    // =========================
    // ENCODING (CORREÇÃO Acentos)
    // =========================
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';

    // =========================
    // DESTINATÁRIO
    // =========================
    $mail->setFrom('maxebina@gmail.com', 'Portfolio Max');
    $mail->addAddress('maxebina@gmail.com');

    // =========================
    // SUBJECT
    // =========================
    $mail->Subject = mb_encode_mimeheader(
        'Novo contato do portfólio',
        'UTF-8'
    );

    // =========================
    // BODY
    // =========================
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $telefone = $_POST['telefone'] ?? '';
    $assunto = $_POST['assunto'] ?? '';
    $mensagem = $_POST['mensagem'] ?? '';

    $mail->isHTML(true);

    $mail->Body = "
        <strong>Nome:</strong> {$nome}<br>
        <strong>Email:</strong> {$email}<br>
        <strong>Telefone:</strong> {$telefone}<br>
        <strong>Assunto:</strong> {$assunto}<br>
        <strong>Mensagem:</strong><br>{$mensagem}
    ";

    $mail->AltBody = strip_tags($mail->Body);

    // =========================
    // SEND
    // =========================
    $mail->send();

    echo "OK";

} catch (Exception $e) {
    echo "Erro: {$mail->ErrorInfo}";
}